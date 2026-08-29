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
