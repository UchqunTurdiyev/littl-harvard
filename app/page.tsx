import Image from "next/image";
import Header from "@/components/Header";
import LeadForm from "@/components/LeadForm";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import ScrollPencil from "@/components/ScrollPencil";
import { SCHOOL } from "@/lib/config";

const years = new Date().getFullYear() - SCHOOL.since;

// Hero fonida suzib yuruvchi maktab buyumlari (joylashuv .star--N klasslaridan)
const doodles = ["✏️", "📚", "ABC", "📐", "🎒", "2+2=4", "🔬", "🧮", "🌍", "⚽", "a²+b²", "🎨", "💡", "π"];

// 2. Muammo — ota-ona "ha, bu men haqimda" deydigan holatlar
const problems = [
  "Bola ertalab maktabga borgisi kelmaydi",
  "Darsni tushunmaydi — faqat yodlaydi va tez unutadi",
  "To'garaklarga olib borishga vaqtingiz yo'q",
  "Ustoz bolangizni tushunmaydi, uning qobiliyatini hech kim ko'rmaydi",
  "Pul to'laysiz, lekin natijani ko'rmaysiz",
];

// 3. Agitatsiya — hal qilinmasa nima bo'ladi
const consequences = [
  { t: "O'qishni yomon ko'radi", d: "Har bir dars bola uchun majburiyatga aylanadi." },
  { t: "Bilimi orqada qoladi", d: "Yuqori sinfda repetitorlarga ko'proq vaqt va pul ketadi." },
  { t: "O'ziga ishonmay qoladi", d: "\"Men uddalay olmayman\" deb o'ylay boshlaydi." },
  { t: "Kasbini topa olmaydi", d: "Diplom bo'ladi, lekin sevgan ishi va kuchli kasbi bo'lmaydi." },
];

// 4. Yechim — oddiy maktab va Little Harvard farqi
const compare = [
  { bad: "Hammaga bir xil dars", good: "Har bir bolaga alohida e'tibor — qobiliyati kuzatib boriladi" },
  { bad: "Yodlab o'qish", good: "Tushunib o'qish — o'ylashni va amalda qo'llashni o'rganadi" },
  { bad: "Zerikarli darslar", good: "Qiziqarli darslar — bola o'qishni o'zi xohlaydi" },
  { bad: "To'garaklar uchun shahar bo'ylab yugurish", good: "Hamma to'garaklar maktabning o'zida" },
  { bad: "Natijani bilmaysiz", good: "Har oy natija sizga ko'rsatiladi" },
];

const clubs = ["🩺 Meditsina", "🔬 STEM", "⚙️ Muhandislik", "🇨🇳 Xitoy tili", "💻 IT", "⚽ Sport"];

// 6. Taklif — farzandingiz nimalarga ega bo'ladi
const features = [
  { icon: "🎯", t: "Alohida e'tibor", d: "Bolaning kuchli tomoni topiladi va o'shani rivojlantiramiz." },
  { icon: "🧠", t: "Tushunib o'qish", d: "Yodlash emas — o'ylash va amalda qo'llash." },
  { icon: "🎨", t: "6 xil to'garak", d: "Meditsina, STEM, muhandislik, Xitoy tili, IT va sport — maktabning o'zida." },
  { icon: "📊", t: "Har oy natija", d: "Bolangiz qanday o'qiyotganini har oy ko'rib borasiz." },
  { icon: "🍽️", t: "4 mahal ovqat", d: "Kun davomida to'yimli va sog'lom ovqat." },
  { icon: "🛡️", t: "To'liq xavfsizlik", d: "Qo'riqlash xizmati, kuzatuv kameralari va Face ID kirish tizimi." },
];

// 5. Ota-onalar sharhlari — faqat haqiqiy sharhlarni qo'shing (ism, kimning ota-onasi, matn).
// Massiv bo'sh bo'lsa, blok ko'rsatilmaydi.
const reviews: { name: string; who: string; text: string }[] = [];

const stages = [
  { y: "Bog'cha", t: "Maktabgacha ta'lim", d: "Mustahkam poydevor: nutq, fikrlash, maktabga tayyorgarlik." },
  { y: "2015", t: "Boshlang'ich sinflar", d: "O'qishga qiziqish va to'g'ri o'quv odatlari shakllanadi." },
  { y: "2018", t: "O'rta sinflar", d: "Chuqur bilim, til va aniq fanlar bo'yicha kuchli baza." },
  { y: "2020", t: "Yuqori sinflar", d: "Sertifikatlar va oliy ta'limga tayyorgarlik." },
];

