# Little Harvard — landing (Next.js App Router)

Xususiy maktab uchun sotuvga moslangan landing: forma → Telegram bot (xeshlangan ma'lumot + cookie) → Meta CAPI Lead → bot orqali **Purchase + summa** (ROAS) → rahmat sahifasi (10 soniya animatsion sanash) → Telegram guruh.

## Oqim

1. Mijoz forma to'ldiradi: **ism, telefon, manzil**.
2. `/api/lead`:
   - telefon `998XXXXXXXXX` ga normallashtiriladi, `ph / fn / ln / external_id` SHA-256 bilan xeshlanadi;
   - `_fbp`, `_fbc` cookie, IP, User-Agent, UTM yig'iladi;
   - **Meta CAPI → Lead** (brauzer Pixel bilan bir xil `event_id` — dublikat bo'lmaydi);
   - **Telegram guruhga** lid kartasi tushadi: ism, telefon, manzil, UTM, xeshlar, cookie'lar + `✅ Sotib oldi` / `❌ Rad etdi` tugmalari.
3. Brauzer `/rahmat` sahifasiga o'tadi → 10 soniya sanaladi → `NEXT_PUBLIC_TG_GROUP_URL` ga yo'naltiriladi.
4. Operator mijoz to'lov qilganda guruhda **✅ Sotib oldi** bosadi → bot summani so'raydi → operator shu xabarga **reply** qilib summani yozadi (`4 500 000`, `4.5mln`, `800k`) → **Meta CAPI → Purchase (value + UZS)** yuboriladi → tugma `✅ SOTIB OLDI — 4 500 000 so'm` ga aylanadi.
   Purchase lid bilan bir xil `fbc / fbp / ph / external_id` bilan ketadi → Ads Manager'da **Purchase ROAS** ko'rinadi.

> Ma'lumotlar bazasi shart emas: lid ma'lumoti xabar ichidagi `LH1:...` kodida saqlanadi va Purchase paytida o'sha yerdan o'qiladi. Shu satrni o'chirmang.

## O'rnatish

```bash
npm install
cp .env.example .env.local   # qiymatlarni to'ldiring
npm run dev
```

### .env
| O'zgaruvchi | Izoh |
|---|---|
| `NEXT_PUBLIC_META_PIXEL_ID` | Pixel ID |
| `META_ACCESS_TOKEN` | Events Manager → Settings → Conversions API → Generate access token |
| `META_TEST_EVENT_CODE` | Test vaqtida `TEST...` kodi, ishga tushganda bo'sh |
| `META_PURCHASE_CURRENCY` | `UZS` (standart) |
| `TELEGRAM_BOT_TOKEN` | @BotFather |
| `TELEGRAM_CHAT_ID` | Lidlar tushadigan guruh ID (`-100...`). Bot guruhga **admin** qilib qo'shilsin |
| `TELEGRAM_WEBHOOK_SECRET` | Tasodifiy satr (harf, raqam, `_`, `-`) |
| `NEXT_PUBLIC_SITE_URL` | Sayt domeni, `https://` bilan |
| `NEXT_PUBLIC_TG_GROUP_URL` | Rahmat sahifasidan keyin ochiladigan guruh havolasi |

### Telegram webhook (deploydan keyin bir marta)
Brauzerda oching:
```
https://SAYT_DOMENI/api/telegram/setup?key=TELEGRAM_WEBHOOK_SECRET
```
Javobda `"ok": true` va `url` sizning domeningiz bo'lsa — tayyor.

## Deploy
- **Vercel:** repo ulanadi, `.env` qiymatlari Settings → Environment Variables ga kiritiladi.
- **Eskiz / VPS:** `npm run build && npm start` (pm2 bilan: `pm2 start npm --name little-harvard -- start`), Nginx `proxy_pass http://127.0.0.1:3000` va `proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;` (CAPI uchun to'g'ri IP).

## Tekshirish
1. `META_TEST_EVENT_CODE` qo'ying → forma yuboring → Events Manager → Test events'da **Lead (Server + Browser, deduplicated)**.
2. Guruhda `✅ Sotib oldi` → summa → Test events'da **Purchase** value bilan.
3. Ishga tushirishda `META_TEST_EVENT_CODE` ni bo'shating.

## Tahrirlash
- Maktab ma'lumotlari (telefon, manzil, Instagram): `lib/config.ts`
- Matnlar va bo'limlar: `app/page.tsx`
- Ranglar/animatsiyalar: `app/globals.css`
- Logotip: `public/logo.png`, favicon: `app/icon.png`
# littl-harvard
