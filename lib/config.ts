// Maktab ma'lumotlari — bitta joydan boshqariladi.
// Manzil va telefon ochiq katalogdan (yellowpages.uz) olindi — ishga tushirishdan oldin tasdiqlang.
export const SCHOOL = {
  name: "Little Harvard",
  fullName: "Little Harvard — xususiy maktab va bog'cha",
  since: 2015,
  phone: "+998 90 935 47 00",
  phoneHref: "tel:+998909354700",
  address: "Toshkent sh., Chilonzor tumani, Chilonzor-1 mavzesi, 30-uy",
  mapUrl:
    "https://yandex.uz/maps/?text=Little%20Harvard%20Chilonzor-1%2030%20Toshkent",
  instagram: "https://www.instagram.com/littleharvard.uz",
  email: "littleharvarduz@gmail.com",
};

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://littleharvard.uz"
).replace(/\/+$/, "");

export const TG_GROUP_URL =
  process.env.NEXT_PUBLIC_TG_GROUP_URL || "https://t.me/littleharvard_uz";

export const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";
