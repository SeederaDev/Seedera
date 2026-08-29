import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import AboutUs from "@/components/sections/AboutUs";
import Principi from "@/components/sections/Principi";
import Diagnostico from "@/components/sections/Diagnostico";
import Services from "@/components/sections/Services";
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
        <AboutUs />
        <Principi />
        <Diagnostico />
        <Services />
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
