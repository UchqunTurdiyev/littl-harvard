import { NextRequest, NextResponse } from "next/server";

// fbclid → _fbc cookie (server tomonda, 90 kun) va UTM'larni saqlash
export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const sp = req.nextUrl.searchParams;
  const maxAge = 60 * 60 * 24 * 90;

  const fbclid = sp.get("fbclid");
  if (fbclid) {
    const existing = req.cookies.get("_fbc")?.value;
    // Faqat yangi fbclid bo'lsa yangilaymiz
    if (!existing || !existing.endsWith(fbclid)) {
      res.cookies.set("_fbc", `fb.1.${Date.now()}.${fbclid}`, {
        maxAge,
        path: "/",
        sameSite: "lax",
      });
    }
  }

  const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  const utm: Record<string, string> = {};
  utmKeys.forEach((k) => {
    const v = sp.get(k);
    if (v) utm[k] = v.slice(0, 100);
  });
  if (Object.keys(utm).length) {
    res.cookies.set("lh_utm", encodeURIComponent(JSON.stringify(utm)), {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
    });
  }
  return res;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
