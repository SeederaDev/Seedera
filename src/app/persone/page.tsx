import { persone } from "@/lib/contenuti";
import PaginaPersone from "@/components/persone/PaginaPersone";

/* Il server legge, il client anima: le schede hanno GSAP e uno stato aperto,
   ma l'elenco no — se lo caricasse il browser la pagina arriverebbe vuota ai
   motori, e le biografie sono il contenuto della pagina. */
export default async function Persone() {
  return <PaginaPersone persone={await persone()} />;
}
