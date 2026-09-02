"use client";

import { useRef, useState } from "react";
import type { Bando } from "@/lib/bandi";
import type { Offerta } from "@/lib/api";
import { VOUCHER_ENDPOINT, CONTACT_EMAIL } from "@/lib/api";
import type { DocumentoRichiesto } from "@/lib/contenuti";
import {
  Blocco, Campo, CampoFile, Fisarmonica, BORDO_CAMPO, GRIGIO_TESTO, MAX_FILE,
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
  /* Le sezioni aperte. Si va avanti nell'ordine, ma non sono chiuse a chiave:
     chi vuole rileggere l'impresa mentre carica i documenti apre quella e basta,
     senza tornare indietro e riavanzare. */
  const [aperte, setAperte] = useState<number[]>([0]);
  /* Le sezioni da cui si e' gia' passati con "Avanti": servono solo a scrivere
     "compilata" accanto al titolo quando sono chiuse. */
  const [viste, setViste] = useState<number[]>([]);
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
    apri(indice);
    setAvviso(`Manca ancora qualcosa in “${etichettaDi(campo)}”: ${campo.validationMessage}`);
    requestAnimationFrame(() => {
      campo.focus();
      campo.reportValidity();
    });
  };

  /* Il pulsante in fondo a una sezione: controlla quella sezione, la chiude e
     apre la prossima. Sta dentro la sezione e non in fondo al modulo perche'
     con piu' sezioni aperte "avanti" da solo non direbbe avanti da dove. */
  const Prosegui = ({ indice }: { indice: number }) => (
    <div style={{ marginTop: "24px" }}>
      <button
        type="button"
        onClick={() => avanti(indice)}
        className="font-medium tracking-wide uppercase transition-all duration-300 hover:bg-[var(--color-yellow)]"
        style={stilePulsante}
      >
        Avanti →
      </button>
    </div>
  );

  const apri = (indice: number) =>
    setAperte(a => (a.includes(indice) ? a : [...a, indice]));
  const commuta = (indice: number) =>
    setAperte(a => (a.includes(indice) ? a.filter(i => i !== indice) : [...a, indice]));

  const passoValido = (indice: number) => {
    const campo = campoDaSistemare(indice);
    if (!campo) return true;
    segnalaCampo(indice, campo);
    return false;
  };

  const avanti = (indice: number) => {
    if (!passoValido(indice)) return;
    setAvviso(null);
    cambioPasso.current = Date.now();
    const prossima = Math.min(indice + 1, PASSI.length - 1);
    setPasso(prossima);
    setViste(v => (v.includes(indice) ? v : [...v, indice]));
    /* La sezione finita si chiude e si apre la successiva: e' il "uno dopo
       l'altro". Restano aperte quelle che la persona ha aperto per conto suo. */
    setAperte(a => [...a.filter(i => i !== indice), prossima]);
  };

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
        <form onSubmit={handleSubmit} noValidate className="flex flex-col" style={{ ...colonna, gap: "12px" }}>
          {/* Honeypot: gli umani non lo vedono, i bot lo compilano. */}
          <input
            type="text" name="sito_web" tabIndex={-1} autoComplete="off" aria-hidden="true"
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
          />

          {/* Le sezioni restano montate (hidden) cosi' input e file non si perdono. */}
          <Fisarmonica
            titolo={PASSI[0]}
            aperta={aperte.includes(0)}
            completata={viste.includes(0)}
            onCommuta={() => commuta(0)}
            riferimento={el => { passiRef.current[0] = el; }}
          >
            <Blocco>
              <Campo nome="ragione_sociale" etichetta="Ragione sociale" obbligatorio />
              <Campo nome="piva" etichetta="Partita IVA" esempio="11 cifre" obbligatorio />
              <Campo nome="referente" etichetta="Referente (nome e cognome)" obbligatorio />
              <Campo nome="email" etichetta="E-mail" tipo="email" obbligatorio />
              <Campo nome="telefono" etichetta="Telefono" tipo="tel" />
              <Campo nome="pec" etichetta="PEC aziendale" tipo="email" />
            </Blocco>
            <Prosegui indice={0} />
          </Fisarmonica>

          <Fisarmonica
            titolo={PASSI[1]}
            aperta={aperte.includes(1)}
            completata={viste.includes(1)}
            onCommuta={() => commuta(1)}
            riferimento={el => { passiRef.current[1] = el; }}
          >
            <Blocco>
              <Campo nome="rap_nome" etichetta="Nome" obbligatorio />
              <Campo nome="rap_cognome" etichetta="Cognome" obbligatorio />
              <Campo nome="rap_codice_fiscale" etichetta="Codice fiscale" esempio="16 caratteri" obbligatorio larga />
              <Campo nome="rap_data_nascita" etichetta="Data di nascita" tipo="date" />
              <Campo nome="rap_luogo_nascita" etichetta="Luogo di nascita" />
              <Campo nome="rap_residenza_via" etichetta="Indirizzo di residenza" esempio="Es. Via Roma 1, 00100 Roma (RM)" larga />
            </Blocco>
            <Prosegui indice={1} />
          </Fisarmonica>

          <Fisarmonica
            titolo={PASSI[2]}
            aperta={aperte.includes(2)}
            completata={viste.includes(2)}
            onCommuta={() => commuta(2)}
            riferimento={el => { passiRef.current[2] = el; }}
          >
            {/* La visura la chiediamo noi, non il bando: da li' ricostruiamo i
                dati dell'impresa senza farglieli riscrivere. Tutto il resto lo
                dice il bando, e arriva dall'API: un elenco scritto a mano qui
                si scollerebbe dalla checklist, ed e' successo — il Report
                SELFI4.0, obbligatorio, non veniva chiesto a nessuno. */}
            <Blocco>
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
                  {/* Fuori dal riquadro di caricamento di proposito: dentro sta
                      in una label, e un click sul link aprirebbe il selettore
                      dei file invece del sito dove il documento si compila. */}
                  {doc.link && (
                    <a
                      href={doc.link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                      style={{ fontSize: "14px", color: "var(--color-black)" }}
                    >
                      {doc.link.testo} ↗
                    </a>
                  )}
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
            <Prosegui indice={2} />
          </Fisarmonica>

          <Fisarmonica
            titolo={PASSI[3]}
            aperta={aperte.includes(3)}
            completata={viste.includes(3)}
            onCommuta={() => commuta(3)}
            riferimento={el => { passiRef.current[3] = el; }}
          >
            <Blocco>
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
            {/* L'ultima sezione non manda "avanti": manda la candidatura. */}
            <div style={{ marginTop: "24px" }}>
              <button
                type="submit"
                disabled={status === "sending"}
                className="font-medium tracking-wide uppercase transition-all duration-300 hover:bg-[var(--color-yellow)]"
                style={stilePulsante}
              >
                {status === "sending" ? "Invio in corso\u2026" : "Invia la candidatura"}
              </button>
            </div>
          </Fisarmonica>

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
