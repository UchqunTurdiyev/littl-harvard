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

/** Lid kartasi tugmalari */
export const leadKeyboard = (id: string) => ({
  inline_keyboard: [
    [
      { text: "✅ Sotib oldi", callback_data: `buy:${id}` },
      { text: "❌ Rad etdi", callback_data: `no:${id}` },
    ],
  ],
});

export const PAYLOAD_RE = /LH1:([A-Za-z0-9_-]+)/;
export const MSG_RE = /MSG:(\d+)/;

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
