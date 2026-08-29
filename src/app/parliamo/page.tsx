import PaginaParliamo from "@/components/parliamo/PaginaParliamo";
import { progetti } from "@/lib/contenuti";

export default async function ParliamoPage() {
  return <PaginaParliamo progetti={await progetti()} />;
}
