"use client";

import { useRef, useState } from "react";
import type { Bando } from "@/lib/bandi";
import type { Offerta } from "@/lib/api";
import { VOUCHER_ENDPOINT, CONTACT_EMAIL } from "@/lib/api";
import type { DocumentoRichiesto } from "@/lib/contenuti";
import {
  Blocco, Campo, CampoFile, BORDO_CAMPO, GRIGIO_TESTO, MAX_FILE,
  colonna, stileCampo, stileEtichetta, stilePulsante,
} from "./campi";

const PASSI = ["Impresa", "Legale rappresentante", "Documenti", "Progetto e invio"];

export default function ModuloOnboarding({
  bando,
  offerta,
  tokenOfferta,
  scelte,
  inviato,
  documenti = [],
}: {
  bando: Bando;
  documenti?: DocumentoRichiesto[];
  offerta: Offerta | null;
  tokenOfferta: string;
  scelte: boolean[];
  inviato: (tokenPratica: string | null) => void;
}) {
  const [passo, setPasso] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [avviso, setAvviso] = useState<string | null>(null);
  /* Quali documenti il cliente dichiara di non avere ancora. Prima era il solo
     `polizzaMancante`: ora l'elenco lo decide il bando, e la dichiarazione vale
     per ognuno degli obbligatori — il Report SELFI4.0 quasi nessuno ce l'ha
     gia', e bloccarlo sulla soglia vorrebbe dire perdere la candidatura. */
  const [mancanti, setMancanti] = useState<Record<string, boolean>>({});
  const passiRef = useRef<Array<HTMLDivElement | null>>([]);
  /* "Avanti" e "Invia la candidatura" stanno nello stesso punto: arrivando
     all'ultimo passo il pulsante cambia mestiere sotto il dito, e un secondo
     click involontario spedirebbe la candidatura. Per mezzo secondo l'invio
     non si prende. */
  const cambioPasso = useRef(0);

  /* Primo campo non compilato bene di un passo, o null se il passo e' a posto. */
  const campoDaSistemare = (indice: number) => {
    const contenitore = passiRef.current[indice];
    if (!contenitore) return null;
    const campi = contenitore.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea");
    for (const campo of campi) {
      if (!campo.checkValidity()) return campo;
    }
    return null;
  };

  /* L'etichetta che la persona vede, per dire *quale* campo manca invece di un
     generico "compila i campi". */
  const etichettaDi = (campo: HTMLInputElement | HTMLTextAreaElement) =>
    campo.closest("label")?.querySelector("span")?.textContent?.replace(" *", "").trim()
    ?? campo.getAttribute("aria-label")
    ?? "un campo";

  /* Il segnale nativo del browser (reportValidity) non compare se il campo e'
     ancora dentro un passo nascosto: si fa vedere il passo, e solo dopo il
     render si punta il campo. Senza questo, premendo Invia non succedeva
     niente di visibile. */
  const segnalaCampo = (indice: number, campo: HTMLInputElement | HTMLTextAreaElement) => {
    setPasso(indice);
    setAvviso(`Manca ancora qualcosa in “${etichettaDi(campo)}”: ${campo.validationMessage}`);
    requestAnimationFrame(() => {
      campo.focus();
      campo.reportValidity();
    });
  };

  const passoValido = (indice: number) => {
    const campo = campoDaSistemare(indice);
    if (!campo) return true;
    segnalaCampo(indice, campo);
    return false;
  };

  const avanti = () => {
    if (!passoValido(passo)) return;
    setAvviso(null);
    cambioPasso.current = Date.now();
    setPasso(p => Math.min(p + 1, PASSI.length - 1));
  };
  const indietro = () => setPasso(p => Math.max(p - 1, 0));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    if (Date.now() - cambioPasso.current < 500) return; // click di rimbalzo
    setAvviso(null);

    // Si controlla dal primo passo: chi ha saltato qualcosa torna li', col
    // campo puntato, invece di leggere un errore generico in fondo.
    for (let i = 0; i < PASSI.length; i++) {
      if (!passoValido(i)) return;
    }

    if (!VOUCHER_ENDPOINT) {
      setStatus("error");
      setAvviso(`Il modulo non è ancora attivo: scrivici a ${CONTACT_EMAIL} e ti mandiamo tutto noi.`);
      return;
    }

    const form = e.currentTarget;
    const dati = new FormData(form);
    dati.set("consenso", dati.get("consenso") === "on" ? "true" : "false");
    for (const doc of documenti) {
      if (doc.si_dichiara_mancante) {
        dati.set(`${doc.campo}_mancante`, mancanti[doc.campo] ? "true" : "false");
      }
    }
    dati.set("bando", bando.slug);
    if (tokenOfferta) dati.set("offerta", tokenOfferta);
    if (offerta) {
      const tenute = offerta.righe.map((_, i) => i).filter(i => scelte[i]);
      dati.set("offerta_selezione", JSON.stringify(tenute));
    }

    for (const [campo, valore] of dati.entries()) {
      if (valore instanceof File && valore.size > MAX_FILE) {
        setStatus("error");
        setAvviso(`Il file di "${campo}" supera i 20 MB: comprimilo o scansiona a risoluzione più bassa.`);
        return;
      }
    }

    setStatus("sending");
    try {
      const res = await fetch(VOUCHER_ENDPOINT, { method: "POST", body: dati });
      if (!res.ok) {
        const corpo = await res.json().catch(() => null);
        // Solo il messaggio scritto dal nostro backend e' in italiano e dice
        // qualcosa di utile: si marca per non confonderlo con gli errori
        // tecnici del browser ("Failed to fetch"), che non si mostrano.
        throw new Error(corpo?.errore ? `NOSTRO:${corpo.errore}` : `HTTP ${res.status}`);
      }
      const corpo = await res.json().catch(() => null);
      setStatus("idle");
      setAvviso(null);
      // Il token della pratica torna dall'invio: e' il link con cui il cliente
      // seguira' la domanda, e il momento in cui glielo si da' e' questo.
      inviato(corpo?.token_stato ?? null);
    } catch (err) {
      setStatus("error");
      const nostro = err instanceof Error && err.message.startsWith("NOSTRO:")
        ? err.message.slice("NOSTRO:".length)
        : null;
      setAvviso(
        nostro ??
          `Invio non riuscito: controlla la connessione e riprova. Se insiste, scrivici a ${CONTACT_EMAIL} e ti seguiamo noi.`,
      );
    }
  };

  return (
    <section
      className="bg-white"
      style={{ paddingTop: "clamp(44px, 6vw, 72px)", paddingBottom: "clamp(80px, 10vw, 128px)" }}
    >
      <div className="container-content">
        {/* Indicatore dei passi */}
        <ol className="flex flex-wrap" style={{ ...colonna, gap: "8px", marginBottom: "36px" }}>
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
              {/* Senza numero: sopra "Come funziona" ne ha gia' una da 1 a 4, e
                  due sequenze numerate diverse nella stessa pagina si leggono
                  come la stessa cosa. */}
              {nome}
            </li>
          ))}
        </ol>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col" style={{ gap: "40px" }}>
          {/* Honeypot: gli umani non lo vedono, i bot lo compilano. */}
          <input
            type="text" name="sito_web" tabIndex={-1} autoComplete="off" aria-hidden="true"
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
          />

          {/* I passi restano montati (hidden) cosi' input e file non si perdono. */}
          <div ref={el => { passiRef.current[0] = el; }} hidden={passo !== 0}>
            <Blocco etichetta="Impresa">
              <Campo nome="ragione_sociale" etichetta="Ragione sociale" obbligatorio />
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
              <Campo nome="rap_residenza_via" etichetta="Indirizzo di residenza" esempio="Es. Via Roma 1, 00100 Roma (RM)" larga />
            </Blocco>
          </div>

          <div ref={el => { passiRef.current[2] = el; }} hidden={passo !== 2}>
            {/* La visura la chiediamo noi, non il bando: da li' ricostruiamo i
                dati dell'impresa senza farglieli riscrivere. Tutto il resto lo
                dice il bando, e arriva dall'API: un elenco scritto a mano qui
                si scollerebbe dalla checklist, ed e' successo — il Report
                SELFI4.0, obbligatorio, non veniva chiesto a nessuno. */}
            <Blocco etichetta="Documenti">
              <CampoFile nome="visura" etichetta="Visura camerale recente" aiuto="PDF o foto leggibile, massimo 20 MB" obbligatorio />
              {documenti.map(doc => (
                <div key={doc.campo} className="md:col-span-2 flex flex-col" style={{ gap: "8px" }}>
                  <CampoFile
                    nome={doc.campo}
                    /* L'etichetta dice gia' da sola quando il documento serve:
                       attaccarci anche la condizione della checklist la
                       ripeteva due volte, con parole diverse. */
                    etichetta={doc.etichetta}
                    aiuto={doc.aiuto ?? undefined}
                    disabilitato={mancanti[doc.campo] === true}
                  />
                  {doc.si_dichiara_mancante && (
                    <label
                      className="flex items-start gap-2 cursor-pointer"
                      style={{ fontSize: "14px", color: "var(--color-black)" }}
                    >
                      <input
                        type="checkbox"
                        checked={mancanti[doc.campo] === true}
                        onChange={e => setMancanti(m => ({ ...m, [doc.campo]: e.target.checked }))}
                        style={{ marginTop: "3px" }}
                      />
                      <span>
                        Non ce l&rsquo;ho ancora{" "}
                        <span style={{ color: GRIGIO_TESTO }}>
                          (ti aiutiamo noi: senza, la domanda non parte)
                        </span>
                      </span>
                    </label>
                  )}
                </div>
              ))}
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
                  Autorizzo il trattamento dei dati e dei documenti inviati per la
                  preparazione della domanda di contributo, come da{" "}
                  <a href="/voucher-digitale/informativa" className="underline" target="_blank" rel="noreferrer">
                    informativa privacy
                  </a>
                  . *
                </span>
              </label>
            </Blocco>
          </div>

          {/* ── Navigazione fra i passi ── */}
          <div className="flex items-stretch" style={{ ...colonna, gap: "10px" }}>
            {passo > 0 && (
              <button
                type="button"
                onClick={indietro}
                className="font-medium tracking-wide uppercase transition-all duration-300"
                style={{ ...stilePulsante, border: `2px solid ${BORDO_CAMPO}` }}
              >
                ← Indietro
              </button>
            )}
            {passo < PASSI.length - 1 ? (
              <button
                type="button"
                onClick={avanti}
                className="font-medium tracking-wide uppercase transition-all duration-300 hover:bg-[var(--color-yellow)]"
                style={stilePulsante}
              >
                Avanti →
              </button>
            ) : (
              <button
                type="submit"
                disabled={status === "sending"}
                className="font-medium tracking-wide uppercase transition-all duration-300 hover:bg-[var(--color-yellow)]"
                style={stilePulsante}
              >
                {status === "sending" ? "Invio in corso…" : "Invia la candidatura"}
              </button>
            )}
          </div>

          {/* ── Avvisi: campo da sistemare, oppure invio non riuscito ── */}
          {(status === "error" || avviso) && (
            <p role="status" className="leading-relaxed" style={{ ...colonna, color: "var(--color-red)" }}>
              {avviso ?? `Invio non riuscito. Scrivici direttamente a ${CONTACT_EMAIL}.`}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
