import { NextRequest, NextResponse } from "next/server";
import { decodePayload, QUALIFIED_EVENT, sendCapiEvent, verifyLink } from "@/lib/meta";
import { esc, fmtSum, parseAmount, soldKeyboard, tg } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = { d?: string; m?: string; s?: string; amount?: string };

// /sotuv sahifasidagi forma: summa → Meta Purchase → Telegram kartasi yangilanadi
export async function POST(req: NextRequest) {
  const b: Body = await req.json().catch(() => ({}));
  const d = b.d || "";
  const m = b.m || "";

  if (!verifyLink(d, m, b.s || ""))
    return NextResponse.json({ ok: false, error: "Havola noto'g'ri yoki eskirgan" }, { status: 401 });

  const p = decodePayload(d);
  if (!p) return NextResponse.json({ ok: false, error: "Lid ma'lumoti o'qilmadi" }, { status: 400 });

  const amount = parseAmount(String(b.amount || ""));
  if (!amount || amount > 10_000_000_000)
    return NextResponse.json({ ok: false, error: "Summani to'g'ri kiriting" }, { status: 400 });

  // event_id doimiy → tasodifan ikki marta yuborilsa ham Meta bittasini hisoblaydi
  const capi = await sendCapiEvent({ eventName: "Purchase", eventId: `pur_${p.id}`, p, value: amount });
  if (!capi.ok)
    return NextResponse.json({ ok: false, error: `Meta: ${capi.info}` }, { status: 502 });

  // Sotib olgan mijoz — albatta sifatli lid (oldin yuborilgan bo'lsa, Meta dublikatni o'chiradi)
  await sendCapiEvent({ eventName: QUALIFIED_EVENT, eventId: `q_${p.id}`, p });

  const chat_id = process.env.TELEGRAM_CHAT_ID;
  await tg("editMessageReplyMarkup", {
    chat_id,
    message_id: Number(m),
    reply_markup: soldKeyboard(p.id, amount),
  });
  await tg("sendMessage", {
    chat_id,
    reply_to_message_id: Number(m),
    parse_mode: "HTML",
    text: `✅ <b>Purchase Metaga yuborildi</b>\n👤 ${esc(p.n)}\n💵 ${fmtSum(amount)}\n📡 ${esc(capi.info)}`,
  });

  return NextResponse.json({ ok: true, amount, info: capi.info });
}
