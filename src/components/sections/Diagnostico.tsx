"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Nel design e' una chat, non un terminale: bolle nere a sinistra per il
   cliente, gialle a destra per Seedera, dentro una finestra in stile macOS. */
interface Bolla {
  from: "cliente" | "seedera";
  text: string;
  larghezza: string;
}

/* `larghezza` e' la misura del rettangolo nel Figma, in percentuale dei 339px
   utili della finestra (397,74 meno 29,34 di padding per lato). Non e' un
   dettaglio estetico: senza, ogni bolla si allarga fino al massimo consentito,
   il testo va a capo dove capita e l'intera colonna cambia altezza. */
const CHAT: Bolla[] = [
  { from: "cliente", text: "Voglio essere primo su questa parola chiave su Google.", larghezza: "76.1%" },
  { from: "seedera", text: "Perché vuoi più visibilità su quella parola?", larghezza: "62.6%" },
  { from: "cliente", text: "Perché voglio più traffico. Più lead. Più clienti", larghezza: "66.1%" },
  /* La virgola manca nel Figma ma senza si legge come una frase sola e il
     senso si ribalta. Le bolle restano senza punto finale: e' una chat. */
  { from: "seedera", text: "Il tuo obiettivo non è il traffico, è la conversione", larghezza: "62.6%" },
  {
    from: "seedera",
    text: "Quella keyword porta volume ad alta dispersione. Una strategia diversa porta il triplo dei lead a un quinto del costo",
    larghezza: "95.9%",
  },
  { from: "seedera", text: "Lavoriamo su quello?", larghezza: "58.1%" },
];

const INTRO =
  "Prima di proporre qualsiasi cosa facciamo emergere il bisogno che sta sotto la richiesta. Di solito la conversazione va più o meno così.";

