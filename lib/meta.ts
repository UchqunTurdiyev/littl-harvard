import crypto from "crypto";

const GRAPH_VERSION = "v21.0";

export const sha256 = (v: string) =>
  crypto.createHash("sha256").update(v).digest("hex");

/** Meta talabiga ko'ra normalizatsiya: kichik harf, bo'sh joysiz */
export const norm = (v: string) => v.trim().toLowerCase();

/** O'zbekiston raqamini 998XXXXXXXXX ko'rinishiga keltiradi */
export function normalizePhone(raw: string): string | null {
  let d = raw.replace(/\D/g, "");
  if (d.length === 9) d = "998" + d;
  if (d.length === 12 && d.startsWith("998")) return d;
  return null;
}

/** Ismni fn / ln ga ajratadi (Meta uchun) */
export function splitName(full: string) {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  const fn = parts[0] || "";
  const ln = parts.slice(1).join(" ");
  // Meta fn/ln uchun faqat harflar (kirill/lotin), tinish belgilarisiz
  const clean = (s: string) =>
    norm(s).replace(/[^\p{L}]/gu, "");
  return { fn: clean(fn), ln: clean(ln) };
}

/** Telegram xabari ichida saqlanadigan va keyin Purchase uchun qayta o'qiladigan ma'lumot */
export type LeadPayload = {
  id: string; // lead ID = Lead event_id
  n: string; // ism (operator uchun)
  ph: string; // sha256(phone)
  fn?: string; // sha256(first name)
  ln?: string; // sha256(last name)
  xid: string; // sha256(external_id)
  fbp?: string;
  fbc?: string;
  ip?: string;
  ua?: string;
  url?: string;
  t: number; // lead vaqti (unix)
};

export function encodePayload(p: LeadPayload) {
  return Buffer.from(JSON.stringify(p), "utf8").toString("base64url");
}

export function decodePayload(s: string): LeadPayload | null {
  try {
    return JSON.parse(Buffer.from(s, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

/** "Sifatli" lid uchun Metaga ketadigan event nomi */
export const QUALIFIED_EVENT = process.env.META_QUALIFIED_EVENT || "QualifiedLead";

// ===== Sotuv sahifasi havolasi (/sotuv?d=...&m=...&s=...) =====
// Havola faqat Telegram guruhda ko'rinadi; imzo uni soxtalashtirib bo'lmasligini ta'minlaydi.
const linkSecret = () =>
  process.env.LEAD_LINK_SECRET ||
  process.env.TELEGRAM_WEBHOOK_SECRET ||
  process.env.TELEGRAM_BOT_TOKEN ||
  "";

export const signLink = (d: string, m: string) =>
  crypto.createHmac("sha256", linkSecret()).update(`${d}.${m}`).digest("base64url").slice(0, 32);

export function verifyLink(d: string, m: string, s: string): boolean {
  if (!linkSecret() || !d || !/^\d+$/.test(m) || !s) return false;
  const a = Buffer.from(signLink(d, m));
  const b = Buffer.from(s);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

type SendArgs = {
  eventName: string; // "Lead" | "Purchase" | QUALIFIED_EVENT
  eventId: string;
  p: LeadPayload;
  value?: number;
  currency?: string;
};

export async function sendCapiEvent({
  eventName,
  eventId,
  p,
  value,
  currency,
}: SendArgs): Promise<{ ok: boolean; info: string }> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_ACCESS_TOKEN;
  if (!pixelId || !token) return { ok: false, info: "META sozlanmagan" };

  const user_data: Record<string, unknown> = {
    ph: [p.ph],
    external_id: [p.xid],
    country: [sha256("uz")],
  };
  if (p.fn) user_data.fn = [p.fn];
  if (p.ln) user_data.ln = [p.ln];
  if (p.fbp) user_data.fbp = p.fbp;
  if (p.fbc) user_data.fbc = p.fbc;
  if (p.ip) user_data.client_ip_address = p.ip;
  if (p.ua) user_data.client_user_agent = p.ua;

  const event: Record<string, unknown> = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    action_source: "website",
    event_source_url: p.url,
    user_data,
  };

  if (eventName === "Purchase") {
    event.custom_data = {
      value,
      currency: currency || process.env.META_PURCHASE_CURRENCY || "UZS",
      content_name: "Little Harvard — o'qishga qabul",
      content_type: "product",
      order_id: p.id,
    };
  } else if (eventName === QUALIFIED_EVENT) {
    event.custom_data = { content_name: "Little Harvard — sifatli lid", lead_quality: "qualified" };
  } else {
    event.custom_data = { content_name: "Little Harvard — ariza" };
  }

  const body: Record<string, unknown> = { data: [event] };
  if (process.env.META_TEST_EVENT_CODE)
    body.test_event_code = process.env.META_TEST_EVENT_CODE;

  try {
    const res = await fetch(
      `${process.env.META_GRAPH_BASE || "https://graph.facebook.com"}/${GRAPH_VERSION}/${pixelId}/events?access_token=${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
      }
    );
    const json = await res.json();
    if (!res.ok) return { ok: false, info: json?.error?.message || "xato" };
    return { ok: true, info: `events_received: ${json.events_received}` };
  } catch (e) {
    return { ok: false, info: (e as Error).message };
  }
}
