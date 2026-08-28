import { euroTondo, percento, dataIt, type Bando } from "@/lib/bandi";
import { Etichetta, GRIGIO_TESTO, colonna } from "./campi";

/* Le domande sono costruite dai dati **di questo bando**: e' cio' che rende la
   pagina di una camera diversa da quella di un'altra invece di un modello con
   il nome cambiato. Servono anche a Google, come FAQPage. */
export function domande(bando: Bando) {
  const d: { q: string; a: string }[] = [
    {
      q: "Quanto posso ottenere?",
      a: `Il contributo copre il ${percento(bando.percentuale)} della spesa ammissibile, `
        + `fino a un massimo di ${euroTondo(bando.tetto_cent)} a fondo perduto. `
        + `L'investimento minimo per essere ammessi è di ${euroTondo(bando.spesa_minima_cent)}.`,
    },
    {
      q: "Quali spese sono ammesse?",
      a: `${bando.voci_ammissibili.join("; ")}. Le voci del preventivo devono ricadere in queste categorie.`,
    },
    {
      q: "Chi può partecipare?",
      /* Il nome della camera dopo una preposizione produce frasi sgrammaticate
         (le sigle camerali non reggono "di"), e le forme sono troppo diverse per
         indovinare l'articolo: si mette il nome davanti, e la preposizione
         sparisce. */
      a: `${bando.camera}. Le micro, piccole e medie imprese in regola con l'iscrizione `
        + `e il diritto annuale, con sede o unità locale nel suo territorio`
        + `${bando.province ? ` (province: ${bando.province})` : ""}.`,
    },
    {
      q: "Presentate voi la domanda?",
      a: "Prepariamo tutta la documentazione e la presentiamo per tuo conto. L'unico passaggio "
        + "che resta a te è la firma digitale del legale rappresentante sui moduli: senza quella "
        + "la domanda non può partire. La preparazione e la presentazione sono incluse.",
    },
    {
      q: "Quanto costa il servizio?",
      a: "La valutazione e il preventivo sono gratuiti e senza impegno. Paghi solo i servizi "
        + "che scegli, e solo se decidi di procedere: preparazione e presentazione della domanda "
        + "non si pagano a parte.",
    },
  ];

  if (bando.apertura || bando.chiusura) {
    d.splice(1, 0, {
      q: "Entro quando si presenta la domanda?",
      a: [
        bando.apertura ? `Lo sportello apre il ${dataIt(bando.apertura)}.` : null,
        bando.chiusura
          ? `Le domande si chiudono il ${dataIt(bando.chiusura)}.`
          : "Lo sportello resta aperto fino a esaurimento dei fondi.",
        "Le domande valgono in ordine cronologico di arrivo, quindi conta arrivare preparati.",
      ].filter(Boolean).join(" "),
    });
  }
  return d;
}

export default function FAQ({ bando }: { bando: Bando }) {
  const elenco = domande(bando);
  const datiStrutturati = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: elenco.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <section className="bg-white">
      <div className="container-content" style={{ paddingBottom: "clamp(48px, 7vw, 88px)" }}>
        <div style={colonna}>
          <div style={{ marginBottom: "20px" }}>
            <Etichetta>Domande frequenti</Etichetta>
          </div>
          <dl className="flex flex-col" style={{ gap: "20px" }}>
            {elenco.map(({ q, a }) => (
              <div key={q}>
                <dt className="font-medium" style={{ color: "var(--color-black)", fontSize: "17px" }}>
                  {q}
                </dt>
                <dd className="leading-relaxed" style={{ color: GRIGIO_TESTO, marginTop: "4px" }}>
                  {a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datiStrutturati) }}
      />
    </section>
  );
}
