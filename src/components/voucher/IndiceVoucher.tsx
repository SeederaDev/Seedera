"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ordinaPerPriorita, statoBando, euroTondo, percento, dataIt, PROVINCE, type Bando } from "@/lib/bandi";
import { OFFERTA_ENDPOINT } from "@/lib/api";
import { Etichetta, GRIGIO_TESTO, BORDO_CAMPO, colonna, stileCampo, stileEtichetta } from "@/components/voucher/campi";

const ETICHETTA_STATO: Record<string, string> = {
  in_apertura: "apre a breve",
  aperto: "domande aperte",
  chiuso: "chiuso",
  esaurito: "fondi esauriti",
  da_definire: "date da definire",
};

export default function IndiceVoucher({ bandi }: { bandi: Bando[] }) {
  const [oggi, setOggi] = useState(() => new Date().toISOString().slice(0, 10));
  const [provincia, setProvincia] = useState("");
  useEffect(() => setOggi(new Date().toISOString().slice(0, 10)), []);

  /* Le offerte mandate ai clienti prima che esistessero le pagine per camera
     puntano tutte qui. Il token vale ancora: si chiede all'API di quale bando
     e' e si porta la persona sulla sua pagina, col token appresso. Senza
     questo passaggio ogni link gia' in giro finirebbe su un elenco. */
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("o");
    if (!token || !OFFERTA_ENDPOINT) return;
    fetch(`${OFFERTA_ENDPOINT}/${encodeURIComponent(token)}`)
      .then(res => (res.ok ? res.json() : null))
      .then(offerta => {
        const slug = offerta?.bando_slug ?? bandi[0]?.slug;
        if (slug) window.location.replace(`/voucher-digitale/${slug}?o=${encodeURIComponent(token)}`);
      })
      .catch(() => {});
  }, []);

  const elenco = useMemo(() => ordinaPerPriorita(bandi, oggi), [oggi, bandi]);
  const province = useMemo(() => PROVINCE(bandi), [bandi]);

  const vaiAllaProvincia = (sigla: string) => {
    setProvincia(sigla);
    const bando = bandi.find(b =>
      (b.province ?? "").split(",").map(p => p.trim().toUpperCase()).includes(sigla));
    if (bando) window.location.href = `/voucher-digitale/${bando.slug}`;
  };

  return (
    <>
      <Navbar />
      <main>
        <section
          className="relative w-full flex items-end"
          style={{ minHeight: "210px", backgroundColor: "var(--color-yellow)",
          paddingTop: "104px", paddingBottom: "24px" }}
        >
          <div className="container-content pb-6">
            <h1 className="text-h1 text-black font-normal uppercase select-none">
              Voucher digitali 2026
            </h1>
          </div>
        </section>

        <section className="bg-white">
          <div
            className="container-content"
            style={{ paddingTop: "clamp(48px, 7vw, 88px)", paddingBottom: "clamp(80px, 10vw, 128px)" }}
          >
            <div style={colonna}>
              <div style={{ marginBottom: "20px" }}>
                <Etichetta>Di cosa parliamo</Etichetta>
              </div>
              <p className="leading-relaxed" style={{ color: "var(--color-black)" }}>
                Le Camere di Commercio finanziano a fondo perduto la digitalizzazione
                delle piccole e medie imprese. Ogni camera ha il suo bando, con le sue
                date, la sua percentuale e il suo tetto: qui sotto ci sono quelli che
                seguiamo, con lo stato di oggi.
              </p>
              <p className="leading-relaxed" style={{ color: "var(--color-black)", marginTop: "12px" }}>
                Prepariamo e presentiamo la domanda per te. L&rsquo;unico passaggio che
                resta a te è la firma digitale del legale rappresentante.
              </p>

              {province.length > 0 && (
                <label style={{ display: "block", marginTop: "32px", maxWidth: "360px" }}>
                  <span style={stileEtichetta}>Cerca la tua provincia</span>
                  <select
                    value={provincia}
                    onChange={e => e.target.value && vaiAllaProvincia(e.target.value)}
                    style={stileCampo}
                  >
                    <option value="">Scegli la provincia della sede…</option>
                    {province.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </label>
              )}

              <ul className="flex flex-col" style={{ gap: "12px", marginTop: "40px" }}>
                {elenco.map(b => {
                  const { stato, giorni } = statoBando(b, oggi);
                  const spento = stato === "chiuso" || stato === "esaurito";
                  return (
                    <li key={b.slug}>
                      <a
                        href={`/voucher-digitale/${b.slug}`}
                        className="block transition-colors duration-200 hover:bg-[var(--color-yellow)]"
                        style={{
                          border: `1px solid ${BORDO_CAMPO}`,
                          borderRadius: "8px",
                          padding: "16px 18px",
                          color: "var(--color-black)",
                          opacity: spento ? 0.55 : 1,
                        }}
                      >
                        <span className="flex flex-wrap items-baseline justify-between gap-2">
                          <span className="font-medium" style={{ fontSize: "18px" }}>{b.camera}</span>
                          <span style={{ fontSize: "13px", color: GRIGIO_TESTO }}>
                            {ETICHETTA_STATO[stato]}
                            {giorni != null && ` · ${giorni} giorni`}
                          </span>
                        </span>
                        <span className="block" style={{ fontSize: "14px", color: GRIGIO_TESTO, marginTop: "4px" }}>
                          {percento(b.percentuale)} fino a {euroTondo(b.tetto_cent)}
                          {b.province && ` · ${b.province}`}
                          {stato === "in_apertura" && b.apertura && ` · apre il ${dataIt(b.apertura)}`}
                          {stato === "aperto" && b.chiusura && ` · entro il ${dataIt(b.chiusura)}`}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>

              {elenco.length === 0 && (
                <p className="leading-relaxed" style={{ color: GRIGIO_TESTO, marginTop: "32px" }}>
                  Nessun bando pubblicato in questo momento. Scrivici e ti diciamo
                  cosa è aperto nella tua provincia.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
