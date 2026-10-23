import { NextRequest, NextResponse } from "next/server";
import { decodePayload, sendCapiEvent } from "@/lib/meta";
import {
  esc,
  fmtSum,
  leadKeyboard,
  MSG_RE,
  parseAmount,
  PAYLOAD_RE,
  tg,
} from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ok = () => NextResponse.json({ ok: true });

type TgMessage = {
  message_id: number;
  chat: { id: number };
  from?: { id: number; first_name?: string; username?: string };
  text?: string;
  reply_to_message?: TgMessage;
};

export async function POST(req: NextRequest) {
  // Faqat Telegram'dan kelgan so'rovlar
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret && req.headers.get("x-telegram-bot-api-secret-token") !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const update = await req.json().catch(() => null);
  if (!update) return ok();

  const allowedChat = String(process.env.TELEGRAM_CHAT_ID || "");

  // ===== Tugmalar =====
  if (update.callback_query) {
    const cq = update.callback_query as {
      id: string;
      data?: string;
      from: { first_name?: string };
      message?: TgMessage;
    };
    const msg = cq.message;
    const data = cq.data || "";
    if (!msg || String(msg.chat.id) !== allowedChat) {
      await tg("answerCallbackQuery", { callback_query_id: cq.id, text: "Ruxsat yo'q" });
      return ok();
    }
    const [action, id] = data.split(":");
    const payloadStr = msg.text?.match(PAYLOAD_RE)?.[1];
    const p = payloadStr ? decodePayload(payloadStr) : null;

    if (action === "buy" && p) {
      await tg("answerCallbackQuery", { callback_query_id: cq.id });
      await tg("sendMessage", {
        chat_id: msg.chat.id,
        reply_to_message_id: msg.message_id,
        parse_mode: "HTML",
        text:
          `💰 <b>${esc(p.n)}</b> — to'lov summasini yozing.\n` +
          `Shu xabarga <b>javob (reply)</b> qiling. Masalan: <code>4 500 000</code> yoki <code>4.5mln</code>\n\n` +
          `<code>MSG:${msg.message_id}</code>\n<code>LH1:${payloadStr}</code>`,
        reply_markup: {
          force_reply: true,
          selective: true,
          input_field_placeholder: "Summa, so'mda",
        },
      });
      return ok();
    }

    if (action === "no") {
      await tg("answerCallbackQuery", { callback_query_id: cq.id, text: "Rad etildi deb belgilandi" });
      await tg("editMessageReplyMarkup", {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
        reply_markup: {
          inline_keyboard: [
            [{ text: `❌ Rad etdi (${cq.from.first_name || "operator"}) — qayta ochish`, callback_data: `reopen:${id}` }],
          ],
        },
      });
      return ok();
    }

    if (action === "reopen") {
      await tg("answerCallbackQuery", { callback_query_id: cq.id, text: "Qayta ochildi" });
      await tg("editMessageReplyMarkup", {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
        reply_markup: leadKeyboard(id),
      });
      return ok();
    }

    if (action === "done") {
      await tg("answerCallbackQuery", {
        callback_query_id: cq.id,
        text: "Purchase allaqachon Metaga yuborilgan",
      });
      return ok();
    }

    await tg("answerCallbackQuery", { callback_query_id: cq.id });
    return ok();
  }

  // ===== Summa yozilgan javob (reply) =====
  const m = update.message as TgMessage | undefined;
  if (m?.text && m.reply_to_message?.text && String(m.chat.id) === allowedChat) {
    const prompt = m.reply_to_message.text;
    const payloadStr = prompt.match(PAYLOAD_RE)?.[1];
    const origId = prompt.match(MSG_RE)?.[1];
    if (!payloadStr || !origId) return ok();

    const p = decodePayload(payloadStr);
    if (!p) return ok();

    const amount = parseAmount(m.text);
    if (!amount) {
      await tg("sendMessage", {
        chat_id: m.chat.id,
        reply_to_message_id: m.message_id,
        text: "⚠️ Summani tushunmadim. Yuqoridagi xabarga qayta javob yozing, masalan: 4 500 000",
      });
      return ok();
    }

    const capi = await sendCapiEvent({
      eventName: "Purchase",
      eventId: `pur_${p.id}`,
      p,
      value: amount,
    });

    if (capi.ok) {
      await tg("editMessageReplyMarkup", {
        chat_id: m.chat.id,
        message_id: Number(origId),
        reply_markup: {
          inline_keyboard: [
            [{ text: `✅ SOTIB OLDI — ${fmtSum(amount)}`, callback_data: `done:${p.id}` }],
          ],
        },
      });
      // So'rov xabarini tozalaymiz
      await tg("deleteMessage", { chat_id: m.chat.id, message_id: m.reply_to_message.message_id });
    }

    await tg("sendMessage", {
      chat_id: m.chat.id,
      reply_to_message_id: Number(origId),
      parse_mode: "HTML",
      text: capi.ok
        ? `✅ <b>Purchase Metaga yuborildi</b>\n👤 ${esc(p.n)}\n💵 ${fmtSum(amount)}\n📡 ${capi.info}\n👨‍💼 ${esc(m.from?.first_name || "")}`
        : `⚠️ Purchase yuborilmadi: ${esc(capi.info)}\nQayta urinish uchun "✅ Sotib oldi" tugmasini yana bosing.`,
    });
    return ok();
  }

  return ok();
}
