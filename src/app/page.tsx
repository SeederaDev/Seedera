import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Principi from "@/components/sections/Principi";
import Diagnostico from "@/components/sections/Diagnostico";
import Services from "@/components/sections/Services";
import Clienti from "@/components/sections/Clienti";
import SistemaOperativo from "@/components/sections/SistemaOperativo";
import Marquee from "@/components/sections/Marquee";
import Projects from "@/components/sections/Projects";
import StartupStudio from "@/components/sections/StartupStudio";
import Contatti from "@/components/sections/Contatti";
import Partnership from "@/components/sections/Partnership";
import Footer from "@/components/Footer";
import { progetti } from "@/lib/contenuti";

export default async function Home() {
  const elenco = await progetti();
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        {/* Le tre frasi a scorrimento (AboutUs) sono nascoste dal 02/10/2026:
            il componente resta, torna qui quando si decide cosa farne. I
            servizi salgono subito sotto la hero, e sotto di loro i clienti. */}
        <Services />
        <Clienti />
        <Principi />
        <Diagnostico />
        <SistemaOperativo />
        <Marquee />
        <Projects progetti={elenco} />
        <StartupStudio />
        <Contatti />
        <Partnership />
      </main>
      <Footer />
    </>
  );
}
