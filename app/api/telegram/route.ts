import { NextRequest, NextResponse } from "next/server";
import { decodePayload, QUALIFIED_EVENT, sendCapiEvent } from "@/lib/meta";
import {
  findSaleUrl,
  leadKeyboard,
  payloadFromMessage,
  tg,
  type Markup,
} from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ok = () => NextResponse.json({ ok: true });

type TgMessage = {
  message_id: number;
  chat: { id: number };
  text?: string;
  reply_markup?: Markup;
};

export async function POST(req: NextRequest) {
  // Faqat Telegram'dan kelgan so'rovlar
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret && req.headers.get("x-telegram-bot-api-secret-token") !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const update = await req.json().catch(() => null);
  if (!update?.callback_query) return ok();

  const allowedChat = String(process.env.TELEGRAM_CHAT_ID || "");
  const cq = update.callback_query as {
    id: string;
    data?: string;
    from: { first_name?: string };
    message?: TgMessage;
  };
  const msg = cq.message;
  const answer = (text?: string) =>
    tg("answerCallbackQuery", { callback_query_id: cq.id, ...(text ? { text } : {}) });

  if (!msg || String(msg.chat.id) !== allowedChat) {
    await answer("Ruxsat yo'q");
    return ok();
  }

  const [action, id] = (cq.data || "").split(":");
  const saleUrl = findSaleUrl(msg.reply_markup);
  const by = cq.from.first_name || "operator";
  const setKeyboard = (reply_markup: Markup) =>
    tg("editMessageReplyMarkup", { chat_id: msg.chat.id, message_id: msg.message_id, reply_markup });

  // ===== ✅ Sifatli → Meta =====
  if (action === "good") {
    const payloadStr = payloadFromMessage(msg);
    const p = payloadStr ? decodePayload(payloadStr) : null;
    if (!p) {
      await answer("Lid ma'lumoti topilmadi");
      return ok();
    }
    // event_id doimiy → qayta bosilsa ham Meta dublikatni o'chiradi
    const capi = await sendCapiEvent({ eventName: QUALIFIED_EVENT, eventId: `q_${p.id}`, p });
    if (!capi.ok) {
      await answer(`⚠️ Metaga yuborilmadi: ${capi.info}`.slice(0, 190));
      return ok();
    }
    await answer("Sifatli — Metaga yuborildi");
    await setKeyboard(leadKeyboard(id, saleUrl, "good", by));
    return ok();
  }

  // ===== ❌ Sifatsiz (Metaga hech narsa ketmaydi) =====
  if (action === "bad") {
    await answer("Sifatsiz deb belgilandi");
    await setKeyboard(leadKeyboard(id, saleUrl, "bad", by));
    return ok();
  }

  if (action === "reopen") {
    await answer("Qayta ochildi");
    await setKeyboard(leadKeyboard(id, saleUrl));
    return ok();
  }

  if (action === "done") {
    await answer("Bu lid Metaga sifatli sifatida yuborilgan");
    return ok();
  }

  if (action === "sold") {
    await answer("Purchase allaqachon Metaga yuborilgan");
    return ok();
  }

  // Eski kartalardagi "Sotib oldi" (summa endi brauzerda kiritiladi)
  if (action === "buy") {
    await answer("Bu eski karta. Summani yangi kartadagi «💰 Sotib oldi» tugmasi orqali kiriting.");
    return ok();
  }

  await answer();
  return ok();
}
