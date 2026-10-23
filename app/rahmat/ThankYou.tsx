"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { TG_GROUP_URL } from "@/lib/config";

const TOTAL = 10;
const R = 54;
const C = 2 * Math.PI * R;

export default function ThankYou() {
  const [left, setLeft] = useState(TOTAL);
  const [name, setName] = useState("");

  useEffect(() => {
    try {
      setName(sessionStorage.getItem("lh_name") || "");
    } catch {}
    const started = Date.now();
    const iv = setInterval(() => {
      const remain = Math.max(0, TOTAL - Math.floor((Date.now() - started) / 1000));
      setLeft(remain);
      if (remain <= 0) {
        clearInterval(iv);
        window.location.href = TG_GROUP_URL;
      }
    }, 200);
    return () => clearInterval(iv);
  }, []);

  const progress = (TOTAL - left) / TOTAL;

  return (
    <main className="ty">
      <div className="ty__confetti" aria-hidden>
        {Array.from({ length: 28 }).map((_, i) => (
          <i key={i} style={{ ["--i" as string]: i }} />
        ))}
      </div>

      <div className="ty__card">
        <div className="ty__logo">
          <Image src="/logo.png" alt="Little Harvard" width={96} height={96} priority />
        </div>

        <svg className="ty__check" viewBox="0 0 52 52" aria-hidden>
          <circle cx="26" cy="26" r="24" />
          <path d="M15 27 l7 7 l15 -16" />
        </svg>

        <h1>
          Rahmat{name ? `, ${name}` : ""}! <span className="gold-text">Arizangiz qabul qilindi</span>
        </h1>
        <p>
          Mutaxassisimiz tez orada siz bilan bog&apos;lanadi. Shu vaqtgacha Telegram guruhimizga
          qo&apos;shiling — u yerda maktab hayoti, natijalar va chegirmalar haqida yangiliklar bor.
        </p>

        <div className="ty__timer" role="timer" aria-live="polite">
          <svg viewBox="0 0 120 120">
            <circle className="ty__track" cx="60" cy="60" r={R} />
            <circle
              className="ty__ring"
              cx="60"
              cy="60"
              r={R}
              strokeDasharray={C}
              strokeDashoffset={C * progress}
            />
          </svg>
          <span key={left} className="ty__num">
            {left}
          </span>
        </div>
        <small className="ty__hint">{left} soniyadan so&apos;ng Telegram guruhga o&apos;tasiz</small>

        <a href={TG_GROUP_URL} className="btn btn--tg">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
            <path
              fill="currentColor"
              d="M9.04 15.6 8.87 19.4c.38 0 .55-.16.75-.36l1.8-1.72 3.73 2.73c.68.38 1.17.18 1.36-.63l2.46-11.53c.23-1.02-.37-1.42-1.03-1.17L3.5 10.27c-.98.38-.96.93-.17 1.18l3.69 1.15 8.58-5.4c.4-.27.77-.12.47.15"
            />
          </svg>
          Hozir guruhga o&apos;tish
        </a>
      </div>
    </main>
  );
}
