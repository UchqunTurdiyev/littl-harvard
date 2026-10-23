"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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

function newEventId() {
  try {
    return "lh_" + crypto.randomUUID().replace(/-/g, "").slice(0, 20);
  } catch {
    return "lh_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
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
  const [address, setAddress] = useState("");
  const [hp, setHp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const digits = phone.replace(/\D/g, "").replace(/^998/, "");
  const valid = name.trim().length >= 2 && digits.length === 9 && address.trim().length >= 3;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!valid) {
      setError(
        name.trim().length < 2
          ? "Ismingizni kiriting"
          : digits.length !== 9
          ? "Telefon raqamni to'liq kiriting"
          : "Manzilingizni kiriting"
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
          address,
          eventId,
          url: window.location.href,
          hp,
        }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Xatolik");

      // Brauzer Pixel — CAPI bilan bir xil eventID (dublikat bo'lmaydi)
      window.fbq?.("track", "Lead", { content_name: "Little Harvard — ariza" }, { eventID: json.id });

      try {
        sessionStorage.setItem("lh_name", name.trim().split(/\s+/)[0]);
      } catch {}
      router.push("/rahmat");
    } catch (err) {
      setError((err as Error).message || "Xatolik yuz berdi, qayta urinib ko'ring");
      setLoading(false);
    }
  }

  return (
    <form id={id} className={`lead-form ${dark ? "lead-form--dark" : ""}`} onSubmit={submit} noValidate>
      <div className="lead-form__head">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>

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

      <label className="field">
        <span>Manzilingiz</span>
        <input
          type="text"
          autoComplete="street-address"
          placeholder="Tuman, mavze yoki ko'cha"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
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

      <button type="submit" className="btn btn--gold btn--block" disabled={loading}>
        {loading ? <span className="spinner" /> : button}
        {!loading && <span className="btn__shine" />}
      </button>

      <p className="form-note">🔒 Ma'lumotlaringiz faqat maktab ma'muriyatida qoladi</p>
    </form>
  );
}
