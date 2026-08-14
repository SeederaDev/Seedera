/* Le persone di Seedera, nell'ordine in cui compaiono sulla pagina.
   Il design (Figma, frame "Chi siamo" 286:579) non e' una griglia piena:
   le schede stanno su tre colonne con alcune celle vuote, e la scacchiera
   che ne esce e' voluta. Riga e colonna sono quindi un dato della persona,
   non un calcolo — cosi' si sposta una scheda senza toccare il layout. */

export interface Persona {
  slug: string;
  nome: string;
  ruolo: string;
  bio: string;
  /* Le foto non sono ancora state fornite: nel Figma sei schede su sette
     sono riquadri grigi #D9D9D9. Appena arrivano si riempie questo campo
     e la scheda passa da sola dal placeholder alla foto. */
  foto?: string;
  /** colonna 1-3 della griglia desktop */
  colonna: 1 | 2 | 3;
  /** riga della griglia desktop */
  riga: number;
}

/* L'ordine dell'array e' l'ordine di lettura, ed e' anche quello che si vede
   su mobile (li' la griglia e' a una colonna sola). Le celle della scacchiera
   restano quelle del design: 1-2-3 sulla prima riga, poi 2, poi 1 e 3, poi 2. */
export const TEAM: Persona[] = [
  {
    slug: "ercole-sarno",
    nome: "Ercole Sarno",
    ruolo: "Founder",
    bio: "Fondatore di Seedera e amministratore unico di Zentro, la prima società uscita dallo startup studio. Dieci anni fra sviluppo web e direzione di sistemi digitali, dalla libera professione alla guida di un reparto informatico; come IT & Brand Manager di Assoholding tiene i programmi di formazione su blockchain e intelligenza artificiale per le aziende della rete. Qui tiene insieme la diagnosi iniziale e la regia tecnica dei prodotti: decide se un progetto entra, e risponde di come esce.",
    colonna: 1,
    riga: 1,
  },
  {
    slug: "andrea-simeone",
    nome: "Andrea Simeone",
    ruolo: "Socio",
    bio: "Socio della società dalla costituzione, nel 2022. Lavora sul lato creativo delle campagne: script per i video e creatività per l'advertising.",
    colonna: 2,
    riga: 1,
  },
  {
    slug: "filippo-simonelli",
    nome: "Filippo Simonelli",
    ruolo: "Progetti culturali",
    bio: "Fondatore di Quinte Parallele e autore per Treccani di «Con brio. Prima lezione di musica classica». Scrive di cultura per l'Osservatore Romano e la Repubblica Roma, di Nord America ed energia per Il Caffè Geopolitico. Qui è il riferimento dei progetti culturali, da Suoni Oltre Confine a InnovaMusica.",
    colonna: 3,
    riga: 1,
  },
  {
    slug: "alessandro-musto",
    nome: "Alessandro Musto",
    ruolo: "Project Manager",
    bio: "COO di Zentro e project manager dello studio. Oltre vent'anni su progetti complessi, tra innovazione tecnologica e produzione di spettacoli: è sua la regia di «Peppa Pig Live! La gita in spiaggia», portato nei teatri italiani da Firenze a Milano.",
    colonna: 2,
    riga: 2,
  },
  {
    slug: "pasquale-tucciarone",
    nome: "Pasquale Tucciarone",
    ruolo: "Socio",
    bio: "Tra i soci fondatori della società, dalla costituzione nel 2022.",
    colonna: 1,
    riga: 3,
  },
  {
    slug: "biagio-cipolletta",
    nome: "Biagio Cipolletta",
    ruolo: "AI & Full-stack Engineer",
    bio: "CTO di Zentro e lead AI engineer dello studio. Viene dal marketing e dai funnel di acquisizione, oggi progetta l'architettura dei prodotti e l'integrazione degli agenti AI, dal modello dei dati fino all'interfaccia.",
    colonna: 3,
    riga: 3,
  },
  {
    slug: "giancarmelo-pittala",
    nome: "Giancarmelo Pittalà",
    ruolo: "Sviluppatore",
    bio: "Full-stack dal 2017, su Vue, Nuxt, Node e TypeScript. Ha scritto da solo circa due terzi del preventivatore AI di Tecnotravel, il repository più grande passato dallo studio: contabilità, fatturazione elettronica e contratti con firma digitale, costruiti da zero.",
    colonna: 2,
    riga: 4,
  },
];
