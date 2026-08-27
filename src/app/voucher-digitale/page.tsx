"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* Endpoint del backend proprietario (repo seedera-backend). Con
   output: 'export' non esistono API route: senza la variabile il modulo
   avvisa e rimanda alla mail. */
const VOUCHER_ENDPOINT = process.env.NEXT_PUBLIC_VOUCHER_ENDPOINT ?? "";
/* L'endpoint delle offerte vive accanto a quello dell'onboarding. */
const OFFERTA_ENDPOINT = VOUCHER_ENDPOINT.replace("/voucher/onboarding", "/offerta");
const CONTACT_EMAIL = "info@seedera.it";

const MAX_FILE = 20 * 1024 * 1024;

/* Il bando ammette solo PDF e scansioni. */
const ACCEPT = "application/pdf,image/jpeg,image/png";

const PASSI = ["Impresa", "Legale rappresentante", "Documenti", "Progetto e invio"];

/* Il grigio di sistema del sito (#ccc) su bianco non si legge: per i testi
   secondari di questa pagina si usa un grigio che regge il contrasto. */
const GRIGIO_TESTO = "#5a5a5a";
/* Il token --color-light-grey non esiste nel sito: con una variabile
   inesistente la dichiarazione border decade e i campi restano senza bordo. */
const BORDO_CAMPO = "#c9c9c9";

interface Offerta {
  intestatario: string;
  referente: string | null;
  righe: { descrizione: string; dettaglio: string | null; importo_cent: number; opzionale: boolean }[];
  totale_cent: number;
  contributo_cent: number;
  a_carico_cent: number;
}

/* Stessa regola del backend (bando art.3): 70%, tetto 10.000 €. */
const contributoSu = (totaleCent: number) => {
  const contributo = Math.min(Math.round(totaleCent * 0.7), 1_000_000);
  return { contributo, aCarico: totaleCent - contributo };
};
const MIN_INVESTIMENTO_CENT = 400_000;

