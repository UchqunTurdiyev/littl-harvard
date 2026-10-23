import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  encodePayload,
  normalizePhone,
  sendCapiEvent,
  sha256,
  signLink,
  splitName,
  type LeadPayload,
} from "@/lib/meta";
import { esc, leadKeyboard, tg } from "@/lib/telegram";
import { SITE_URL } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  name?: string;
  phone?: string;
  address?: string;
  eventId?: string;
  url?: string;
  hp?: string; // honeypot (botlar uchun)
};

export async function POST(req: NextRequest) {
  let b: Body;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Noto'g'ri so'rov" }, { status: 400 });
  }

  // Spam-bot himoyasi
  if (b.hp) return NextResponse.json({ ok: true, id: "x" });

  const name = (b.name || "").trim().slice(0, 80);
  const address = (b.address || "").trim().slice(0, 200);
  const phone = normalizePhone(b.phone || "");

  if (name.length < 2)
    return NextResponse.json({ ok: false, error: "Ismingizni kiriting" }, { status: 400 });
  if (!phone)
    return NextResponse.json({ ok: false, error: "Telefon raqam noto'g'ri" }, { status: 400 });
  if (address.length < 3)
    return NextResponse.json({ ok: false, error: "Manzilni kiriting" }, { status: 400 });

  const id =
    b.eventId && /^[a-zA-Z0-9_-]{8,64}$/.test(b.eventId)
      ? b.eventId
      : "lh_" + crypto.randomUUID().replace(/-/g, "").slice(0, 20);

  // Cookie / so'rov ma'lumotlari
  const fbp = req.cookies.get("_fbp")?.value;
  const fbc = req.cookies.get("_fbc")?.value;
  let utm: Record<string, string> = {};
  try {
    utm = JSON.parse(decodeURIComponent(req.cookies.get("lh_utm")?.value || "{}"));
  } catch {}
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    undefined;
  const ua = req.headers.get("user-agent") || undefined;
  const url = (b.url || req.headers.get("referer") || "").slice(0, 300) || undefined;

  const { fn, ln } = splitName(name);
  const p: LeadPayload = {
    id,
    n: name,
    ph: sha256(phone),
    fn: fn ? sha256(fn) : undefined,
    ln: ln ? sha256(ln) : undefined,
    xid: sha256(id),
    fbp,
    fbc,
    ip,
    ua,
    url,
    t: Math.floor(Date.now() / 1000),
  };

  // 1) Meta CAPI — Lead (brauzer Pixel bilan bir xil event_id → dublikat bo'lmaydi)
  const capi = await sendCapiEvent({ eventName: "Lead", eventId: id, p });

  // 2) Telegram — lid kartasi
  const pretty = `+${phone.slice(0, 3)} ${phone.slice(3, 5)} ${phone.slice(5, 8)} ${phone.slice(8, 10)} ${phone.slice(10)}`;
  const utmLine = Object.keys(utm).length
    ? Object.entries(utm)
        .map(([k, v]) => `${k.replace("utm_", "")}: ${esc(String(v))}`)
        .join(" | ")
    : "—";
  const time = new Date().toLocaleString("ru-RU", { timeZone: "Asia/Tashkent" });

  // Karta faqat operatorga kerakli ma'lumotni ko'rsatadi.
  // Xeshlar, cookie va Meta holati "Sotib oldi" tugmasi ochadigan sahifada.
  const text = [
    `🎓 <b>YANGI ARIZA — Little Harvard</b>`,
    ``,
    `👤 <b>Ism:</b> ${esc(name)}`,
    `📞 <b>Telefon:</b> +${phone} (${pretty})`,
    `📍 <b>Manzil:</b> ${esc(address)}`,
    `🕒 <b>Vaqt:</b> ${time}`,
    `📊 <b>UTM:</b> ${utmLine}`,
    capi.ok ? "" : `\n⚠️ Meta Lead yuborilmadi: ${esc(capi.info)}`,
  ]
    .join("\n")
    .trimEnd();

  const sent = await tg<{ message_id: number }>("sendMessage", {
    chat_id: process.env.TELEGRAM_CHAT_ID,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
    reply_markup: leadKeyboard(id, null),
  });

  // Havolaga xabar ID'si kerak (sotuvdan keyin tugmani yangilash uchun) — shuning uchun keyin qo'shamiz
  if (sent.ok && sent.result) {
    const d = encodePayload(p);
    const m = String(sent.result.message_id);
    const saleUrl = `${SITE_URL}/sotuv?d=${d}&m=${m}&s=${signLink(d, m)}`;
    const edited = await tg("editMessageReplyMarkup", {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      message_id: sent.result.message_id,
      reply_markup: leadKeyboard(id, saleUrl),
    });
    if (!edited.ok) console.error("Telegram tugma xato:", edited.description);
  }

  if (!sent.ok) {
    console.error("Telegram xato:", sent.description);
    // Lid yo'qolmasin — server logiga yozib qo'yamiz
    console.log("LEAD", JSON.stringify({ name, phone, address, id }));
  }

  return NextResponse.json({ ok: true, id });
}
