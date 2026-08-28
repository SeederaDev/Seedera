"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PRATICA_ENDPOINT, CONTACT_EMAIL } from "@/lib/api";
import {
  Etichetta, GRIGIO_TESTO, BORDO_CAMPO, colonna, stilePulsante, ACCEPT, MAX_FILE,
} from "@/components/voucher/campi";
import { etichettaStato, messaggioAssenza, dataIt, type Pratica } from "./pratica-logica";

/**
 * La pagina che il cliente apre dal link che gli abbiamo mandato. Il token sta
 * nella query e non nel percorso: con `output: 'export'` una rotta dinamica
 * vorrebbe conoscere i token alla build, e non li conosce nessuno.
 */
export default function PaginaPratica() {
  const [token, setToken] = useState<string | null>(null);
  const [pratica, setPratica] = useState<Pratica | null>(null);
  const [assenza, setAssenza] = useState<string | null>(null);
  const [caricando, setCaricando] = useState<string | null>(null);
  const [errore, setErrore] = useState<string | null>(null);
  const fileRef = useRef<Record<string, HTMLInputElement | null>>({});

  const leggi = (t: string) => {
    if (!PRATICA_ENDPOINT) { setAssenza(messaggioAssenza("rete", CONTACT_EMAIL)); return; }
    fetch(`${PRATICA_ENDPOINT}/${encodeURIComponent(t)}`)
      .then(res => {
        if (res.status === 404) { setAssenza(messaggioAssenza("non-valido", CONTACT_EMAIL)); return null; }
        if (!res.ok) { setAssenza(messaggioAssenza("rete", CONTACT_EMAIL)); return null; }
        return res.json();
      })
      .then(dati => { if (dati) { setPratica(dati); setAssenza(null); } })
      .catch(() => setAssenza(messaggioAssenza("rete", CONTACT_EMAIL)));
  };

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("p");
    if (!t) { setAssenza(messaggioAssenza("senza-token", CONTACT_EMAIL)); return; }
    setToken(t);
    leggi(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const carica = async (voceId: string) => {
    const input = fileRef.current[voceId];
    const file = input?.files?.[0];
    if (!file || !token) return;
    if (file.size > MAX_FILE) {
      setErrore("Il file supera i 20 MB: comprimilo o scansiona a risoluzione più bassa.");
      return;
    }
    setErrore(null);
    setCaricando(voceId);
    try {
      const dati = new FormData();
      dati.set("voce", voceId);
      dati.set("file", file);
      const res = await fetch(`${PRATICA_ENDPOINT}/${encodeURIComponent(token)}/documento`, {
        method: "POST", body: dati,
      });
      if (!res.ok) {
        const corpo = await res.json().catch(() => null);
        setErrore(corpo?.errore ?? "Caricamento non riuscito: riprova fra un momento.");
        return;
      }
      leggi(token); // la voce passa a "ci stiamo lavorando": si ricarica tutto
    } catch {
      setErrore(`Caricamento non riuscito: controlla la connessione, oppure scrivici a ${CONTACT_EMAIL}.`);
    } finally {
      setCaricando(null);
    }
  };

  return (
    <>
      <Navbar />
      <main>
        <section
          className="relative w-full flex items-end"
          style={{ height: "210px", backgroundColor: "var(--color-yellow)", paddingTop: "80px" }}
        >
          <div className="container-content pb-6">
            <h1 className="text-h1 text-black font-normal uppercase select-none">La tua pratica</h1>
            {pratica?.impresa && (
              <p style={{ color: GRIGIO_TESTO, marginTop: "6px", fontSize: "15px" }}>
                {pratica.impresa}
                {pratica.camera && ` · ${pratica.camera}`}
              </p>
            )}
          </div>
        </section>

        <section className="bg-white">
          <div
            className="container-content"
            style={{ paddingTop: "clamp(44px, 6vw, 72px)", paddingBottom: "clamp(80px, 10vw, 128px)" }}
          >
            <div style={colonna}>
              {assenza ? (
                <p className="leading-relaxed" style={{ color: "var(--color-black)" }}>{assenza}</p>
              ) : !pratica ? (
                <p className="leading-relaxed" style={{ color: GRIGIO_TESTO }}>Carico…</p>
              ) : (
                <>
                  <p className="leading-relaxed" style={{ color: "var(--color-black)" }}>
                    {pratica.bando && <>Domanda per il <strong>{pratica.bando}</strong>. </>}
                    Stato: <strong>{etichettaStato(pratica.stato)}</strong>
                    {pratica.aperta_il && <> · aperta il {dataIt(pratica.aperta_il)}</>}
                    {pratica.aggiornata_il && <> · ultimo aggiornamento {dataIt(pratica.aggiornata_il)}</>}
                  </p>
                  <p className="leading-relaxed" style={{ color: "var(--color-black)", marginTop: "12px" }}>
                    {pratica.prossimo_passo}
                  </p>

                  {pratica.serve_a_te.length > 0 && (
                    <div style={{ marginTop: "48px" }}>
                      <div style={{ marginBottom: "20px" }}><Etichetta>Serve a te</Etichetta></div>
                      <ul className="flex flex-col" style={{ gap: "12px" }}>
                        {pratica.serve_a_te.map(v => (
                          <li
                            key={v.id}
                            style={{
                              border: `1px solid ${BORDO_CAMPO}`, borderRadius: "8px",
                              padding: "14px 16px", color: "var(--color-black)",
                            }}
                          >
                            <span className="block font-medium">{v.nome}</span>
                            {v.descrizione && (
                              <span className="block leading-relaxed" style={{ color: GRIGIO_TESTO, fontSize: "14px", marginTop: "2px" }}>
                                {v.descrizione}
                              </span>
                            )}
                            <div className="flex flex-wrap items-center" style={{ gap: "10px", marginTop: "10px" }}>
                              <input
                                type="file"
                                accept={ACCEPT}
                                ref={el => { fileRef.current[v.id] = el; }}
                                className="campo-file"
                                style={{ fontSize: "14px", color: "var(--color-black)" }}
                              />
                              <button
                                type="button"
                                onClick={() => carica(v.id)}
                                disabled={caricando === v.id}
                                className="font-medium tracking-wide uppercase transition-all duration-300 hover:bg-[var(--color-yellow)] disabled:opacity-40"
                                style={{ ...stilePulsante, padding: "8px 14px" }}
                              >
                                {caricando === v.id ? "Carico…" : "Invia"}
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {pratica.stiamo_facendo.length > 0 && (
                    <div style={{ marginTop: "48px" }}>
                      <div style={{ marginBottom: "20px" }}><Etichetta>Ci stiamo lavorando noi</Etichetta></div>
                      <ul className="flex flex-col" style={{ gap: "6px", color: GRIGIO_TESTO }}>
                        {pratica.stiamo_facendo.map(nome => <li key={nome}>{nome}</li>)}
                      </ul>
                    </div>
                  )}

                  {pratica.fatte > 0 && (
                    <p className="leading-relaxed" style={{ color: GRIGIO_TESTO, marginTop: "32px" }}>
                      {pratica.fatte} {pratica.fatte === 1 ? "documento è" : "documenti sono"} già a posto.
                    </p>
                  )}

                  {errore && (
                    <p role="status" className="leading-relaxed" style={{ color: "var(--color-red)", marginTop: "24px" }}>
                      {errore}
                    </p>
                  )}

                  <p className="leading-relaxed" style={{ color: GRIGIO_TESTO, marginTop: "48px", fontSize: "14px" }}>
                    Se qualcosa non torna, scrivici a{" "}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="underline">{CONTACT_EMAIL}</a>:
                    ti risponde una persona.
                  </p>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
