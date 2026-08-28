import { euroTondo, percento, dataIt, statoBando, type Bando } from "@/lib/bandi";
import { Etichetta, GRIGIO_TESTO, colonna } from "./campi";

/* Chi arriva qui non sa cosa comporta compilare: il modulo non e' la domanda,
   e' l'inizio della pratica. Il seguito — chi prepara, chi firma, chi invia —
   va detto prima, non dopo. */
function passi(bando: Bando, oggi: string) {
  const { stato } = statoBando(bando, oggi);
  const invio = stato === "in_apertura" && bando.apertura
    ? `Il ${dataIt(bando.apertura)} inviamo`
    : "Inviamo la domanda";
  const testoInvio = stato === "in_apertura" && bando.apertura
    ? `Appena lo sportello apre, il ${dataIt(bando.apertura)}, la domanda parte: con la pratica già pronta e firmata.`
    : bando.chiusura
      ? `La domanda parte appena la pratica è pronta, e comunque entro il ${dataIt(bando.chiusura)}.`
      : "La domanda parte appena la pratica è pronta e firmata.";

  return [
    {
      titolo: "Compili il modulo qui sotto",
      testo:
        "Ti chiediamo solo quello che non possiamo ricavare da soli: i dati dell'impresa, quelli di chi la rappresenta e i documenti che il bando richiede. Il resto lo ricostruiamo noi dalla visura.",
    },
    {
      titolo: "Prepariamo la documentazione",
      testo:
        "Mettiamo insieme la pratica e scriviamo il progetto nella forma che il bando chiede. Se manca qualcosa te lo chiediamo noi, un pezzo per volta.",
    },
    {
      titolo: "Firmi digitalmente, carichiamo i moduli",
      testo:
        "Quando la documentazione è pronta ti contattiamo noi: i moduli vanno firmati con la firma digitale del legale rappresentante, ed è l'unico passaggio che non possiamo fare al posto tuo. Fino ad allora non devi fare altro.",
    },
    { titolo: invio, testo: testoInvio },
  ];
}

export default function ComeFunziona({ bando, oggi }: { bando: Bando; oggi: string }) {
  const { stato } = statoBando(bando, oggi);

  return (
    <section className="bg-white">
      <div
        className="container-content"
        style={{ paddingTop: "clamp(48px, 7vw, 88px)", paddingBottom: "0" }}
      >
        <div style={colonna}>
          <div style={{ marginBottom: "20px" }}>
            <Etichetta>Di cosa parliamo</Etichetta>
          </div>

          {/* Corpo normale, non un titolo: qui si spiega il bando, e la pagina
              e' un modulo da compilare, non un manifesto. */}
          <p className="leading-relaxed" style={{ color: "var(--color-black)" }}>
            {bando.camera} finanzia la digitalizzazione con un contributo a fondo
            perduto fino a <strong>{euroTondo(bando.tetto_cent)}</strong>, pari al{" "}
            <strong>{percento(bando.percentuale)}</strong> della spesa.
            L&rsquo;investimento minimo ammesso è di {euroTondo(bando.spesa_minima_cent)}.
          </p>

          {bando.testo_pubblico && (
            <p className="leading-relaxed" style={{ color: "var(--color-black)", marginTop: "12px" }}>
              {bando.testo_pubblico}
            </p>
          )}

          {stato === "in_apertura" && bando.apertura && (
            <p className="leading-relaxed" style={{ color: "var(--color-black)", marginTop: "12px" }}>
              Lo sportello apre il {dataIt(bando.apertura)} e le domande valgono in
              ordine di arrivo: vince il dito piu&rsquo; veloce.
            </p>
          )}

          <p className="leading-relaxed" style={{ color: GRIGIO_TESTO, marginTop: "12px", fontSize: "14px" }}>
            Spese ammissibili: {bando.voci_ammissibili.join(" · ")}.
            {bando.link && (
              <>
                {" "}
                <a href={bando.link} className="underline" target="_blank" rel="noreferrer">
                  Il bando ufficiale
                </a>
                .
              </>
            )}
          </p>

          <div style={{ marginTop: "48px", marginBottom: "24px" }}>
            <Etichetta>Come funziona</Etichetta>
          </div>
          <ol className="flex flex-col" style={{ gap: "24px", listStyle: "none" }}>
            {passi(bando, oggi).map((p, i) => (
              <li key={p.titolo} className="flex" style={{ gap: "12px" }}>
                <span
                  aria-hidden="true"
                  className="shrink-0 font-medium"
                  style={{ color: "var(--color-black)", fontSize: "18px" }}
                >
                  {i + 1}.
                </span>
                <span className="block">
                  <span
                    className="block font-medium"
                    style={{ color: "var(--color-black)", fontSize: "18px" }}
                  >
                    {p.titolo}
                  </span>
                  <span
                    className="block leading-relaxed"
                    style={{ color: GRIGIO_TESTO, marginTop: "6px" }}
                  >
                    {p.testo}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
