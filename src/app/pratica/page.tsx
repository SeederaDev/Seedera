"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PRATICA_ENDPOINT, CONTACT_EMAIL } from "@/lib/api";
import {
  Etichetta, GRIGIO_TESTO, BORDO_CAMPO, colonna, stilePulsante, ACCEPT, MAX_FILE,
} from "@/components/voucher/campi";
import { etichettaStato, messaggioAssenza, dataIt, segnoVoce, siPuoScaricare, type Pratica } from "./pratica-logica";

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

  /* Cio' che il cliente deve avere, non mandare: una conferma basta a toglierci
     dall'attesa, e la verifica resta comunque nostra. */
  const conferma = async (voceId: string) => {
    if (!token) return;
    setErrore(null);
    setCaricando(voceId);
    try {
      const res = await fetch(`${PRATICA_ENDPOINT}/${encodeURIComponent(token)}/conferma`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voce: voceId }),
      });
      if (!res.ok) {
        const corpo = await res.json().catch(() => null);
        setErrore(corpo?.errore ?? "Non siamo riusciti a registrare la conferma: riprova fra un momento.");
        return;
      }
      leggi(token);
    } catch {
      setErrore(`Non siamo riusciti a registrare la conferma: controlla la connessione, oppure scrivici a ${CONTACT_EMAIL}.`);
    } finally {
      setCaricando(null);
    }
  };

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
          style={{ minHeight: "210px", backgroundColor: "var(--color-yellow)",
          paddingTop: "104px", paddingBottom: "24px" }}
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

                  {/* Documenti gia' suoi, senza gesto richiesto: il preventivo
                      firmato da noi, una scheda tecnica. Niente pulsanti di
                      caricamento qui: si scarica e basta. */}
                  {(pratica.da_scaricare ?? []).length > 0 && (
                    <div style={{ marginTop: "48px" }}>
                      <div style={{ marginBottom: "20px" }}><Etichetta>Da scaricare</Etichetta></div>
                      <p className="leading-relaxed" style={{ color: "var(--color-black)", marginBottom: "16px" }}>
                        Documenti che abbiamo preparato per te: scaricali e conservali.
                      </p>
                      <ul className="flex flex-col" style={{ gap: "12px" }}>
                        {(pratica.da_scaricare ?? []).map(v => (
                          <li
                            key={v.id}
                            style={{
                              border: "1px solid rgba(0,0,0,.18)",
                              borderRadius: "8px",
                              padding: "14px 16px",
                              color: "var(--color-black)",
                              backgroundColor: "#fff",
                            }}
                          >
                            <div className="flex flex-wrap items-center justify-between" style={{ gap: "10px" }}>
                              <span>
                                <span className="font-medium">{v.nome}</span>
                                {v.descrizione && (
                                  <span className="block leading-relaxed" style={{ color: GRIGIO_TESTO, fontSize: "14px", marginTop: "2px" }}>
                                    {v.descrizione}
                                  </span>
                                )}
                              </span>
                              <span className="flex flex-wrap" style={{ gap: "8px" }}>
                                {v.documenti.map((docId, i) => (
                                  <a
                                    key={docId}
                                    href={`${PRATICA_ENDPOINT}/${encodeURIComponent(token ?? "")}/documento/${docId}`}
                                    className="font-medium tracking-wide uppercase transition-all duration-300 hover:bg-[var(--color-yellow)]"
                                    style={{ ...stilePulsante, padding: "8px 14px", display: "inline-block" }}
                                  >
                                    {v.documenti.length > 1 ? `Scarica ${i + 1}` : "Scarica"}
                                  </a>
                                ))}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Prima di tutto il resto: sono documenti gia' pronti, che
                      aspettano solo la sua firma. Metterli sotto "quello che
                      serve a te" li confonderebbe con le carte da procurarsi,
                      che e' un lavoro diverso e piu' lungo. */}
                  {pratica.da_firmare.length > 0 && (
                    <div style={{ marginTop: "48px" }}>
                      <div style={{ marginBottom: "20px" }}><Etichetta>Da firmare</Etichetta></div>
                      <p className="leading-relaxed" style={{ color: "var(--color-black)", marginBottom: "16px" }}>
                        Questi documenti li abbiamo preparati noi. Vanno scaricati, firmati
                        digitalmente dal <strong>legale rappresentante</strong> e ricaricati qui:
                        firmati da altri la domanda non è ricevibile.
                      </p>
                      <ul className="flex flex-col" style={{ gap: "12px" }}>
                        {pratica.da_firmare.map(v => (
                          <li
                            key={v.id}
                            style={{
                              border: "1px solid var(--color-black)",
                              borderRadius: "8px",
                              padding: "14px 16px",
                              color: "var(--color-black)",
                              backgroundColor: "#fff",
                            }}
                          >
                            <span className="font-medium">{v.nome}</span>
                            {v.descrizione && (
                              <span className="block leading-relaxed" style={{ color: GRIGIO_TESTO, fontSize: "14px", marginTop: "2px" }}>
                                {v.descrizione}
                              </span>
                            )}
                            <div className="flex flex-wrap items-center" style={{ gap: "10px", marginTop: "12px" }}>
                              {siPuoScaricare(v) ? (
                                <a
                                  href={`${PRATICA_ENDPOINT}/${encodeURIComponent(token ?? "")}/documento/${v.documento_id}`}
                                  className="font-medium tracking-wide uppercase transition-all duration-300 hover:bg-[var(--color-yellow)]"
                                  style={{ ...stilePulsante, padding: "8px 14px", display: "inline-block" }}
                                >
                                  Scarica
                                </a>
                              ) : (
                                <span style={{ color: GRIGIO_TESTO, fontSize: "14px" }}>
                                  Il file non è ancora allegato: scrivici e te lo mandiamo.
                                </span>
                              )}
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
                                {caricando === v.id ? "Carico…" : "Invia firmato"}
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {pratica.serve_a_te.length > 0 && (
                    <div style={{ marginTop: "48px" }}>
                      <div style={{ marginBottom: "20px" }}><Etichetta>Quello che serve a te</Etichetta></div>
                      <ul className="flex flex-col" style={{ gap: "12px" }}>
                        {pratica.serve_a_te.map(v => {
                          /* Una fonte sola per lo stato del riquadro: l'etichetta
                             e il corpo leggevano `v.stato` per conto proprio e
                             potevano contraddirsi ("Da mandare" sopra, "lo
                             abbiamo ricevuto" sotto) appena il campo arrivava
                             mancante o con un valore inatteso. */
                          const segno = segnoVoce(v.stato, v.si_carica);
                          const fatto = segno.tono !== "aperto";
                          return (
                          <li
                            key={v.id}
                            style={{
                              /* Il riquadro non sparisce quando lo mandi: cambia
                                 aspetto. Vederlo svanire dopo un click sembra di
                                 aver perso qualcosa, e non dice se e' andata bene. */
                              border: `1px solid ${fatto ? "rgba(0,0,0,.18)" : BORDO_CAMPO}`,
                              borderRadius: "8px",
                              padding: "14px 16px",
                              color: "var(--color-black)",
                              backgroundColor: fatto ? "rgba(0,0,0,.03)" : "#fff",
                            }}
                          >
                            <div className="flex flex-wrap items-baseline" style={{ gap: "10px" }}>
                              <span className="font-medium">{v.nome}</span>
                              <span style={{
                                fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.04em",
                                borderRadius: "5px", padding: "3px 8px",
                                border: "1px solid",
                                borderColor: segno.tono === "aperto" ? "var(--color-black)" : "rgba(0,0,0,.25)",
                                backgroundColor: segno.tono === "fatto" ? "var(--color-yellow)" : "transparent",
                                color: segno.tono === "aperto" ? "var(--color-black)" : GRIGIO_TESTO,
                              }}>
                                {segno.etichetta}
                              </span>
                            </div>
                            {v.descrizione && (
                              <span className="block leading-relaxed" style={{ color: GRIGIO_TESTO, fontSize: "14px", marginTop: "2px" }}>
                                {v.descrizione}
                              </span>
                            )}
                            <div className="flex flex-wrap items-center" style={{ gap: "10px", marginTop: "10px" }}>
                              {fatto ? (
                                <span style={{ color: GRIGIO_TESTO, fontSize: "14px" }}>
                                  {segno.tono === "fatto"
                                    ? "Verificato: non devi fare altro."
                                    : v.si_carica
                                      ? "Lo abbiamo ricevuto. Se hai mandato il file sbagliato, scrivici e lo sostituiamo."
                                      : "Registrato. Se cambia qualcosa, scrivici."}
                                </span>
                              ) : v.si_carica ? (
                                <>
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
                                </>
                              ) : (
                                /* Questa non si manda: si ha. Al cliente si chiede
                                   di confermarlo, e a noi basta per andare avanti. */
                                <button
                                  type="button"
                                  onClick={() => conferma(v.id)}
                                  disabled={caricando === v.id}
                                  className="font-medium tracking-wide uppercase transition-all duration-300 hover:bg-[var(--color-yellow)] disabled:opacity-40"
                                  style={{ ...stilePulsante, padding: "8px 14px" }}
                                >
                                  {caricando === v.id ? "Confermo…" : "Ce l'ho"}
                                </button>
                              )}
                            </div>
                          </li>
                        );
                        })}
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
