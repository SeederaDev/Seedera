"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

gsap.registerPlugin(ScrollTrigger);

/* ── Data ──
   Solo ruolo, competenze e area: niente dati anagrafici, che restano nel
   gestionale e non hanno ragione di stare su una pagina pubblica. */
interface Member {
  name: string;
  initials: string;
  role: string;
  bio: string;
  focus: string[];
  color: string;
}

const MEMBERS: Member[] = [
  {
    name: "Ercole Sarno",
    initials: "ES",
    role: "Founder",
    bio: "Ha fondato Seedera e ne tiene insieme le due metà: la regia tecnica dei prodotti e la conduzione dei progetti. È la persona con cui si fa la diagnosi iniziale — e quella che resta quando il progetto entra in produzione. Amministratore unico di Zentro.",
    focus: ["Strategia", "Prodotto", "Project management"],
    color: "var(--color-yellow)",
  },
  {
    name: "Gabriele Simeone",
    initials: "GS",
    role: "Developer & Project Manager",
    bio: "Una delle figure tecniche centrali dello sviluppo: porta le piattaforme dei clienti dal codice alla messa in linea. Segue in prima persona i progetti che costruisce, perché chi ha scritto un sistema è anche chi sa spiegarlo a chi dovrà usarlo.",
    focus: ["Sviluppo software", "Web", "Project management"],
    color: "var(--color-cyan)",
  },
  {
    name: "Biagio Cipolletta",
    initials: "BC",
    role: "Lead AI Engineer & Full-stack Developer",
    bio: "Progetta e costruisce la parte intelligente dei sistemi: agenti AI, automazioni, integrazioni. Viene dal marketing e dalla costruzione di funnel, e si vede: le automazioni che scrive hanno un obiettivo commerciale, non solo tecnico.",
    focus: ["AI e automazione", "Full-stack", "Architetture dati"],
    color: "var(--color-green)",
  },
  {
    name: "Alessandro Musto",
    initials: "AM",
    role: "Project Manager",
    bio: "Oltre vent'anni su progetti complessi, innovazione tecnologica e trasformazione digitale, con produzioni ed eventi nazionali e internazionali alle spalle. Entra dove i progetti si complicano: pianificazione, coordinamento dei team, controllo dei budget.",
    focus: ["Project management", "Trasformazione digitale", "Produzione"],
    color: "var(--color-pink)",
  },
  {
    name: "Giancarmelo Pittalà",
    initials: "GP",
    role: "Project Manager",
    bio: "Segue i progetti in cui il committente ha bisogno di un interlocutore unico, dalla web app fino al lancio. Collabora con Seedera tenendo il filo tra chi commissiona e chi sviluppa.",
    focus: ["Project management", "Delivery", "Relazione cliente"],
    color: "var(--color-red)",
  },
];

const DEPARTMENTS = [
  {
    name: "Project Management",
    description:
      "Pianifica, coordina e porta a consegna i progetti, definendo i KPI prima di iniziare.",
  },
  {
    name: "Sviluppo Software & Web",
    description:
      "Il motore di delivery: software su misura, piattaforme, app e siti, per i clienti e per i prodotti interni.",
  },
  {
    name: "Marketing, Contenuti & ADV",
    description:
      "Comunicazione, campagne, contenuti e advertising — per i clienti e per i prodotti che costruiamo per noi.",
  },
  {
    name: "Vertical Culturale",
    description:
      "I progetti culturali — festival, editoria, direzione artistica — sotto il marchio Seedera Lab.",
  },
  {
    name: "Amministrazione",
    description:
      "Ciclo attivo e passivo, adempimenti, scadenzario. La parte che non si vede e che tiene in piedi il resto.",
  },
];

/* ── Rolling text: stessa meccanica delle card portfolio, innescata
      dall'hover dell'intera card (vedi .member-card in globals.css) ── */
function RollingText({ text }: { text: string }) {
  const letters = text.split("");

  return (
    <span className="rolling-text-wrap font-medium">
      <span className="rolling-text-row" aria-hidden="true">
        {letters.map((char, i) => (
          <span
            key={i}
            className="rolling-text-char"
            style={{ transitionDelay: `${i * 15}ms` }}
          >
            {char === " " ? " " : char}
          </span>
        ))}
      </span>
      <span className="rolling-text-row">
        {letters.map((char, i) => (
          <span
            key={i}
            className="rolling-text-char"
            style={{ transitionDelay: `${i * 15}ms` }}
          >
            {char === " " ? " " : char}
          </span>
        ))}
      </span>
    </span>
  );
}

