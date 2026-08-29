import type { Metadata } from "next";
import { bandiPubblici } from "@/lib/contenuti";

/* Pagina pilastro: raccoglie e linka le pagine delle singole camere. Il numero
   nel testo si aggiorna da solo col censimento, cosi' la descrizione non
   diventa una promessa vecchia. */
export async function generateMetadata(): Promise<Metadata> {
  /* Il numero si legge, non si scrive: una descrizione che dice "39 bandi"
     mentre ne sono pubblicati due e' una promessa che il sito non mantiene. */
  const quante = (await bandiPubblici()).length;
  return {
  /* Il template va ridichiarato qui: un titolo dichiarato come stringa in un
     layout intermedio non lo propaga ai figli, e le pagine delle camere
     uscivano senza il suffisso del sito che tutte le altre hanno. */
    title: {
      default: "Voucher digitali 2026 delle Camere di Commercio",
      template: "%s | Seedera",
    },
    description:
      `Contributi a fondo perduto per la digitalizzazione delle PMI: ${quante} bandi camerali `
      + "seguiti, con date, percentuali e tetti aggiornati. Prepariamo e presentiamo la domanda per te.",
    alternates: { canonical: "/voucher-digitale" },
    openGraph: {
      title: "Voucher digitali 2026 delle Camere di Commercio | Seedera",
      description:
        "Contributi a fondo perduto per la digitalizzazione delle PMI. Trova il bando della tua camera "
        + "e candidati: prepariamo e presentiamo la domanda per te.",
        url: "/voucher-digitale",
        type: "website",
      },
  };
}

export default function VoucherDigitaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
