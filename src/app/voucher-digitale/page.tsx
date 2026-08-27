"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* Endpoint del backend proprietario (repo seedera-backend). Con
   output: 'export' non esistono API route: senza la variabile il modulo
   avvisa e rimanda alla mail. */
const VOUCHER_ENDPOINT = process.env.NEXT_PUBLIC_VOUCHER_ENDPOINT ?? "";
const CONTACT_EMAIL = "info@seedera.it";

const MAX_FILE = 20 * 1024 * 1024;

/* Il bando ammette solo PDF e scansioni. */
const ACCEPT = "application/pdf,image/jpeg,image/png";

const etichettaPill = {
  borderRadius: "5px",
  padding: "5px 10px",
  fontSize: "14px",
  lineHeight: "20px",
} as const;

const stileCampo = {
  padding: "16px 20px",
  fontSize: "var(--font-h4)",
  borderColor: "var(--color-light-grey)",
  color: "var(--color-black)",
} as const;

function Campo({
  nome,
  placeholder,
  tipo = "text",
  obbligatorio = false,
}: {
  nome: string;
  placeholder: string;
  tipo?: string;
  obbligatorio?: boolean;
}) {
  return (
    <input
      type={tipo}
      name={nome}
      placeholder={obbligatorio ? `${placeholder} *` : placeholder}
      required={obbligatorio}
      className="w-full border-b bg-transparent outline-none transition-colors duration-300 focus:border-[var(--color-yellow)]"
      style={stileCampo}
    />
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
      <div className="request-col flex flex-col" style={{ gap: "4px" }}>
        {children}
      </div>
    </div>
  );
}

function CampoFile({
  nome,
  etichetta,
  obbligatorio = false,
  disabilitato = false,
}: {
  nome: string;
  etichetta: string;
  obbligatorio?: boolean;
  disabilitato?: boolean;
}) {
  return (
    <label
      className="w-full border-b bg-transparent transition-colors duration-300 cursor-pointer"
      style={{ ...stileCampo, opacity: disabilitato ? 0.4 : 1 }}
    >
      <span className="block mb-1">
        {etichetta}
        {obbligatorio ? " *" : ""}
      </span>
      <input
        type="file"
        name={nome}
        accept={ACCEPT}
        required={obbligatorio && !disabilitato}
        disabled={disabilitato}
        className="block w-full text-sm"
      />
    </label>
  );
}

