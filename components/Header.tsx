"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { SCHOOL } from "@/lib/config";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
      <div className="container header__in">
        <a href="#top" className="brand" aria-label="Little Harvard">
          <Image src="/logo.png" alt="Little Harvard logotipi" width={44} height={44} priority />
          <span>
            <b>Little Harvard</b>
            <small>Xususiy maktab va bog&apos;cha</small>
          </span>
        </a>
        <nav className="nav">
          <a href="#afzallik">Uslubimiz</a>
          <a href="#bosqich">Sinflar</a>
          <a href="#natija">Natijalar</a>
          <a href="#kafolat">Taklif</a>
          <a href="#savol">Savollar</a>
        </nav>
        <div className="header__cta">
          <a href={SCHOOL.phoneHref} className="header__phone">
            {SCHOOL.phone}
          </a>
          <a href="#ariza" className="btn btn--gold btn--sm">
            Ariza qoldirish
          </a>
        </div>
      </div>
    </header>
  );
}
