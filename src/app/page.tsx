import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Ledger from "@/components/sections/Ledger";
import AboutUs from "@/components/sections/AboutUs";
import Marquee from "@/components/sections/Marquee";
import Diagnostico from "@/components/sections/Diagnostico";
import Services from "@/components/sections/Services";
import SistemaOperativo from "@/components/sections/SistemaOperativo";
import Projects from "@/components/sections/Projects";
import ProjectsMarquee from "@/components/sections/ProjectsMarquee";
import ProjectsOutro from "@/components/sections/ProjectsOutro";
import StartupStudio from "@/components/sections/StartupStudio";
import Partnership from "@/components/sections/Partnership";
import TargetPhysics from "@/components/sections/TargetPhysics";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Ledger />
        <AboutUs />
        <Marquee />
        <Diagnostico />
        <Services />
        <SistemaOperativo />
        <Projects />
        <ProjectsMarquee />
        <ProjectsOutro />
        <StartupStudio />
        <Partnership />
        <TargetPhysics />
      </main>
      <Footer />
    </>
  );
}
