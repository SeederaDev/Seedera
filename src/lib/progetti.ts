/**
 * Regole di pagina sui progetti: pure, quindi verificabili senza montare nulla.
 * I dati arrivano da `contenuti.ts`; qui si decide solo come si guardano.
 */

/** Un media del progetto e' un video quando lo dice l'estensione. La scheda
 *  monta un <video> o una <img>, e sbagliare vuol dire un riquadro nero. */
export function isVideo(src: string): boolean {
  return /\.(mp4|webm|mov)$/i.test(src);
}

/** Le categorie del filtro nascono dai progetti pubblicati, in ordine di
 *  apparizione: nessun elenco fisso da tenere allineato a mano. */
export function categorie(progetti: { categoria: string }[]): string[] {
  return ["Tutti", ...Array.from(new Set(progetti.map((p) => p.categoria).filter(Boolean)))];
}

/** La griglia a gradini e' fatta di colonne, non di righe: ogni colonna parte
 *  piu' in basso della precedente. I progetti si distribuiscono in ordine di
 *  lettura (1, 2, 3 sulla prima fila, poi di nuovo dalla prima colonna), cosi'
 *  l'ordine scelto nel pannello resta quello che si legge. */
export function inColonne<T>(elementi: T[], colonne: number): T[][] {
  const out: T[][] = Array.from({ length: colonne }, () => []);
  elementi.forEach((e, i) => out[i % colonne].push(e));
  return out;
}
