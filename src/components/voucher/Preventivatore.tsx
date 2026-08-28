"use client";

import { useState } from "react";
import { euroTondo, percento, type Bando } from "@/lib/bandi";
import { PREVENTIVO_ENDPOINT, CONTACT_EMAIL } from "@/lib/api";
import {
  SETTORI, OBIETTIVI, DIMENSIONI, passoCompleto, messaggioErrore,
  type Risposte, type Contatto,
} from "./preventivatore-logica";
import {
  Etichetta, GRIGIO_TESTO, BORDO_CAMPO, colonna,
  stileCampo, stileEtichetta, stilePulsante,
} from "./campi";

/**
 * Due schermate prima del modulo: cosa serve all'impresa, e chi e'. Alla
 * risposta la pagina si riapre su `?o=<token>`, e da li' riprende il percorso
 * che esisteva gia' — riepilogo dell'offerta e candidatura.
 */
export default function Preventivatore({ bando }: { bando: Bando }) {
  const [passo, setPasso] = useState(0);
  const [risposte, setRisposte] = useState<Risposte>({ obiettivi: [] });
  const [contatto, setContatto] = useState<Contatto>({});
  const [testo, setTesto] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [invio, setInvio] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);

  const commutaObiettivo = (valore: string) =>
    setRisposte(r => ({
      ...r,
      obiettivi: r.obiettivi?.includes(valore)
        ? r.obiettivi.filter(o => o !== valore)
        : [...(r.obiettivi ?? []), valore],
    }));

  const chiedi = async () => {
    if (invio) return;
    setErrore(null);
    if (!PREVENTIVO_ENDPOINT) {
      setErrore(`Il preventivatore non è ancora attivo: scrivici a ${CONTACT_EMAIL} e te lo prepariamo noi.`);
      return;
    }
    setInvio(true);
    try {
      const res = await fetch(PREVENTIVO_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bando: bando.slug,
          email: contatto.email?.trim(),
          ragione_sociale: contatto.azienda?.trim(),
          telefono: contatto.telefono?.trim() || undefined,
          risposte,
          testo_libero: testo.trim() || undefined,
          consenso: true,
          sito_web: honeypot,
        }),
      });
      if (!res.ok) {
        setErrore(messaggioErrore(res, CONTACT_EMAIL));
        setInvio(false);
        return;
      }
      const { token } = await res.json();
      if (!token) {
        // L'honeypot risponde 200 senza token: per un bot va bene cosi', per
        // una persona che ci e' finita dentro serve una via d'uscita.
        setErrore(`Non siamo riusciti a preparare il preventivo: scrivici a ${CONTACT_EMAIL}.`);
        setInvio(false);
        return;
      }
      window.location.search = `?o=${encodeURIComponent(token)}`;
    } catch (err) {
      setErrore(messaggioErrore(err, CONTACT_EMAIL));
      setInvio(false);
    }
  };

  const completo = passoCompleto(passo, risposte, contatto);

  return (
    <section
      className="bg-white"
      style={{ paddingTop: "clamp(44px, 6vw, 72px)", paddingBottom: "clamp(60px, 8vw, 96px)" }}
    >
      <div className="container-content">
        <div style={colonna}>
          <div style={{ marginBottom: "20px" }}>
            <Etichetta>Quanto ti costa davvero</Etichetta>
          </div>
          <h2 className="text-h3 font-medium" style={{ color: "var(--color-black)", marginBottom: "12px" }}>
            Preventivo in due minuti
          </h2>
          <p className="leading-relaxed" style={{ color: GRIGIO_TESTO, marginBottom: "32px" }}>
            Rispondi a tre domande e ti diciamo cosa serve alla tua impresa, quanto
            costa e quanto ne copre il contributo camerale ({percento(bando.percentuale)},
            fino a {euroTondo(bando.tetto_cent)}). Il preventivo è gratuito e senza
            impegno: preparazione e presentazione della domanda sono incluse, e paghi
            solo i servizi che scegli, se decidi di procedere.
          </p>

          {passo === 0 ? (
            <div className="flex flex-col" style={{ gap: "28px" }}>
              <label>
                <span style={stileEtichetta}>Di cosa si occupa la tua impresa?</span>
                <select
                  value={risposte.settore ?? ""}
                  onChange={e => setRisposte(r => ({ ...r, settore: e.target.value }))}
                  style={stileCampo}
                >
                  <option value="">Scegli…</option>
                  {SETTORI.map(s => <option key={s.valore} value={s.valore}>{s.etichetta}</option>)}
                </select>
              </label>

              <fieldset>
                <legend style={stileEtichetta}>Cosa vorresti riuscire a fare? (puoi sceglierne più di una)</legend>
                <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "8px" }}>
                  {OBIETTIVI.map(o => {
                    const scelto = risposte.obiettivi?.includes(o.valore) ?? false;
                    return (
                      <label
                        key={o.valore}
                        className="flex items-start gap-2 cursor-pointer transition-colors duration-200"
                        style={{
                          border: `1px solid ${scelto ? "var(--color-black)" : BORDO_CAMPO}`,
                          backgroundColor: scelto ? "var(--color-yellow)" : "#fff",
                          borderRadius: "8px",
                          padding: "10px 12px",
                          color: "var(--color-black)",
                          fontSize: "15px",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={scelto}
                          onChange={() => commutaObiettivo(o.valore)}
                          style={{ marginTop: "4px" }}
                        />
                        <span>{o.etichetta}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset>
                <legend style={stileEtichetta}>Quante persone lavorano in azienda?</legend>
                <div className="flex flex-wrap" style={{ gap: "8px" }}>
                  {DIMENSIONI.map(d => {
                    const scelto = risposte.dimensione === d.valore;
                    return (
                      <label
                        key={d.valore}
                        className="cursor-pointer transition-colors duration-200"
                        style={{
                          border: `1px solid ${scelto ? "var(--color-black)" : BORDO_CAMPO}`,
                          backgroundColor: scelto ? "var(--color-yellow)" : "#fff",
                          borderRadius: "8px",
                          padding: "8px 14px",
                          color: "var(--color-black)",
                          fontSize: "15px",
                        }}
                      >
                        <input
                          type="radio"
                          name="dimensione"
                          checked={scelto}
                          onChange={() => setRisposte(r => ({ ...r, dimensione: d.valore }))}
                          className="sr-only"
                        />
                        {d.etichetta}
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <label>
                <span style={stileEtichetta}>Raccontaci in due righe cosa vorresti fare (facoltativo)</span>
                <textarea
                  rows={3}
                  value={testo}
                  onChange={e => setTesto(e.target.value)}
                  placeholder="Es. produciamo infissi su misura e oggi gestiamo gli ordini a telefono e su carta."
                  className="outline-none resize-none transition-colors duration-200 focus:border-[var(--color-black)]"
                  style={stileCampo}
                />
              </label>
            </div>
          ) : (
            <div className="flex flex-col" style={{ gap: "16px" }}>
              <p className="leading-relaxed" style={{ color: GRIGIO_TESTO }}>
                Dove ti mandiamo il preventivo. Il link resta tuo: puoi riaprirlo,
                toglierne le voci che non ti servono e procedere quando vuoi.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "16px" }}>
                <label>
                  <span style={stileEtichetta}>Ragione sociale *</span>
                  <input
                    value={contatto.azienda ?? ""}
                    onChange={e => setContatto(c => ({ ...c, azienda: e.target.value }))}
                    style={stileCampo}
                    className="outline-none transition-colors duration-200 focus:border-[var(--color-black)]"
                  />
                </label>
                <label>
                  <span style={stileEtichetta}>E-mail *</span>
                  <input
                    type="email"
                    value={contatto.email ?? ""}
                    onChange={e => setContatto(c => ({ ...c, email: e.target.value }))}
                    style={stileCampo}
                    className="outline-none transition-colors duration-200 focus:border-[var(--color-black)]"
                  />
                </label>
                <label className="md:col-span-2">
                  <span style={stileEtichetta}>Telefono (se preferisci che ti chiamiamo)</span>
                  <input
                    type="tel"
                    value={contatto.telefono ?? ""}
                    onChange={e => setContatto(c => ({ ...c, telefono: e.target.value }))}
                    style={stileCampo}
                    className="outline-none transition-colors duration-200 focus:border-[var(--color-black)]"
                  />
                </label>
              </div>

              {/* Honeypot: gli umani non lo vedono, i bot lo compilano. */}
              <input
                type="text" tabIndex={-1} autoComplete="off" aria-hidden="true"
                value={honeypot} onChange={e => setHoneypot(e.target.value)}
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
              />

              <label
                className="flex items-start gap-2 cursor-pointer"
                style={{ fontSize: "14px", color: "var(--color-black)" }}
              >
                <input
                  type="checkbox"
                  checked={contatto.consenso ?? false}
                  onChange={e => setContatto(c => ({ ...c, consenso: e.target.checked }))}
                  style={{ marginTop: "3px" }}
                />
                <span>
                  Autorizzo il trattamento dei dati per la preparazione del preventivo
                  e della domanda di contributo, come da{" "}
                  <a href="/voucher-digitale/informativa" className="underline" target="_blank" rel="noreferrer">
                    informativa privacy
                  </a>
                  . *
                </span>
              </label>
            </div>
          )}

          <div className="flex items-stretch" style={{ gap: "10px", marginTop: "32px" }}>
            {passo > 0 && (
              <button
                type="button"
                onClick={() => { setPasso(0); setErrore(null); }}
                className="font-medium tracking-wide uppercase transition-all duration-300"
                style={{ ...stilePulsante, border: `2px solid ${BORDO_CAMPO}` }}
              >
                ← Indietro
              </button>
            )}
            <button
              type="button"
              disabled={!completo || invio}
              onClick={() => (passo === 0 ? setPasso(1) : chiedi())}
              className="font-medium tracking-wide uppercase transition-all duration-300 hover:bg-[var(--color-yellow)] disabled:opacity-40"
              style={stilePulsante}
            >
              {passo === 0 ? "Avanti →" : invio ? "Preparo il preventivo…" : "Vedi il preventivo"}
            </button>
          </div>

          {errore && (
            <p role="status" className="leading-relaxed" style={{ color: "var(--color-red)", marginTop: "16px" }}>
              {errore}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
