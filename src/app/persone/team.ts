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

export const TEAM: Persona[] = [
  {
    slug: "ercole-sarno",
    nome: "Ercole Sarno",
    ruolo: "Founder",
    bio: "Fondatore di Seedera. Tiene insieme la diagnosi iniziale e la regia tecnica dei prodotti: è la persona che decide se un progetto entra, e quella che risponde di come esce.",
    colonna: 1,
    riga: 1,
  },
  {
    slug: "andrea-simeone",
    nome: "Andrea Simeone",
    ruolo: "Socio",
    bio: "Socio di Altera SRLs, la società dietro Seedera.",
    colonna: 2,
    riga: 1,
  },
  {
    slug: "biagio-cipolletta",
    nome: "Biagio Cipolletta",
    ruolo: "AI & Full-stack Engineer",
    bio: "Lavora sull'integrazione degli agenti AI e sullo sviluppo dei prodotti, dal modello dei dati fino all'interfaccia.",
    colonna: 3,
    riga: 1,
  },
  {
    slug: "giancarmelo-pittala",
    nome: "Giancarmelo Pittalà",
    ruolo: "Sviluppatore",
    bio: "Ha scritto da solo circa due terzi del preventivatore AI di Tecnotravel, il repository più grande passato dallo studio.",
    colonna: 2,
    riga: 2,
  },
  {
    slug: "alessandro-musto",
    nome: "Alessandro Musto",
    ruolo: "Project Manager",
    bio: "Oltre vent'anni su progetti complessi, tra innovazione tecnologica e trasformazione digitale.",
    colonna: 1,
    riga: 3,
  },
  {
    slug: "pasquale-tucciarone",
    nome: "Pasquale Tucciarone",
    ruolo: "Socio",
    bio: "Socio di Altera SRLs, la società dietro Seedera.",
    colonna: 3,
    riga: 3,
  },
  {
    slug: "salvatore-sannino",
    nome: "Salvatore Sannino",
    ruolo: "Consulente",
    bio: "Consulente di Seedera.",
    colonna: 2,
    riga: 4,
  },
];