const faq = [
  {
    q: "Qaysi yoshdagi bolalar qabul qilinadi?",
    a: "Little Harvard — maktab va bog'cha. Maktabgacha yoshdagi bolalar hamda boshlang'ich, o'rta va yuqori sinf o'quvchilari qabul qilinadi. Aniq bo'sh o'rinlarni ariza qoldirganingizdan so'ng mutaxassisimiz aytib beradi.",
  },
  {
    q: "O'qish narxi qancha?",
    a: "Narx sinf va yo'nalishga qarab farq qiladi. Ariza qoldiring — mutaxassisimiz farzandingizga mos variantni va amaldagi chegirmalarni tushuntiradi.",
  },
  {
    q: "Agar bola mavzularni o'zlashtira olmasa-chi?",
    a: "Bizda kafolat bor: 9 oy davomida o'zlashtirish bo'lmasa, qo'shimcha darslar bepul beriladi.",
  },
  {
    q: "To'garaklar uchun bolani boshqa joyga olib borish kerakmi?",
    a: "Yo'q. Meditsina, STEM, muhandislik, Xitoy tili, IT va sport to'garaklari maktabning o'zida o'tkaziladi.",
  },
  {
    q: "Bola yangi maktabga moslasha oladimi?",
    a: "Har bir yangi o'quvchini mutaxassislarimiz individual kuzatib boradi. Ota-onalar odatda ilk oydayoq bolaning o'ziga ishonchi va maktabga borish ishtiyoqi ortganini sezadi.",
  },
  {
    q: "Ovqatlanish qanday tashkil etilgan?",
    a: "Kuniga 4 mahal muvozanatlashtirilgan ovqat beriladi.",
  },
  {
    q: "Bolaning xavfsizligi qanday ta'minlanadi?",
    a: "Maktabda qo'riqlash xizmati, kuzatuv kameralari va Face ID kirish tizimi ishlaydi.",
  },
  {
    q: "Natijani qanday bilib boraman?",
    a: "Har oy monitoring o'tkaziladi. Yuqori natija ko'rsatgan o'quvchilar grant asosida chegirma yoki bepul oy oladi.",
  },
];

