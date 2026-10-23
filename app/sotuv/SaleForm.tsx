"use client";

import { useState } from "react";

const fmt = (n: number) => n.toLocaleString("ru-RU").replace(/,/g, " ") + " so'm";
const digits = (v: string) => v.replace(/\D/g, "").slice(0, 11);

export default function SaleForm({ d, m, s }: { d: string; m: string; s: string }) {
  const [raw, setRaw] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<number | null>(null);

  const amount = Number(raw || 0);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount) return setError("Summani kiriting");
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ d, m, s, amount: raw }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Xato");
      setDone(json.amount);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="sale__done">
        <strong>✅ Purchase Metaga yuborildi</strong>
        <span>{fmt(done)}</span>
        <small>Telegramdagi karta yangilandi. Oynani yopishingiz mumkin.</small>
      </div>
    );
  }

  return (
    <form className="sale__form" onSubmit={submit}>
      <label className="field">
        <span>To&apos;lov summasi (so&apos;m)</span>
        <input
          inputMode="numeric"
          autoFocus
          placeholder="4 500 000"
          value={raw ? Number(raw).toLocaleString("ru-RU").replace(/,/g, " ") : ""}
          onChange={(e) => setRaw(digits(e.target.value))}
        />
      </label>
      <p className="sale__preview">{amount ? fmt(amount) : " "}</p>
      {error && <div className="form-error">{error}</div>}
      <button className="btn btn--gold btn--block" disabled={busy || !amount}>
        {busy ? "Yuborilmoqda…" : "Yuborish — Metaga Purchase"}
      </button>
    </form>
  );
}
