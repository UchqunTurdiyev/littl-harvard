const api = (method: string) =>
  `${process.env.TELEGRAM_API_BASE || "https://api.telegram.org"}/bot${process.env.TELEGRAM_BOT_TOKEN}/${method}`;

export async function tg<T = unknown>(
  method: string,
  body: Record<string, unknown>
): Promise<{ ok: boolean; result?: T; description?: string }> {
  try {
    const res = await fetch(api(method), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    return await res.json();
  } catch (e) {
    return { ok: false, description: (e as Error).message };
  }
}

export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const fmtSum = (n: number) =>
  n.toLocaleString("ru-RU").replace(/,/g, " ") + " so'm";

type Btn = { text: string; url?: string; callback_data?: string };
export type Markup = { inline_keyboard: Btn[][] };

export const SALE_BTN = "💰 Sotib oldi — summa kiritish";

/**
 * Lid kartasi tugmalari:
 *  1-qator: Sotib oldi → brauzerda /sotuv sahifasi (summa → Meta Purchase)
 *  2-qator: Sifatli (→ Meta) / Sifatsiz
 */
export function leadKeyboard(
  id: string,
  saleUrl: string | null,
  quality: "new" | "good" | "bad" = "new",
  by = ""
): Markup {
  const rows: Btn[][] = [];
  if (saleUrl) rows.push([{ text: SALE_BTN, url: saleUrl }]);
  const who = by ? ` (${by})` : "";
  if (quality === "good")
    rows.push([{ text: `✅ Sifatli — Metaga yuborildi${who}`, callback_data: `done:${id}` }]);
  else if (quality === "bad")
    rows.push([{ text: `❌ Sifatsiz${who} — o'zgartirish`, callback_data: `reopen:${id}` }]);
  else
    rows.push([
      { text: "✅ Sifatli", callback_data: `good:${id}` },
      { text: "❌ Sifatsiz", callback_data: `bad:${id}` },
    ]);
  return { inline_keyboard: rows };
}

/** Sotuv yakunlangandan keyingi tugma */
export const soldKeyboard = (id: string, amount: number): Markup => ({
  inline_keyboard: [[{ text: `✅ SOTIB OLDI — ${fmtSum(amount)}`, callback_data: `sold:${id}` }]],
});

/** Kartadagi "Sotib oldi" havolasi (ichida lid ma'lumoti va imzo bor) */
export const findSaleUrl = (markup?: Markup): string | null =>
  markup?.inline_keyboard.flat().find((b) => b.url?.includes("/sotuv?"))?.url || null;

export const PAYLOAD_RE = /LH1:([A-Za-z0-9_-]+)/;

/** Lid ma'lumoti: yangi kartalarda havolaning `d` parametrida, eskilarida matndagi LH1: kodida */
export function payloadFromMessage(msg: { text?: string; reply_markup?: Markup }): string | null {
  const url = findSaleUrl(msg.reply_markup);
  if (url) {
    try {
      const d = new URL(url).searchParams.get("d");
      if (d) return d;
    } catch {}
  }
  return msg.text?.match(PAYLOAD_RE)?.[1] || null;
}

/** "5 000 000", "5mln", "4.5 mln", "800k", "800 ming" → so'm */
export function parseAmount(text: string): number | null {
  let t = text.toLowerCase().replace(/,/g, ".").replace(/\s+/g, "");
  // 5.000.000 → 5000000
  t = t.replace(/^(\d{1,3}(?:\.\d{3})+)(?!\d)/, (s) => s.replace(/\./g, ""));
  const m = t.match(/^(\d+(?:\.\d+)?)(mln|million|m|ming|k)?/);
  if (!m) return null;
  let n = parseFloat(m[1]);
  const unit = m[2];
  if (unit === "mln" || unit === "million" || unit === "m") n *= 1_000_000;
  if (unit === "ming" || unit === "k") n *= 1_000;
  n = Math.round(n);
  return n > 0 ? n : null;
}
