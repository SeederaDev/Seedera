import { notFound } from "next/navigation";
import { bandoPerSlug } from "@/lib/bandi";
import { bandiPubblici, preventivoAutomatico, documentiCliente } from "@/lib/contenuti";
import PercorsoVoucher from "@/components/voucher/PercorsoVoucher";

/* Una pagina per bando **pubblicabile**: l'elenco arriva dall'API. I bandi di
   cui non conosciamo i parametri economici non compaiono, e quindi non hanno
   pagina — meglio nessuna pagina che una con dei numeri inventati. */
export async function generateStaticParams() {
  return (await bandiPubblici()).map(b => ({ camera: b.slug }));
}

export default async function PaginaCamera({
  params,
}: {
  params: Promise<{ camera: string }>;
}) {
  const { camera } = await params;
  const bando = bandoPerSlug(await bandiPubblici(), camera);
  if (!bando) notFound();
  return (
    <PercorsoVoucher
      bando={bando}
      preventivoAutomatico={await preventivoAutomatico()}
      documenti={await documentiCliente()}
    />
  );
}