export default function TeamPage() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".member-card");
      gsap.from(cards, {
        y: 48,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".member-grid",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      const rows = gsap.utils.toArray<HTMLElement>(".dept-row");
      rows.forEach((row) => {
        gsap.from(row, {
          y: 24,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: row,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <>
      <Navbar />
      <main ref={sectionRef}>
        {/* ── Hero ── */}
        <section
          className="relative w-full flex items-end"
          style={{
            height: "350px",
            backgroundColor: "var(--color-yellow)",
            paddingTop: "80px",
          }}
        >
          <div className="container-content pb-10">
            <h1 className="text-h1 text-black font-normal uppercase select-none">
              Team
            </h1>
          </div>
        </section>

        {/* ── Intro ── */}
        <section className="bg-white" style={{ paddingTop: "90px" }}>
          <div className="container-content">
            <div className="flex flex-col gap-8 md:flex-row md:gap-16">
              <h2
                className="text-black font-normal uppercase leading-[1.05] md:w-[46%] shrink-0"
                style={{ fontSize: "var(--font-h3)" }}
              >
                Poche persone, dentro i progetti.
              </h2>
              <div className="flex flex-col gap-5 max-w-[62ch]">
                <p className="text-black/70 text-lg leading-relaxed">
                  Non abbiamo un organigramma che guarda i progetti da fuori.
                  Chi fa la diagnosi è la stessa persona che poi risponde
                  quando qualcosa non funziona, e chi scrive il codice è chi te
                  lo spiega. È il motivo per cui restiamo pochi: la promessa di
                  un interlocutore unico si mantiene solo se le mani che
                  costruiscono e la testa che decide non sono in due stanze
                  diverse.
                </p>
                <p className="text-black/50 leading-relaxed border-l-2 border-black/20 pl-5">
                  Attorno al nucleo lavora una rete di specialisti che entra
                  quando il progetto lo richiede — senza mai spostare il punto
                  di contatto con il cliente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Members ── */}
        <section className="bg-white" style={{ paddingTop: "70px" }}>
          <div className="container-content">
            <div className="member-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {MEMBERS.map((member) => (
                <article
                  key={member.name}
                  className="member-card group flex flex-col rounded-[10px] border border-black/10 overflow-hidden cursor-default"
                >
                  {/* Ritratto tipografico: in assenza di foto, le iniziali
                      fanno da segno riconoscibile e restano coerenti. */}
                  <div
                    className="relative overflow-hidden"
                    style={{
                      aspectRatio: "4 / 3",
                      backgroundColor: member.color,
                    }}
                  >
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 scale-[1.15] group-hover:scale-100 transition-transform duration-700 ease-out will-change-transform"
                      style={{
                        background:
                          "radial-gradient(120% 90% at 100% 0%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 60%)",
                      }}
                    />
                    <span
                      className="absolute inset-0 flex items-center justify-center font-medium text-black/70 group-hover:text-black transition-colors duration-500 select-none"
                      style={{ fontSize: "clamp(3.5rem, 7vw, 5.5rem)" }}
                    >
                      {member.initials}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="flex flex-col gap-3 p-6 md:p-7 flex-1">
                    <h3
                      className="text-black uppercase leading-none"
                      style={{ fontSize: "var(--font-h5)" }}
                    >
                      <RollingText text={member.name} />
                    </h3>

                    <p
                      className="font-medium"
                      style={{ color: "var(--color-middle-grey)" }}
                    >
                      {member.role}
                    </p>

                    <p className="text-black/70 leading-relaxed text-sm">
                      {member.bio}
                    </p>

                    <ul className="mt-auto pt-4 flex flex-wrap gap-2">
                      {member.focus.map((item) => (
                        <li
                          key={item}
                          className="rounded-[5px] border border-black/25 px-3 py-1 uppercase tracking-wide text-black/70"
                          style={{ fontSize: "var(--font-btn)" }}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Departments ── */}
        <section className="bg-white pt-24 md:pt-32 pb-24 md:pb-40">
          <div className="container-content flex flex-col gap-10 md:gap-14">
            <div className="flex flex-col gap-5 max-w-[70ch]">
              <span
                className="uppercase tracking-[0.2em]"
                style={{
                  fontSize: "var(--font-p)",
                  color: "var(--color-middle-grey)",
                }}
              >
                {"// Come siamo organizzati"}
              </span>
              <h2
                className="text-black font-normal uppercase leading-none"
                style={{ fontSize: "var(--font-h3)" }}
              >
                Cinque funzioni continue, non reparti a compartimenti.
              </h2>
              <p className="text-black/70 leading-relaxed">
                Le persone attraversano più funzioni nello stesso progetto: è
                esattamente ciò che permette a tech, second brain e AI di essere
                progettati insieme invece che passati di mano.
              </p>
            </div>

            <ol className="flex flex-col">
              {DEPARTMENTS.map((dept, i) => (
                <li
                  key={dept.name}
                  className="dept-row border-t border-black/15 py-6 md:py-8 last:border-b"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:gap-12">
                    <span
                      className="text-black/30 font-medium leading-none shrink-0 md:w-[80px]"
                      style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}
                    >
                      0{i + 1}
                    </span>
                    <h3
                      className="text-black font-medium uppercase leading-none shrink-0 md:w-[300px]"
                      style={{ fontSize: "var(--font-h5)" }}
                    >
                      {dept.name}
                    </h3>
                    <p className="max-w-[65ch] text-black/70 leading-relaxed">
                      {dept.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <Link
              href="/parliamo"
              className="self-start rounded-[5px] border border-black px-5 py-2.5 text-black font-medium hover:bg-black hover:text-white transition-all duration-300"
            >
              Apri una conversazione →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
