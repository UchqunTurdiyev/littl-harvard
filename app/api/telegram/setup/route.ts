import { NextRequest, NextResponse } from "next/server";
import { tg } from "@/lib/telegram";
import { SITE_URL } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Bir marta ochiladi: https://SAYT/api/telegram/setup?key=TELEGRAM_WEBHOOK_SECRET
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!key || key !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return NextResponse.json({ ok: false, error: "key noto'g'ri" }, { status: 401 });
  }
  const res = await tg("setWebhook", {
    url: `${SITE_URL}/api/telegram`,
    secret_token: process.env.TELEGRAM_WEBHOOK_SECRET,
    allowed_updates: ["callback_query"],
    drop_pending_updates: true,
  });
  const info = await tg("getWebhookInfo", {});
  return NextResponse.json({ setWebhook: res, info });
}
