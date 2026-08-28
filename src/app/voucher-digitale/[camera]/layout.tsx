import type { Metadata } from "next";
import { bandoPerSlug, euroTondo, percento, dataIt } from "@/lib/bandi";

/* Ogni camera ha titolo, descrizione e canonical propri, costruiti sui suoi
   numeri: sono l'unica cosa che distingue in SERP 39 pagine con la stessa
   impalcatura, ed e' anche quello che l'annuncio promette. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ camera: string }>;
}): Promise<Metadata> {
  const { camera } = await params;
  const b = bandoPerSlug(camera);
  if (!b) return {};

  /* Corto di proposito: il titolo deve reggere nella SERP (~60 caratteri col
     suffisso del sito) e agganciare la query, che e' "voucher digitale" piu' il
     nome della camera. La cifra, che e' il gancio, sta nella descrizione, dove
     c'e' spazio. */
  const titolo = `Voucher digitale 2026 — ${b.camera}`;
  /* Il nome della camera apre la frase: messo dopo una preposizione produce
     "delle imprese di CCIAA Frosinone-Latina", che non e' italiano, e i nomi
     camerali hanno forme troppo diverse per indovinare l'articolo giusto. */
  /* Sotto i 160 caratteri, o Google la tronca: prima la camera e la cifra,
     poi la scadenza. Le province stanno nella pagina e nelle FAQ, qui
     ruberebbero lo spazio a cio' che fa cliccare. */
  const descrizione =
    `${b.camera}: contributo a fondo perduto del ${percento(b.percentuale)} `
    + `fino a ${euroTondo(b.tetto_cent)} per digitalizzare la tua impresa`
    + (b.chiusura ? `, domande entro il ${dataIt(b.chiusura)}` : "")
    + ". Prepariamo e presentiamo la domanda per te.";
  const url = `/voucher-digitale/${b.slug}`;

  return {
    title: titolo,
    description: descrizione,
    alternates: { canonical: url },
    openGraph: { title: titolo, description: descrizione, url, type: "website" },
  };
}

export default function LayoutCamera({ children }: { children: React.ReactNode }) {
  return children;
}
