import type { Metadata, Viewport } from "next";
import MetaPixel from "@/components/MetaPixel";
import { SITE_URL } from "@/lib/config";
// Shriftlar loyiha ichida (Google Fonts'ga bog'liq emas — har qanday serverda build bo'ladi)
import "@fontsource/nunito/latin-800.css";
import "@fontsource/nunito/latin-900.css";
import "@fontsource/nunito/latin-ext-800.css";
import "@fontsource/nunito/latin-ext-900.css";
import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-600.css";
import "@fontsource/manrope/latin-700.css";
import "@fontsource/manrope/latin-800.css";
import "@fontsource/manrope/latin-ext-400.css";
import "@fontsource/manrope/latin-ext-600.css";
import "@fontsource/manrope/latin-ext-700.css";
import "@fontsource/manrope/latin-ext-800.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Little Harvard — xususiy maktab va bog'cha | Toshkent, Chilonzor",
  description:
    "2015-yildan beri: individual yondashuv, qiziqarli darslar, oylik monitoring, 4 mahal muvozanatli ovqat va Face ID xavfsizlik. Bog'chadan 11-sinfgacha. Ariza qoldiring!",
  openGraph: {
    title: "Little Harvard — farzandingiz iqtidori ochiladigan maktab",
    description:
      "Bog'cha va 1–11-sinflar. Individual yondashuv, oylik monitoring, 9 oylik o'zlashtirish kafolati.",
    images: ["/logo.png"],
    locale: "uz_UZ",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#182425",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body>
        {children}
        <MetaPixel />
      </body>
    </html>
  );
}
