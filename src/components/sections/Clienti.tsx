import Image from "next/image";
import Link from "next/link";

interface Cliente {
  nome: string;
  file: string;
  /* I loghi non hanno la stessa forma: un marchio lungo e basso e uno stemma
     quasi quadrato, alla stessa altezza, pesano in modo diversissimo. La
     scala corregge a occhio, partendo da 1 = riquadro pieno. */
  scala?: number;
  /* Il marchio esiste solo in bianco (pensato per fondi scuri): si inverte. */
  inverti?: boolean;
  /* Colore troppo chiaro per il fondo bianco anche in grigio: nero pieno. */
  nero?: boolean;
}

/* Nell'ordine dato da Ercole il 02/10/2026. Fonti dei file: siti ufficiali o
   i repo dei progetti che abbiamo fatto noi. */
const CLIENTI: Cliente[] = [
  { nome: "Assoholding", file: "assoholding.svg" },
  { nome: "G2R", file: "g2r.svg", inverti: true, scala: 0.7 },
  { nome: "Aleph01", file: "aleph01.png", scala: 0.85 },
  { nome: "Il Trust in Italia", file: "il-trust-in-italia.png" },
  { nome: "Quinte Parallele", file: "quinte-parallele.svg", inverti: true, scala: 1.2 },
  { nome: "Alberto Napolitano Pianoforti", file: "alberto-napolitano-pianoforti.png", scala: 1.2 },
  { nome: "Piano City Napoli", file: "piano-city-napoli.png", scala: 1.25 },
  { nome: "Astralex", file: "astralex.png", inverti: true, scala: 0.95 },
  { nome: "Keyone Consulting", file: "keyone-consulting.png" },
  { nome: "Kyma", file: "kyma.svg", scala: 0.9 },
  { nome: "Evertreen", file: "evertreen.svg", inverti: true, scala: 0.95 },
  { nome: "Replase", file: "replase.png" },
  { nome: "Suoni Oltre Confine", file: "suoni-oltre-confine.png" },
  { nome: "Riding Safari Club", file: "riding-safari-club.svg", scala: 1.3 },
  { nome: "Red Group", file: "red-group.svg" },
  { nome: "Comune di Riardo", file: "comune-riardo.png", scala: 1.3 },
  { nome: "Comune di Roccamonfina", file: "comune-roccamonfina.png", scala: 1.3 },
  /* Aggiunti il 03/10/2026. */
  { nome: "Allianz Sant'Agostino", file: "allianz-sant-agostino.png", inverti: true, scala: 1.2 },
  { nome: "Future Champions Academy", file: "future-champions-academy.png" },
  { nome: "Qualitalia", file: "qualitalia.png", inverti: true, scala: 1.3 },
  { nome: "Moody Production", file: "moody-production.png", inverti: true, scala: 1.2 },
  { nome: "Riviera di Ulisse Festival", file: "festival-riviera-di-ulisse.png", nero: true, scala: 0.75 },
  { nome: "Vino Sapiens", file: "vino-sapiens.svg" },
  { nome: "Perle dell'Elba", file: "perle-dell-elba.png" },
  { nome: "DOC Marketing", file: "doc-marketing.png", inverti: true, scala: 1.3 },
  { nome: "Tecnotravel", file: "tecnotravel.png", inverti: true, scala: 0.9 },
  { nome: "Palmieri & Treglia", file: "palmieri-treglia.png" },
  { nome: "Orthomax", file: "orthomax.svg", inverti: true },
];

export default function Clienti() {
  return (
    <section
      id="clienti"
      className="relative z-10 bg-white text-black pt-8 md:pt-16 pb-24 md:pb-40"
      aria-label="Con chi abbiamo lavorato"
    >
      <div className="container-content">
        {/* Stessa griglia delle altre sezioni: badge a sinistra, titolo nella
            colonna a x=500 (46fr/90fr su 1360). */}
        <div className="flex flex-col md:grid md:grid-cols-[46fr_90fr] md:items-start">
          <div className="mb-6 md:mb-0">
            <span
              className="inline-flex items-center border border-black text-black"
              style={{ borderRadius: "5px", padding: "4px 10px", fontSize: "14px", lineHeight: "20px" }}
            >
              Clienti
            </span>
          </div>
          <h2 className="text-h2 font-normal leading-[1.125] text-black max-w-[22ch]">
            Imprese, istituzioni e progetti con cui abbiamo lavorato.
          </h2>
        </div>

        {/* Griglia a filo: 28 loghi e la casella per il prossimo, larga due
            celle, fanno 30 posti, che si chiudono pieni a 2, 3 e 6 colonne.
            Se cambia il numero dei loghi, va rifatto questo conto. Bordi sopra e a sinistra
            sul contenitore, a destra e sotto sulle caselle: nessuna linea
            doppia. */}
        <ul className="mt-12 md:mt-[99px] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border-t border-l border-black/15">
          {CLIENTI.map((c) => (
            <li
              key={c.nome}
              className="group relative aspect-[3/2] border-r border-b border-black/15 flex items-center justify-center"
            >
              <div
                className="relative h-[46%] w-[66%]"
                style={c.scala ? { transform: `scale(${c.scala})` } : undefined}
              >
                <Image
                  src={`/images/clienti/${c.file}`}
                  alt={c.nome}
                  fill
                  sizes="(min-width: 1024px) 15vw, (min-width: 640px) 30vw, 45vw"
                  /* File gia' ridotti a mano: la conversione di next/image sporcava
                     la trasparenza (velo grigio dietro Il Trust in Italia). */
                  unoptimized
                  /* A riposo tutti in scala di grigi, a colori al passaggio.
                     multiply fa sparire il fondo bianco degli stemmi che non
                     hanno trasparenza. */
                  className={`object-contain mix-blend-multiply opacity-70 transition-[filter,opacity] duration-300 ease-out group-hover:opacity-100 motion-reduce:transition-none ${
                    c.nero
                      ? "brightness-0"
                      : c.inverti
                        ? "invert grayscale"
                        : "grayscale group-hover:grayscale-0"
                  }`}
                />
              </div>
            </li>
          ))}
          <li className="col-span-2 aspect-[3/1] border-r border-b border-black/15">
            <Link
              href="/parliamo"
              className="group flex h-full w-full flex-col justify-between bg-primary p-4 md:p-5 text-black transition-colors duration-300 hover:bg-black hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-black"
            >
              <span className="text-[16px] leading-[22px]">Il prossimo progetto?</span>
              <svg
                width="35"
                height="33"
                viewBox="0 0 35 33"
                fill="none"
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-2 motion-reduce:transition-none"
              >
                <path
                  d="M1 16.5h32M21 4l12 12.5L21 29"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
