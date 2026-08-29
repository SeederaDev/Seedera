import { bandiPubblici } from "@/lib/contenuti";
import IndiceVoucher from "@/components/voucher/IndiceVoucher";

/* Il server legge, il client interagisce: il selettore di provincia e il
   riconoscimento del token `?o=` vivono nel browser, l'elenco no — se lo
   caricasse il browser la pagina arriverebbe vuota ai motori di ricerca, e
   questa e' la pagina pilastro che linka tutte le altre. */
export default async function PaginaIndice() {
  return <IndiceVoucher bandi={await bandiPubblici()} />;
}