export default function Diagnostico() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      /* Reveal del testo grigio → nero, lo stesso pattern di AboutUs. */
      const chars = gsap.utils.toArray<HTMLElement>(".diag-char");
      if (chars.length) {
        ScrollTrigger.create({
          trigger: ".diag-intro",
          start: "top 80%",
          end: "top 25%",
          scrub: 0.5,
          onUpdate: (self) => {
            chars.forEach((c, i) => {
              c.style.color =
                self.progress > i / chars.length
                  ? "var(--color-black)"
                  : "var(--color-grey)";
            });
          },
        });
      }

      const bolle = gsap.utils.toArray<HTMLElement>(".diag-bolla");
      gsap.from(bolle, {
        y: 16,
        opacity: 0,
        duration: 0.45,
        stagger: 0.16,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".diag-chat",
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="diagnostico"
      className="relative bg-white z-10 py-24 md:py-40"
      aria-label="Il Diagnostico Seedera"
    >
      {/* L'id sul contenuto (non sulla section) serve al confronto visivo:
          il padding verticale della sezione non esiste nel ritaglio del
          design e falserebbe il diff. Si confronta cio' che il design mostra. */}
      <div id="diagnostico-inner" className="container-content">
        {/*
         * Layout preso a misura dal Figma (artboard 1440):
         *   badge      x = 40
         *   testo      x = 500  →  la colonna di contenuto parte da qui
         *   chat       x = 500  →  allineata al testo, NON a tutta larghezza
         *   takeaway   x = 958  →  seconda meta' della stessa colonna
         * Percio' chat e takeaway vivono DENTRO la colonna del testo, non in
         * una riga a se' stante che partirebbe dal bordo pagina.
         */}
        {/* Griglia a misura: colonna badge 33.6%, colonna contenuto 64.7%.
            Con container-content (padding 48) questo mette il badge a x=48 e
            il contenuto da x=500 a x=1370, come nel Figma. Un semplice
            "spacer 25% + flex-1" arriverebbe a 474 e sfonderebbe a destra,
            cambiando le andate a capo del titolo. */}
        <div id="diag-block" className="flex flex-col md:grid md:grid-cols-[46fr_90fr] md:items-start">
          <div className="mb-6 md:mb-0">
            <span
              className="inline-flex items-center border border-black text-black"
              style={{ borderRadius: "5px", padding: "5px 10px", fontSize: "14px", lineHeight: "20px" }}
            >
              Diagnosi
            </span>
          </div>

          <div className="diag-intro">
            {/* Design (nodo 463:237): Regular 48px / 54px. Era font-medium con
                leading 1.2 e mr-[0.3em] fra le parole: piu' bold, piu' alto e
                piu' largo del design. Lo spazio torna a essere uno spazio. */}
            <h2 className="text-h2 font-normal leading-[54px]">
              {INTRO.split(" ").map((word, wi) => (
                <span key={wi}>
                  {wi > 0 ? " " : null}
                  <span className="inline-block">
                  {word.split("").map((char, ci) => (
                    <span
                      key={ci}
                      className="diag-char inline-block transition-colors duration-300 ease-out"
                      style={{ color: "var(--color-grey)" }}
                    >
                      {char}
                    </span>
                  ))}
                  </span>
                </span>
              ))}
            </h2>

            {/* ── Chat + takeaway, dentro la colonna del testo ──
                 Proporzioni dal Figma: chat 44%, gap 7%, takeaway 49%.
                 Il takeaway e' allineato in basso, non in alto. */}
            {/* Nel design la chat parte 335,8px sotto l'inizio del blocco e
                l'intro ne occupa 270: restano 66 di stacco, non 56. */}
            <div className="mt-10 md:mt-[66px] flex flex-col lg:flex-row lg:items-end gap-10 lg:gap-[7%]">
              {/* Finestra chat: 397,74 su 900 = 44,19%. In percentuale e non in
                  pixel, cosi' cresce col container su schermi piu' larghi. */}
              <div className="diag-chat w-full lg:w-[44.19%] shrink-0 rounded-[5px] overflow-hidden bg-[#F2F2F2]">
            {/* Barra finestra */}
            {/* Barra: h 34.5, #E2E2E2. I pallini usano i colori del brand
                (rosso, giallo, verde di Seedera), non quelli di macOS. */}
            <div className="flex items-center h-[34.5px] px-[9px] bg-[#E2E2E2]">
              <span aria-hidden="true" className="flex gap-[9.6px]">
                <span className="inline-block w-[12.35px] h-[12.35px] rounded-full bg-[#DB3A30]" />
                <span className="inline-block w-[12.35px] h-[12.35px] rounded-full bg-[#CDFD51]" />
                <span className="inline-block w-[12.35px] h-[12.35px] rounded-full bg-[#62CB95]" />
              </span>
            </div>

            {/* Bolle */}
            {/* Misure dai nodi: prima bolla a x 529,34 dentro una finestra che
                inizia a 500 → 29 di padding, non 11; stacco fra le bolle 20,
                non 10; 40 sopra la prima bolla e 31 sotto il campo di invio. */}
            <div className="flex flex-col gap-[20px] px-[29px] pt-[40px] pb-[31px]">
              {CHAT.map((b, i) => {
                const mine = b.from === "seedera";
                return (
                  <div
                    key={i}
                    className={`diag-bolla flex ${mine ? "justify-end" : "justify-start"}`}
                  >
                    {/* Nel Figma la bolla piu' larga occupa ~65% della
                        finestra, non l'85%: le righe vanno a capo presto. */}
                    {/* Coda della bolla: l'angolo verso il proprio lato resta
                        squadrato, gli altri tre a 10px — come nel design. */}
                    <p
                      /* py 9, non 12: nel design una bolla di due righe e' alta
                         62,87 (44 di testo + 18,8 di padding). La larghezza e'
                         quella del rettangolo nel Figma, bolla per bolla. */
                      style={{ width: b.larghezza }}
                      className={`px-[14px] py-[9px] text-[16px] leading-[22px] ${
                        mine
                          ? "bg-primary text-black text-right rounded-[10px] rounded-tr-none"
                          : "bg-black text-white rounded-[10px] rounded-tl-none"
                      }`}
                    >
                      {b.text}
                    </p>
                  </div>
                );
              })}

              {/* Campo di invio: decorativo, la conversazione vera si apre
                  da /parliamo. Non e' un form, quindi niente input. */}
              {/* 40 di stacco dall'ultima bolla: 20 li da' gia' il gap. */}
              <div
                className="mt-[20px] flex items-center gap-3"
                aria-hidden="true"
              >
                <div className="flex-1 h-[40.4px] rounded-[50px] bg-white" />
                <span className="w-[40.4px] h-[40.4px] rounded-[50px] bg-primary flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>

              {/* Takeaway: 440 su 900 della colonna. Nel design (nodo 463:240)
                  titolo e corpo sono 16px/22 — Bold il primo, Regular il
                  secondo — nero pieno e senza stacco fra loro: erano 13px con
                  un gap di 16, per questo il blocco non tornava. */}
              <div className="flex flex-col w-full lg:w-[48.89%]">
                <h3 className="text-black font-bold text-[16px] leading-[22px]">
                  Cosa cambia con questo approccio?
                </h3>
                <p className="text-black text-[16px] leading-[22px]">
                  Un partner customer centric avrebbe ottimizzato quella parola
                  chiave. Il cliente non avrebbe ottenuto quello di cui aveva
                  davvero bisogno: più clienti, non più traffico. Portare più
                  traffico avrebbe risposto alla domanda secondo la sua
                  richiesta ma non avrebbe avuto più clienti come risultato.
                  Seedera non porta a termine progetti che non risolvono il
                  problema reale.
                </p>
                <svg
              width="35"
              height="33"
              viewBox="0 0 35 33"
              fill="none"
              aria-hidden="true"
                  /* 22 di stacco dal testo, come nel design (nodo 468:6). */
                  className="text-black mt-[22px]"
                >
                  <path
                    d="M1 16.5h32M21 4l12 12.5L21 29"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
