import PaginaPortfolio from "@/components/portfolio/PaginaPortfolio";
import { progetti } from "@/lib/contenuti";

/* Il portfolio si legge sul server: i progetti finiscono nell'HTML, quindi
   sono indicizzabili, e il filtro per categoria resta un fatto del browser. */
export default async function PortfolioPage() {
  return <PaginaPortfolio progetti={await progetti()} />;
}
