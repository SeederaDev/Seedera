/**
 * Dove sta ogni persona nella scacchiera della pagina /persone.
 *
 * Ogni foto ha accanto una casella vuota, ed e' li' che si apre la bio: cosi'
 * la foto resta visibile mentre si legge. Su 4 colonne le persone sono due per
 * riga e le righe si alternano (foto · vuoto · foto · vuoto, poi vuoto · foto ·
 * vuoto · foto); su 2 colonne una per riga, alternando il lato.
 *
 * La posizione viene dall'ordine, non da campi del pannello: per spostare una
 * persona si cambia l'ordine, e non si puo' finire con due foto nella stessa
 * casella.
 */
export type Colonne = 2 | 4;

export interface Posizione {
  riga: number;
  colonna: number;
  /** La colonna, nella stessa riga, dove si apre la bio. */
  bio: number;
  /** Da che parte della foto si apre, e quindi da dove entra il pannello. */
  lato: "destra" | "sinistra";
}

export function posizione(indice: number, colonne: Colonne): Posizione {
  const perRiga = colonne / 2;
  const riga = Math.floor(indice / perRiga);
  const spostata = riga % 2; // le righe dispari partono dalla seconda colonna
  const colonna = (indice % perRiga) * 2 + 1 + spostata;
  const lato = colonna < colonne ? "destra" : "sinistra";
  return { riga: riga + 1, colonna, bio: lato === "destra" ? colonna + 1 : colonna - 1, lato };
}
