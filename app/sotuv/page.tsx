import type { Metadata } from "next";
import { decodePayload, verifyLink } from "@/lib/meta";
import SaleForm from "./SaleForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sotuv — Little Harvard",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

type Props = { searchParams: Promise<Record<string, string | undefined>> };

// Telegramdagi "💰 Sotib oldi" tugmasi shu sahifani ochadi
export default async function Page({ searchParams }: Props) {
  const { d = "", m = "", s = "" } = await searchParams;
  const p = verifyLink(d, m, s) ? decodePayload(d) : null;

  if (!p) {
    return (
      <main className="sale">
        <div className="sale__card">
          <h1>Havola noto&apos;g&apos;ri</h1>
          <p className="sale__muted">Telegramdagi lid kartasidan «💰 Sotib oldi» tugmasini qayta bosing.</p>
        </div>
      </main>
    );
  }

  const time = new Date(p.t * 1000).toLocaleString("ru-RU", { timeZone: "Asia/Tashkent" });
  const rows: [string, string | undefined][] = [
    ["ph", p.ph],
    ["fn", p.fn],
    ["ln", p.ln],
    ["external_id", p.xid],
    ["_fbp", p.fbp],
    ["_fbc", p.fbc],
    ["IP", p.ip],
  ];

  return (
    <main className="sale">
      <div className="sale__card">
        <span className="sale__tag">💰 Sotuv</span>
        <h1>{p.n}</h1>
        <p className="sale__muted">
          Ariza: {time} · <code>{p.id}</code>
        </p>

        <SaleForm d={d} m={m} s={s} />

        <details className="sale__hash">
          <summary>🔐 Metaga ketadigan ma&apos;lumotlar (SHA-256 + cookie)</summary>
          <dl>
            {rows.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>
                  <code>{v || "—"}</code>
                </dd>
              </div>
            ))}
          </dl>
        </details>
      </div>
    </main>
  );
}