export default function Home() {
  return (
    <>
      <ScrollPencil />
      <Header />
      <main id="top">
        {/* ============ HERO ============ */}
        <section className="hero">
          <div className="hero__bg" aria-hidden>
            <span className="orb orb--1" />
            <span className="orb orb--2" />
            {doodles.map((d, i) => (
              <span
                key={i}
                className={`doodle star--${i} ${/^[\w²+=π]/.test(d) ? "doodle--text" : ""}`}
                style={{ animationDelay: `${-i * 0.7}s` }}
              >
                {d}
              </span>
            ))}
            <span className="bus">🚌</span>
          </div>

          <div className="container hero__grid">
            <div className="hero__text">
              <Reveal>
                <span className="eyebrow">
                  <i /> {SCHOOL.since}-yildan beri · Toshkent, Chilonzor
                </span>
              </Reveal>
              <Reveal delay={60}>
                <p className="hero__hook">
                  Farzandingiz maktabga zavq bilan borishini va qo&apos;shimcha to&apos;garaklarga
                  ehtiyoj qolmasligini xohlaysizmi?
                </p>
              </Reveal>
              <Reveal delay={80}>
                <h1>
                  Farzandingiz <span className="gold-text">iqtidorini to&apos;liq ochadigan</span>{" "}
                  mukammal ta&apos;lim dargohi
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="lead">
                  Yodlash emas — o&apos;ylashni o&apos;rgatamiz. Alohida e&apos;tibor, IT, STEM,
                  tibbiyot, Xitoy tili va sport — farzandingizga kerak bo&apos;lgan hamma narsa{" "}
                  <b>bitta maktabda</b>.
                </p>
              </Reveal>
              <Reveal delay={240}>
                <ul className="chips">
                  <li>🛡️ Face ID xavfsizlik</li>
                  <li>🍽️ 4 mahal ovqat</li>
                  <li>📊 Oylik monitoring</li>
                  <li>🎓 9 oylik kafolat</li>
                </ul>
              </Reveal>
              <Reveal delay={320}>
                <div className="hero__actions">
                  <a href="#ariza" className="btn btn--gold">
                    Bepul konsultatsiyaga yozilish <span className="btn__shine" />
                  </a>
                  <a href={SCHOOL.phoneHref} className="btn btn--ghost">
                    📞 Qo&apos;ng&apos;iroq qilish
                  </a>
                </div>
              </Reveal>
            </div>

            <Reveal delay={200} className="hero__form">
              <div className="logo-float" aria-hidden>
                <Image src="/logo.png" alt="" width={120} height={120} priority />
              </div>
              <LeadForm id="hero-form" />
            </Reveal>
          </div>
        </section>

        {/* ============ 2. MUAMMO ============ */}
        <section className="section">
          <div className="container narrow">
            <Reveal className="sec-head">
              <span className="kicker">Tanish holatmi?</span>
              <h2>Bu holatlar sizga ham tanishmi?</h2>
              <p>Siz bilasizmi? Ko&apos;pchilik ota-onalar har kuni shunga duch keladi.</p>
            </Reveal>
            <ul className="problems">
              {problems.map((p, i) => (
                <Reveal as="li" key={p} delay={i * 80} className="problem">
                  <span aria-hidden>✕</span>
                  {p}
                </Reveal>
              ))}
            </ul>
            <Reveal className="problems__note">
              Bittasida bo&apos;lsa ham o&apos;zingizni ko&apos;rdingizmi? Unda o&apos;qishda davom eting.
            </Reveal>
            <Reveal className="bridge">Lekin bitta muammo bor…</Reveal>
          </div>
        </section>

        {/* ============ 3. AGITATSIYA ============ */}
        <section className="section section--dark">
          <div className="container">
            <Reveal className="sec-head sec-head--light">
              <span className="kicker">Agar hozir hal qilinmasa</span>
              <h2>Bu muammolar o&apos;z-o&apos;zidan yo&apos;qolmaydi — yildan-yilga kattalashadi</h2>
            </Reveal>
            <ol className="chain">
              {consequences.map((c, i) => (
                <Reveal as="li" key={c.t} delay={i * 100} className="chain__item">
                  <span className="chain__n">{i + 1}</span>
                  <h3>{c.t}</h3>
                  <p>{c.d}</p>
                </Reveal>
              ))}
            </ol>
            <Reveal className="chain__quote">
              Ammo esda tuting: <b>bolalik qaytib kelmaydi.</b>
            </Reveal>
            <Reveal className="bridge bridge--light">Yaxshi xabar shuki — buni o&apos;zgartirish mumkin…</Reveal>
          </div>
        </section>

        {/* ============ 4. YECHIM ============ */}
        <section className="section section--cream" id="afzallik">
          <div className="container">
            <Reveal className="sec-head">
              <span className="kicker">Little Harvard uslubi</span>
              <h2>Biz boshqacha o&apos;qitamiz</h2>
              <p>Gap shundaki, farqni tushunish juda oson — o&apos;zingiz solishtiring:</p>
            </Reveal>
            <div className="compare">
              <div className="compare__head" aria-hidden>
                <span>Oddiy maktabda</span>
                <span>Little Harvard&apos;da</span>
              </div>
              {compare.map((c, i) => (
                <Reveal key={c.bad} delay={i * 70} className="compare__row">
                  <div className="compare__bad">
                    <span>✕</span>
                    {c.bad}
                  </div>
                  <div className="compare__good">
                    <span>✓</span>
                    {c.good}
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal className="clubs">
              <p>Bu hali hammasi emas… To&apos;garaklarga boshqa joyga olib borish shart emas:</p>
              <ul className="chips chips--light">
                {clubs.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <section className="section" id="bosqich">
          <div className="container">
            <Reveal className="sec-head">
              <span className="kicker">Tasavvur qiling…</span>
              <h2>Farzandingiz bog&apos;chadan to kasb egasi bo&apos;lguncha — bitta yo&apos;lda</h2>
            </Reveal>
            <ol className="timeline">
              {stages.map((s, i) => (
                <Reveal as="li" key={s.t} delay={i * 110} className="timeline__item">
                  <span className="timeline__dot" />
                  <em>{s.y}</em>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </Reveal>
              ))}
              <Reveal as="li" delay={480} className="timeline__item timeline__item--goal">
                <span className="timeline__dot" />
                <em>Maqsad</em>
                <h3>Oliy ta&apos;limga o&apos;z bilimi bilan</h3>
                <p>Va hayotda o&apos;z sohasining kuchli mutaxassisi bo&apos;lish.</p>
              </Reveal>
            </ol>
          </div>
        </section>

        {/* ============ 5. IJTIMOIY DALIL ============ */}
        <section className="stats">
          <div className="container stats__grid">
            <Reveal className="stat">
              <b><Counter to={years} suffix="+" /></b>
              <span>yillik tajriba</span>
            </Reveal>
            <Reveal className="stat" delay={80}>
              <b><Counter to={7.5} decimals={1} /></b>
              <span>IELTS — 10-sinf o&apos;quvchisi</span>
            </Reveal>
            <Reveal className="stat" delay={160}>
              <b><Counter to={6} /></b>
              <span>yo&apos;nalishda to&apos;garaklar</span>
            </Reveal>
            <Reveal className="stat" delay={240}>
              <b><Counter to={9} /></b>
              <span>oylik o&apos;zlashtirish kafolati</span>
            </Reveal>
          </div>
        </section>

        <section className="section section--dark" id="natija">
          <div className="container">
            <Reveal className="sec-head sec-head--light">
              <span className="kicker">So&apos;z emas — natija</span>
              <h2>O&apos;quvchilarimiz natijalari gapiradi</h2>
              <p>Bu natijalar — to&apos;g&apos;ri muhit va to&apos;g&apos;ri yondashuv samarasi.</p>
            </Reveal>
            <div className="results">
              <Reveal className="result">
                <div className="result__big gold-text">IELTS 7.5</div>
                <p>Ingliz tilidan — hali 10-sinfda o&apos;qiyotgan o&apos;quvchimiz natijasi</p>
              </Reveal>
              <Reveal className="result" delay={100}>
                <div className="result__big gold-text">🏆 Xalqaro</div>
                <p>Matematikadan xalqaro musobaqalarda o&apos;rinlar</p>
              </Reveal>
              <Reveal className="result" delay={200}>
                <div className="result__big gold-text">O&apos;ziga ishonch</div>
                <p>Ota-onalar eng ko&apos;p ko&apos;radigan o&apos;zgarish: ishonch, akademik o&apos;sish, o&apos;qishga qiziqish</p>
              </Reveal>
            </div>
            {reviews.length > 0 && (
              <div className="reviews">
                {reviews.map((r, i) => (
                  <Reveal as="figure" key={r.name} delay={i * 100} className="review">
                    <blockquote>&ldquo;{r.text}&rdquo;</blockquote>
                    <figcaption>
                      <b>{r.name}</b>
                      <span>{r.who}</span>
                    </figcaption>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ============ 6. TAKLIF (OFFER) ============ */}
        <section className="section section--cream" id="kafolat">
          <div className="container">
            <Reveal className="sec-head">
              <span className="kicker">Eng qizig&apos;i esa…</span>
              <h2>Bularning hammasi — bitta maktabda</h2>
              <p>Farzandingiz nimalarga ega bo&apos;ladi:</p>
            </Reveal>
            <div className="features">
              {features.map((f, i) => (
                <Reveal key={f.t} delay={i * 70} className="feature">
                  <div className="feature__icon">{f.icon}</div>
                  <h3>{f.t}</h3>
                  <p>{f.d}</p>
                </Reveal>
              ))}
            </div>
          </div>
          <div className="container guarantee offer__guarantee">
            <Reveal className="guarantee__card">
              <div className="seal" aria-hidden>
                <span>9</span>
                <small>OY</small>
              </div>
              <h2>Natija kafolati</h2>
              <p>
                Siz hech narsa yo&apos;qotmaysiz. Agar 9 oy ichida bolangiz mavzularni
                o&apos;zlashtirmasa — <b>qo&apos;shimcha darslar bepul</b>.
              </p>
              <p className="first-month__title">Ilk 1 oydayoq farzandingizda:</p>
              <ul className="first-month">
                <li>O&apos;ziga bo&apos;lgan ishonch sezilarli darajada ortadi</li>
                <li>Akademik o&apos;zlashtirish va fanlarga qiziqish kuchayadi</li>
                <li>Bilim olish va maktabga borish ishtiyoqi shakllanadi</li>
              </ul>
            </Reveal>

            <Reveal className="bonus" delay={120}>
              <span className="kicker">Har oylik monitoring bonusi</span>
              <h3>Yaxshi o&apos;qisa — rag&apos;batlantiramiz</h3>
              <ul className="tiers">
                <li>
                  <div className="tiers__row">
                    <b>99–100%</b>
                    <span className="tag tag--gold">Keyingi oy BEPUL</span>
                  </div>
                  <div className="bar"><i style={{ ["--w" as string]: "100%" }} /></div>
                </li>
                <li>
                  <div className="tiers__row">
                    <b>96–98%</b>
                    <span className="tag">10% chegirma grant</span>
                  </div>
                  <div className="bar"><i style={{ ["--w" as string]: "97%" }} /></div>
                </li>
                <li>
                  <div className="tiers__row">
                    <b>95% gacha</b>
                    <span className="tag">5% chegirma grant</span>
                  </div>
                  <div className="bar"><i style={{ ["--w" as string]: "92%" }} /></div>
                </li>
              </ul>
            </Reveal>
          </div>
        </section>

        {/* ============ 7. CTA ============ */}
        <section className="section">
          <div className="container">
            <Reveal className="sec-head">
              <span className="kicker">Endi navbat sizda</span>
              <h2>Boshlash juda oson — atigi 3 qadam</h2>
            </Reveal>
            <div className="steps">
              {[
                ["01", "Formani to'ldiring", "Ismingiz va telefoningizni yozing — 30 soniya."],
                ["02", "Biz qo'ng'iroq qilamiz", "Mutaxassis hammasini tushuntiradi — bepul."],
                ["03", "Maktabni ko'ring", "Kelib, o'z ko'zingiz bilan ko'rasiz va qaror qilasiz."],
              ].map(([n, t, d], i) => (
                <Reveal key={n} delay={i * 110} className="step">
                  <span className="step__n">{n}</span>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="final" id="ariza">
          <div className="hero__bg" aria-hidden>
            <span className="orb orb--1" />
            {doodles.slice(0, 8).map((d, i) => (
              <span
                key={i}
                className={`doodle star--${i} ${/^[\w²+=π]/.test(d) ? "doodle--text" : ""}`}
                style={{ animationDelay: `${-i * 0.7}s` }}
              >
                {d}
              </span>
            ))}
          </div>
          <div className="container final__grid">
            <Reveal className="final__text">
              <span className="kicker kicker--light">Qabul davom etmoqda · o&apos;rinlar cheklangan</span>
              <h2>
                Farzandingiz kelajagiga <span className="gold-text">bugun sarmoya</span> kiriting
              </h2>
              <p>
                Formani to&apos;ldiring — bu atigi 30 soniya. Mutaxassisimiz o&apos;zi qo&apos;ng&apos;iroq
                qiladi va hammasini tushuntiradi. Hech qanday majburiyat yo&apos;q.
              </p>
              <ul className="contacts">
                <li>📍 {SCHOOL.address}</li>
                <li>
                  📞 <a href={SCHOOL.phoneHref}>{SCHOOL.phone}</a>
                </li>
                <li>
                  📸{" "}
                  <a href={SCHOOL.instagram} target="_blank" rel="noopener noreferrer">
                    @littleharvard.uz
                  </a>
                </li>
                <li>
                  🗺️{" "}
                  <a href={SCHOOL.mapUrl} target="_blank" rel="noopener noreferrer">
                    Xaritada ochish
                  </a>
                </li>
              </ul>
            </Reveal>
            <Reveal delay={120}>
              <LeadForm
                title="Bepul konsultatsiyaga yoziling"
                subtitle="30 soniyada ariza — tez orada qo'ng'iroq qilamiz"
                button="Bepul konsultatsiyaga yozilish"
              />
            </Reveal>
          </div>
        </section>

        {/* ============ 8. FAQ ============ */}
        <section className="section section--cream" id="savol">
          <div className="container narrow">
            <Reveal className="sec-head">
              <span className="kicker">Savol-javob</span>
              <h2>Ko&apos;p beriladigan savollar</h2>
            </Reveal>
            <div className="faq">
              {faq.map((f, i) => (
                <Reveal key={f.q} delay={i * 50}>
                  <details>
                    <summary>{f.q}</summary>
                    <p>{f.a}</p>
                  </details>
                </Reveal>
              ))}
            </div>
            <Reveal className="faq__cta">
              <p>Savolingiz qoldimi? Eng yaxshisi — mutaxassisimizning o&apos;zidan so&apos;rang. Bu bepul.</p>
              <div className="hero__actions">
                <a href="#ariza" className="btn btn--gold">
                  Bepul konsultatsiya <span className="btn__shine" />
                </a>
                <a href={SCHOOL.phoneHref} className="btn btn--ghost-dark">
                  📞 {SCHOOL.phone}
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer__in">
          <div className="brand brand--light">
            <Image src="/logo.png" alt="Little Harvard" width={40} height={40} />
            <span>
              <b>Little Harvard</b>
              <small>Private School &amp; Kindergarten</small>
            </span>
          </div>
          <p>© {new Date().getFullYear()} Little Harvard. Barcha huquqlar himoyalangan.</p>
        </div>
      </footer>

      {/* Mobil uchun doimiy CTA */}
      <div className="mobile-cta">
        <a href={SCHOOL.phoneHref} className="btn btn--ghost-dark" aria-label="Qo'ng'iroq">📞</a>
        <a href="#ariza" className="btn btn--gold btn--block">
          Ariza qoldirish <span className="btn__shine" />
        </a>
      </div>
    </>
  );
}
