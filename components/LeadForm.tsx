"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SCHOOL } from "@/lib/config";

/** +998 (90) 123-45-67 ko'rinishidagi niqob */
function maskPhone(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("998")) d = d.slice(3);
  d = d.slice(0, 9);
  let out = "+998";
  if (d.length) out += " (" + d.slice(0, 2);
  if (d.length >= 2) out += ")";
  if (d.length > 2) out += " " + d.slice(2, 5);
  if (d.length > 5) out += "-" + d.slice(5, 7);
  if (d.length > 7) out += "-" + d.slice(7, 9);
  return out;
}

const NO_KEY = "lh_not_tashkent";
const NO_EVENT = "lh-not-tashkent";

function newEventId() {
  try {
    return "lh_" + crypto.randomUUID().replace(/-/g, "").slice(0, 20);
  } catch {
    return (
      "lh_" + Math.random().toString(36).slice(2) + Date.now().toString(36)
    );
  }
}

export default function LeadForm({
  id,
  title = "Maktab bilan tanishuvga yoziling",
  subtitle = "Manzil: Toshkent shahar",
  button = "Ariza yuborish",
  dark = false,
}: {
  id?: string;
  title?: string;
  subtitle?: string;
  button?: string;
  dark?: boolean;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+998");
  const [hp, setHp] = useState("");
  // null — hali javob berilmagan; "yes" — forma; "no" — faqat qo'ng'iroq (qaytib bo'lmaydi)
  const [answer, setAnswer] = useState<"yes" | "no" | null>(null);

  // "Yo'q" bir marta bosilsa — sahifadagi barcha formalarda va qayta kirganda ham qulflanadi
  useEffect(() => {
    try {
      if (localStorage.getItem(NO_KEY) === "1") setAnswer("no");
    } catch {}
    const onNo = () => setAnswer("no");
    window.addEventListener(NO_EVENT, onNo);
    return () => window.removeEventListener(NO_EVENT, onNo);
  }, []);

  function chooseNo() {
    setAnswer("no");
    setError("");
    try {
      localStorage.setItem(NO_KEY, "1");
    } catch {}
    window.dispatchEvent(new Event(NO_EVENT));
  }

  function chooseYes() {
    if (answer === "no") return;
    setAnswer("yes");
    setError("");
  }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const digits = phone.replace(/\D/g, "").replace(/^998/, "");
  const valid = name.trim().length >= 2 && digits.length === 9;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!valid) {
      setError(
        name.trim().length < 2
          ? "Ismingizni kiriting"
          : "Telefon raqamni to'liq kiriting",
      );
      return;
    }
    setLoading(true);
    const eventId = newEventId();
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone: "998" + digits,
          address: "Toshkent — Chilonzor qulay (Ha)",
          eventId,
          url: window.location.href,
          hp,
        }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Xatolik");

      // Brauzer Pixel — CAPI bilan bir xil eventID (dublikat bo'lmaydi)
      window.fbq?.(
        "track",
        "Lead",
        { content_name: "Little Harvard — ariza" },
        { eventID: json.id },
      );

      try {
        sessionStorage.setItem("lh_name", name.trim().split(/\s+/)[0]);
      } catch {}
      router.push("/rahmat");
    } catch (err) {
      setError(
        (err as Error).message || "Xatolik yuz berdi, qayta urinib ko'ring",
      );
      setLoading(false);
    }
  }

  return (
    <form
      id={id}
      className={`lead-form ${dark ? "lead-form--dark" : ""}`}
      onSubmit={submit}
      noValidate
    >
      <div className="lead-form__head">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>

      <div className="region-ask">
        <p className="region-ask__q">Toshkentdamisiz, Chilonzor sizga qulaymi?</p>
        <div className="region-switch" role="group" aria-label="Javobni tanlang">
          <button
            type="button"
            aria-pressed={answer === "yes"}
            disabled={answer === "no"}
            className={`region-switch__btn ${answer === "yes" ? "is-active" : ""}`}
            onClick={chooseYes}
          >
            Ha
          </button>
          <button
            type="button"
            aria-pressed={answer === "no"}
            className={`region-switch__btn ${answer === "no" ? "is-active" : ""}`}
            onClick={chooseNo}
          >
            Yo'q
          </button>
        </div>
      </div>

      {answer === null ? null : answer === "no" ? (
        <div className="region-call">
          <p>
            Unda iltimos, bizga to'g'ridan-to'g'ri qo'ng'iroq qiling — barcha
            savollaringizga javob beramiz.
          </p>
          <a href={SCHOOL.phoneHref} className="btn btn--gold btn--block">
            📞 {SCHOOL.phone}
            <span className="btn__shine" />
          </a>
          <a href={SCHOOL.phone2Href} className="btn btn--gold btn--block">
            📞 {SCHOOL.phone2}
          </a>
        </div>
      ) : (
        <>
          <label className="field">
            <span>Ismingiz</span>
            <input
              type="text"
              autoComplete="name"
              placeholder="Masalan: Dilnoza"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label className="field">
            <span>Telefon raqamingiz</span>
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+998 (90) 123-45-67"
              value={phone}
              onChange={(e) => setPhone(maskPhone(e.target.value))}
              onFocus={() => phone === "" && setPhone("+998")}
              required
            />
          </label>

          {/* Honeypot — odamlar ko'rmaydi */}
          <input
            className="hp"
            tabIndex={-1}
            autoComplete="off"
            value={hp}
            onChange={(e) => setHp(e.target.value)}
            aria-hidden="true"
          />

          {error && <div className="form-error">{error}</div>}

          <button
            type="submit"
            className="btn btn--gold btn--block"
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : button}
            {!loading && <span className="btn__shine" />}
          </button>

          <p className="form-note">
            🔒 Ma'lumotlaringiz faqat maktab ma'muriyatida qoladi
          </p>
        </>
      )}
    </form>
  );
}