const euro = (cent: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(cent / 100);

const etichettaPill = {
  borderRadius: "5px",
  padding: "5px 10px",
  fontSize: "14px",
  lineHeight: "20px",
} as const;

/* Campi da modulo, non da manifesto: etichetta sopra, input compatto.
   16px fissi sull'input: sotto quella soglia iOS zooma la pagina. */
const stileEtichetta = {
  display: "block",
  fontSize: "13px",
  fontWeight: 500,
  color: "var(--color-black)",
  marginBottom: "4px",
} as const;

const stileCampo = {
  width: "100%",
  padding: "10px 12px",
  fontSize: "16px",
  borderRadius: "8px",
  border: `1px solid ${BORDO_CAMPO}`,
  backgroundColor: "#fff",
  color: "var(--color-black)",
} as const;

function Campo({
  nome,
  etichetta,
  esempio,
  tipo = "text",
  obbligatorio = false,
  larga = false,
}: {
  nome: string;
  etichetta: string;
  esempio?: string;
  tipo?: string;
  obbligatorio?: boolean;
  larga?: boolean;
}) {
  return (
    <label className={larga ? "md:col-span-2" : undefined}>
      <span style={stileEtichetta}>
        {etichetta}
        {obbligatorio && <span aria-hidden="true"> *</span>}
      </span>
      <input
        type={tipo}
        name={nome}
        placeholder={esempio}
        required={obbligatorio}
        className="outline-none transition-colors duration-200 focus:border-[var(--color-black)]"
        style={stileCampo}
      />
    </label>
  );
}

function Blocco({
  etichetta,
  children,
}: {
  etichetta: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-start">
      <div className="shrink-0 mb-6 md:mb-0">
        <span
          className="inline-flex items-center border border-black text-black tracking-wide uppercase"
          style={etichettaPill}
        >
          {etichetta}
        </span>
      </div>
      <div className="request-col grid grid-cols-1 md:grid-cols-2" style={{ gap: "14px" }}>
        {children}
      </div>
    </div>
  );
}

function CampoFile({
  nome,
  etichetta,
  aiuto,
  obbligatorio = false,
  disabilitato = false,
}: {
  nome: string;
  etichetta: string;
  aiuto?: string;
  obbligatorio?: boolean;
  disabilitato?: boolean;
}) {
  return (
    <label
      className="md:col-span-2 block cursor-pointer transition-opacity duration-200"
      style={{
        border: `1px dashed ${BORDO_CAMPO}`,
        borderRadius: "8px",
        padding: "12px 14px",
        backgroundColor: "#fff",
        opacity: disabilitato ? 0.45 : 1,
      }}
    >
      <span style={stileEtichetta}>
        {etichetta}
        {obbligatorio && <span aria-hidden="true"> *</span>}
      </span>
      {aiuto && (
        <span className="block" style={{ fontSize: "13px", color: GRIGIO_TESTO, marginBottom: "6px" }}>
          {aiuto}
        </span>
      )}
      <input
        type="file"
        name={nome}
        accept={ACCEPT}
        required={obbligatorio && !disabilitato}
        disabled={disabilitato}
        className="block w-full"
        style={{ fontSize: "14px" }}
      />
    </label>
  );
}

function RiepilogoOfferta({
  offerta,
  scelte,
  cambiaScelta,
}: {
  offerta: Offerta;
  scelte: boolean[];
  cambiaScelta: (indice: number, tenuta: boolean) => void;
}) {
  const totale = offerta.righe.reduce(
    (somma, riga, i) => somma + (scelte[i] ? riga.importo_cent : 0),
    0,
  );
  const { contributo, aCarico } = contributoSu(totale);
  return (
    <section style={{ backgroundColor: "var(--color-yellow)" }}>
      <div
        className="container-content"
        style={{ paddingTop: "50px", paddingBottom: "50px" }}
      >
        <div className="flex flex-col md:flex-row md:items-start">
          <div className="shrink-0 mb-6 md:mb-0">
            <span
              className="inline-flex items-center border border-black text-black tracking-wide uppercase"
              style={etichettaPill}
            >
              La tua offerta
            </span>
          </div>
          <div className="request-col" style={{ color: "var(--color-black)" }}>
            <h2 className="text-h3 font-medium" style={{ marginBottom: "16px" }}>
              Proposta riservata a {offerta.intestatario}
              {offerta.referente ? `, c.a. ${offerta.referente}` : ""}
            </h2>
            <ul style={{ marginBottom: "16px" }}>
              {offerta.righe.map((r, i) => (
                <li
                  key={i}
                  className="flex justify-between gap-6"
                  style={{
                    padding: "10px 0",
                    borderBottom: "1px solid rgba(0,0,0,0.25)",
                    opacity: scelte[i] ? 1 : 0.45,
                  }}
                >
                  {r.opzionale ? (
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={scelte[i]}
                        onChange={(e) => cambiaScelta(i, e.target.checked)}
                        style={{ marginTop: "5px" }}
                      />
                      <span>
                        <span className="font-medium">{r.descrizione}</span>{" "}
                        <em style={{ fontSize: "13px" }}>(opzionale: puoi toglierla)</em>
                        {r.dettaglio && (
                          <span
                            className="block leading-relaxed"
                            style={{ fontSize: "14px", marginTop: "2px" }}
                          >
                            {r.dettaglio}
                          </span>
                        )}
                      </span>
                    </label>
                  ) : (
                    <span>
                      <span className="font-medium">{r.descrizione}</span>
                      {r.dettaglio && (
                        <span
                          className="block leading-relaxed"
                          style={{ fontSize: "14px", marginTop: "2px" }}
                        >
                          {r.dettaglio}
                        </span>
                      )}
                    </span>
                  )}
                  <span
                    className="font-medium whitespace-nowrap"
                    style={{ textDecoration: scelte[i] ? "none" : "line-through" }}
                  >
                    {euro(r.importo_cent)}
                  </span>
                </li>
              ))}
              <li className="flex justify-between gap-6 font-medium" style={{ padding: "10px 0" }}>
                <span>Totale progetto</span>
                <span className="whitespace-nowrap">{euro(totale)}</span>
              </li>
            </ul>
            <p className="leading-relaxed">
              Con il voucher, il contributo camerale copre{" "}
              <strong>{euro(contributo)}</strong>: a carico tuo restano{" "}
              <strong>{euro(aCarico)}</strong>.
            </p>
            {totale < MIN_INVESTIMENTO_CENT && (
              <p className="leading-relaxed font-medium" style={{ marginTop: "8px" }}>
                Attenzione: sotto i 4.000&nbsp;€ di investimento il bando non
                ammette la domanda. Rimetti una voce o scrivici per rimodulare
                la proposta.
              </p>
            )}
            <p className="leading-relaxed" style={{ marginTop: "8px", fontSize: "14px" }}>
              Il contributo (70% della spesa, massimo 10.000&nbsp;€) è concesso
              dalla Camera di Commercio in ordine di arrivo delle domande, fino
              a esaurimento fondi.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function VoucherDigitalePage() {
  const [passo, setPasso] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [avviso, setAvviso] = useState<string | null>(null);
  const [polizzaMancante, setPolizzaMancante] = useState(false);
  const [offerta, setOfferta] = useState<Offerta | null>(null);
  const [tokenOfferta, setTokenOfferta] = useState<string>("");
  const [scelte, setScelte] = useState<boolean[]>([]);
  const passiRef = useRef<Array<HTMLDivElement | null>>([]);

  /* ?o=TOKEN: si carica l'offerta e la si mostra in cima. Un token morto
     non deve rompere la pagina: semplicemente niente riepilogo. */
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("o");
    if (!token || !OFFERTA_ENDPOINT) return;
    setTokenOfferta(token);
    fetch(`${OFFERTA_ENDPOINT}/${encodeURIComponent(token)}`)
      .then(res => (res.ok ? res.json() : null))
      .then(dati => {
        if (dati) {
          setOfferta(dati);
          setScelte(dati.righe.map(() => true)); // si parte con tutto incluso
        }
      })
      .catch(() => {});
  }, []);

  const passoValido = (indice: number) => {
    const contenitore = passiRef.current[indice];
    if (!contenitore) return true;
    const campi = contenitore.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      "input, textarea",
    );
    for (const campo of campi) {
      if (!campo.checkValidity()) {
        campo.reportValidity();
        return false;
      }
    }
    return true;
  };

  const avanti = () => {
    if (passoValido(passo)) setPasso(p => Math.min(p + 1, PASSI.length - 1));
  };
  const indietro = () => setPasso(p => Math.max(p - 1, 0));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    setAvviso(null);

    for (let i = 0; i < PASSI.length; i++) {
      if (!passoValido(i)) {
        setPasso(i);
        return;
      }
    }

    if (!VOUCHER_ENDPOINT) {
      setStatus("error");
      setAvviso(
        `Il modulo non è ancora attivo: scrivici a ${CONTACT_EMAIL} e ti mandiamo tutto noi.`,
      );
      return;
    }

    const form = e.currentTarget;
    const dati = new FormData(form);
    dati.set("consenso", dati.get("consenso") === "on" ? "true" : "false");
    dati.set("polizza_mancante", polizzaMancante ? "true" : "false");
    if (tokenOfferta) dati.set("offerta", tokenOfferta);
    if (offerta) {
      const tenute = offerta.righe.map((_, i) => i).filter(i => scelte[i]);
      dati.set("offerta_selezione", JSON.stringify(tenute));
    }

    for (const [campo, valore] of dati.entries()) {
      if (valore instanceof File && valore.size > MAX_FILE) {
        setStatus("error");
        setAvviso(
          `Il file di "${campo}" supera i 20 MB: comprimilo o scansiona a risoluzione più bassa.`,
        );
        return;
      }
    }

    setStatus("sending");
    try {
      const res = await fetch(VOUCHER_ENDPOINT, { method: "POST", body: dati });
      if (!res.ok) {
        const corpo = await res.json().catch(() => null);
        throw new Error(corpo?.errore ?? `HTTP ${res.status}`);
      }
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setAvviso(
        err instanceof Error && !err.message.startsWith("HTTP")
          ? err.message
          : `Invio non riuscito. Scrivici direttamente a ${CONTACT_EMAIL}.`,
      );
    }
  };

  return (
    <>
      <Navbar />
      <main>
        {/* ── Hero ── */}
        <section
          className="relative w-full flex items-end"
          style={{
            height: "210px",
            backgroundColor: "var(--color-yellow)",
            paddingTop: "80px",
          }}
        >
          <div className="container-content pb-6">
            <h1 className="text-h1 text-black font-normal uppercase select-none">
              Voucher digitale 2026
            </h1>
          </div>
        </section>

        {/* ── Riepilogo offerta (solo con link personale) ── */}
        {offerta && (
          <RiepilogoOfferta
            offerta={offerta}
            scelte={scelte}
            cambiaScelta={(i, tenuta) =>
              setScelte(s => s.map((v, j) => (j === i ? tenuta : v)))
            }
          />
        )}

        {/* ── Intro ── */}
        <section className="bg-white">
          <div
            className="container-content"
            style={{ paddingTop: "36px", paddingBottom: "28px" }}
          >
            <div className="flex flex-col md:flex-row md:items-start">
              <div className="shrink-0 mb-6 md:mb-0">
                <span
                  className="inline-flex items-center border border-black text-black tracking-wide uppercase"
                  style={etichettaPill}
                >
                  Come funziona
                </span>
              </div>
              <div className="request-col">
                <h2
                  className="text-h3 font-medium leading-[1.3]"
                  style={{ color: "var(--color-black)" }}
                >
                  La Camera di Commercio Frosinone–Latina finanzia la
                  digitalizzazione con un contributo a fondo perduto fino a
                  10.000&nbsp;€ (70% della spesa). Compila i dati e carica i
                  documenti: ti aiutiamo a preparare e presentare la domanda.
                </h2>
                <p
                  className="leading-relaxed"
                  style={{ color: GRIGIO_TESTO, marginTop: "14px" }}
                >
                  Le domande partono il 25 settembre 2026 e valgono in ordine di
                  arrivo: prima riceviamo i documenti, prima sei in fila.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Percorso a passi ── */}
        {status !== "sent" ? (
          <section className="bg-white" style={{ paddingBottom: "120px" }}>
            <div className="container-content">
              {/* Indicatore dei passi */}
              <ol
                className="flex flex-wrap"
                style={{ gap: "8px", marginBottom: "28px" }}
              >
                {PASSI.map((nome, i) => (
                  <li
                    key={nome}
                    className="flex items-center uppercase tracking-wide"
                    style={{
                      borderRadius: "5px",
                      border: "1px solid",
                      borderColor: i === passo ? "var(--color-black)" : BORDO_CAMPO,
                      backgroundColor: i === passo ? "var(--color-yellow)" : "transparent",
                      color: i <= passo ? "var(--color-black)" : GRIGIO_TESTO,
                      padding: "4px 10px",
                      fontSize: "12px",
                    }}
                  >
                    {i + 1}. {nome}
                  </li>
                ))}
              </ol>

              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col"
                style={{ gap: "28px" }}
              >
                {/* Honeypot: gli umani non lo vedono, i bot lo compilano. */}
                <input
                  type="text"
                  name="sito_web"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] h-0 w-0 opacity-0"
                />

                {/* I passi restano montati (hidden) cosi' input e file non si perdono. */}
                <div ref={el => { passiRef.current[0] = el; }} hidden={passo !== 0}>
                  <Blocco etichetta="Impresa">
                    <Campo nome="ragione_sociale" etichetta="Ragione sociale" esempio="Es. Farma Store S.r.l." obbligatorio />
                    <Campo nome="piva" etichetta="Partita IVA" esempio="11 cifre" obbligatorio />
                    <Campo nome="referente" etichetta="Referente (nome e cognome)" obbligatorio />
                    <Campo nome="email" etichetta="E-mail" tipo="email" obbligatorio />
                    <Campo nome="telefono" etichetta="Telefono" tipo="tel" />
                    <Campo nome="pec" etichetta="PEC aziendale" tipo="email" />
                  </Blocco>
                </div>

                <div ref={el => { passiRef.current[1] = el; }} hidden={passo !== 1}>
                  <Blocco etichetta="Legale rappresentante">
                    <Campo nome="rap_nome" etichetta="Nome" obbligatorio />
                    <Campo nome="rap_cognome" etichetta="Cognome" obbligatorio />
                    <Campo nome="rap_codice_fiscale" etichetta="Codice fiscale" esempio="16 caratteri" obbligatorio larga />
                    <Campo nome="rap_data_nascita" etichetta="Data di nascita" tipo="date" />
                    <Campo nome="rap_luogo_nascita" etichetta="Luogo di nascita" />
                    <Campo
                      nome="rap_residenza_via"
                      etichetta="Indirizzo di residenza"
                      esempio="Es. Via Roma 1, 03100 Frosinone (FR)"
                      larga
                    />
                  </Blocco>
                </div>

                <div ref={el => { passiRef.current[2] = el; }} hidden={passo !== 2}>
                  <Blocco etichetta="Documenti">
                    <CampoFile
                      nome="visura"
                      etichetta="Visura camerale recente"
                      aiuto="PDF o foto leggibile, massimo 20 MB"
                      obbligatorio
                    />
                    <CampoFile
                      nome="polizza"
                      etichetta="Polizza catastrofale con quietanza"
                      aiuto="Deve riportare la quietanza di pagamento"
                      disabilitato={polizzaMancante}
                    />
                    <label
                      className="md:col-span-2 flex items-start gap-2 cursor-pointer"
                      style={{ fontSize: "14px", color: "var(--color-black)" }}
                    >
                      <input
                        type="checkbox"
                        checked={polizzaMancante}
                        onChange={(e) => setPolizzaMancante(e.target.checked)}
                        style={{ marginTop: "3px" }}
                      />
                      <span>
                        Non ho ancora la polizza catastrofale{" "}
                        <span style={{ color: GRIGIO_TESTO }}>
                          (ti aiutiamo noi: è obbligatoria per legge e senza la
                          domanda non parte)
                        </span>
                      </span>
                    </label>
                    <CampoFile nome="parita_genere" etichetta="Certificazione parità di genere (solo se posseduta)" />
                    <CampoFile nome="rating_legalita" etichetta="Rating di legalità (solo se posseduto)" />
                  </Blocco>
                </div>

                <div ref={el => { passiRef.current[3] = el; }} hidden={passo !== 3}>
                  <Blocco etichetta="Progetto">
                    <label className="md:col-span-2">
                      <span style={stileEtichetta}>Cosa vorresti digitalizzare?</span>
                      <textarea
                        name="note_esigenze"
                        placeholder="Due righe bastano."
                        rows={4}
                        className="outline-none resize-none transition-colors duration-200 focus:border-[var(--color-black)]"
                        style={stileCampo}
                      />
                    </label>
                    <label
                      className="md:col-span-2 flex items-start gap-2 cursor-pointer"
                      style={{ fontSize: "14px", color: "var(--color-black)" }}
                    >
                      <input type="checkbox" name="consenso" required style={{ marginTop: "3px" }} />
                      <span>
                        Autorizzo il trattamento dei dati e dei documenti
                        inviati per la preparazione della domanda di contributo,
                        come da{" "}
                        <a
                          href="/voucher-digitale/informativa"
                          className="underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          informativa privacy
                        </a>
                        . *
                      </span>
                    </label>
                  </Blocco>
                </div>

                {/* ── Navigazione fra i passi ── */}
                <div className="request-col flex items-stretch" style={{ gap: "10px" }}>
                  {passo > 0 && (
                    <button
                      type="button"
                      onClick={indietro}
                      className="font-medium tracking-wide uppercase transition-all duration-300"
                      style={{
                        borderRadius: "5px",
                        border: `2px solid ${BORDO_CAMPO}`,
                        padding: "12px 20px",
                        fontSize: "var(--font-btn)",
                        color: "var(--color-black)",
                        backgroundColor: "transparent",
                      }}
                    >
                      ← Indietro
                    </button>
                  )}
                  {passo < PASSI.length - 1 ? (
                    <button
                      type="button"
                      onClick={avanti}
                      className="font-medium tracking-wide uppercase transition-all duration-300 hover:bg-[var(--color-yellow)]"
                      style={{
                        borderRadius: "5px",
                        border: "2px solid var(--color-yellow)",
                        padding: "12px 20px",
                        fontSize: "var(--font-btn)",
                        color: "var(--color-black)",
                        backgroundColor: "transparent",
                      }}
                    >
                      Avanti →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="font-medium tracking-wide uppercase transition-all duration-300 hover:bg-[var(--color-yellow)]"
                      style={{
                        borderRadius: "5px",
                        border: "2px solid var(--color-yellow)",
                        padding: "12px 20px",
                        fontSize: "var(--font-btn)",
                        color: "var(--color-black)",
                        backgroundColor: "transparent",
                      }}
                    >
                      {status === "sending" ? "Invio in corso…" : "Invia la candidatura"}
                    </button>
                  )}
                </div>

                {/* ── Errori ── */}
                {status === "error" && (
                  <p
                    role="status"
                    className="request-col leading-relaxed"
                    style={{ color: "var(--color-red)" }}
                  >
                    {avviso ?? `Invio non riuscito. Scrivici direttamente a ${CONTACT_EMAIL}.`}
                  </p>
                )}
              </form>
            </div>
          </section>
        ) : (
          <section className="bg-white" style={{ paddingBottom: "120px" }}>
            <div className="container-content">
              <p
                role="status"
                className="text-h3 font-medium leading-relaxed"
                style={{ color: "var(--color-black)" }}
              >
                Ricevuto. Controlliamo i documenti e ti ricontattiamo noi entro
                un giorno lavorativo per i passi successivi.
              </p>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