export default function VoucherDigitalePage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [avviso, setAvviso] = useState<string | null>(null);
  const [polizzaMancante, setPolizzaMancante] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    setAvviso(null);

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
      form.reset();
      setPolizzaMancante(false);
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
            height: "350px",
            backgroundColor: "var(--color-yellow)",
            paddingTop: "80px",
          }}
        >
          <div className="container-content pb-10">
            <h1 className="text-h1 text-black font-normal uppercase select-none">
              Voucher digitale 2026
            </h1>
          </div>
        </section>

        {/* ── Intro ── */}
        <section className="bg-white">
          <div
            className="container-content"
            style={{ paddingTop: "60px", paddingBottom: "60px" }}
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
                  className="text-h2 font-medium leading-[1.2]"
                  style={{ color: "var(--color-black)" }}
                >
                  La Camera di Commercio Frosinone–Latina finanzia la
                  digitalizzazione con un contributo a fondo perduto fino a
                  10.000&nbsp;€ (70% della spesa). Compila i dati e carica i
                  documenti: la domanda la prepariamo e la presentiamo noi.
                </h2>
                <p
                  className="leading-relaxed"
                  style={{ color: "var(--color-grey)", marginTop: "20px" }}
                >
                  Le domande partono il 25 settembre 2026 e valgono in ordine di
                  arrivo: prima riceviamo i documenti, prima sei in fila.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Form ── */}
        <section className="bg-white" style={{ paddingBottom: "120px" }}>
          <div className="container-content">
            <form
              onSubmit={handleSubmit}
              className="request-form flex flex-col"
              style={{ gap: "80px" }}
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

              <Blocco etichetta="Impresa">
                <Campo nome="ragione_sociale" placeholder="Ragione sociale" obbligatorio />
                <Campo nome="piva" placeholder="Partita IVA" obbligatorio />
                <Campo nome="referente" placeholder="Nome e cognome del referente" obbligatorio />
                <Campo nome="email" placeholder="E-mail" tipo="email" obbligatorio />
                <Campo nome="telefono" placeholder="Telefono" tipo="tel" />
                <Campo nome="pec" placeholder="PEC aziendale" tipo="email" />
              </Blocco>

              <Blocco etichetta="Legale rappresentante">
                <Campo nome="rap_nome" placeholder="Nome" obbligatorio />
                <Campo nome="rap_cognome" placeholder="Cognome" obbligatorio />
                <Campo nome="rap_codice_fiscale" placeholder="Codice fiscale" obbligatorio />
                <Campo nome="rap_data_nascita" placeholder="Data di nascita" tipo="date" />
                <Campo nome="rap_luogo_nascita" placeholder="Luogo di nascita" />
                <Campo nome="rap_residenza_via" placeholder="Residenza: via e numero" />
                <Campo nome="rap_residenza_comune" placeholder="Residenza: comune" />
                <Campo nome="rap_residenza_cap" placeholder="Residenza: CAP" />
                <Campo nome="rap_residenza_provincia" placeholder="Residenza: provincia" />
              </Blocco>

              <Blocco etichetta="Documenti">
                <CampoFile nome="visura" etichetta="Visura camerale recente" obbligatorio />
                <CampoFile
                  nome="polizza"
                  etichetta="Polizza catastrofale con quietanza"
                  disabilitato={polizzaMancante}
                />
                <label
                  className="flex items-center gap-3"
                  style={{ padding: "8px 20px", color: "var(--color-grey)" }}
                >
                  <input
                    type="checkbox"
                    checked={polizzaMancante}
                    onChange={(e) => setPolizzaMancante(e.target.checked)}
                  />
                  Non ho ancora la polizza catastrofale (ti aiutiamo noi: è
                  obbligatoria per legge e senza la domanda non parte)
                </label>
                <CampoFile nome="parita_genere" etichetta="Certificazione parità di genere (se posseduta)" />
                <CampoFile nome="rating_legalita" etichetta="Rating di legalità (se posseduto)" />
              </Blocco>

              <Blocco etichetta="Progetto">
                <textarea
                  name="note_esigenze"
                  placeholder="Cosa vorresti digitalizzare? Due righe bastano."
                  rows={4}
                  className="w-full border-b bg-transparent outline-none resize-none transition-colors duration-300 focus:border-[var(--color-yellow)]"
                  style={stileCampo}
                />
                <label
                  className="flex items-start gap-3"
                  style={{ padding: "16px 20px", color: "var(--color-black)" }}
                >
                  <input type="checkbox" name="consenso" required style={{ marginTop: "5px" }} />
                  <span>
                    Autorizzo il trattamento dei dati e dei documenti inviati
                    per la preparazione della domanda di contributo, come da{" "}
                    <a
                      href="/privacy-policy"
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

              {/* ── Submit ── */}
              <div className="request-col flex items-stretch" style={{ gap: "10px" }}>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="submit-btn font-medium tracking-wide uppercase transition-all duration-300 hover:bg-[var(--color-yellow)]"
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
              </div>

              {/* ── Esito ── */}
              {status !== "idle" && status !== "sending" && (
                <p
                  role="status"
                  className="request-col leading-relaxed"
                  style={{
                    color:
                      status === "error"
                        ? "var(--color-red)"
                        : "var(--color-black)",
                  }}
                >
                  {status === "sent"
                    ? "Ricevuto. Controlliamo i documenti e ti ricontattiamo noi entro un giorno lavorativo."
                    : avviso ??
                      `Invio non riuscito. Scrivici direttamente a ${CONTACT_EMAIL}.`}
                </p>
              )}
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
