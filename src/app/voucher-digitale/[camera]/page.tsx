import { notFound } from "next/navigation";
import { BANDI, bandoPerSlug } from "@/lib/bandi";
import PercorsoVoucher from "@/components/voucher/PercorsoVoucher";

/* Una pagina per bando **pubblicabile**: l'elenco arriva da src/dati/bandi.json,
   scaricato a build-time con `npm run bandi`. I bandi di cui non conosciamo i
   parametri economici non compaiono qui, e quindi non hanno pagina. */
export function generateStaticParams() {
  return BANDI.map(b => ({ camera: b.slug }));
}

export default async function PaginaCamera({
  params,
}: {
  params: Promise<{ camera: string }>;
}) {
  const { camera } = await params;
  const bando = bandoPerSlug(camera);
  if (!bando) notFound();
  return <PercorsoVoucher bando={bando} />;
}
