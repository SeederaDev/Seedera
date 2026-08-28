import type { Bando } from "./bandi";

/* Le stesse regole di `src/dominio/contributo.js` nel backend. Vivono anche
   qui perche' il cliente puo' togliere le voci opzionali dall'offerta e i
   conti devono aggiornarsi senza ricaricare la pagina. */

/** Sconto commerciale: si applica al totale delle voci scelte e non scende
 *  mai sotto zero, cosi' uno sconto in euro resta valido anche se il cliente
 *  toglie delle voci. */
export function scontoSu(
  totaleCent: number,
  tipo: "percento" | "importo" | null | undefined,
  valore: number | null | undefined,
): number {
  const v = Number(valore);
  if ((tipo !== "percento" && tipo !== "importo") || !Number.isFinite(v) || v <= 0) return 0;
  const grezzo = tipo === "percento"
    ? Math.round(totaleCent * (Math.min(v, 100) / 100))
    : Math.round(v);
  return Math.min(grezzo, totaleCent);
}

/** Il contributo camerale, coi parametri **di questo bando**: percentuale e
 *  tetto cambiano da camera a camera, e usare quelli di un'altra vorrebbe dire
 *  promettere al cliente una cifra che non ricevera'. Si calcola sempre sul
 *  netto: e' la spesa che l'impresa sostiene davvero, ed e' quella che si
 *  rendiconta. */
export function contributoSu(totaleCent: number, bando: Pick<Bando, "percentuale" | "tetto_cent">) {
  const contributo = Math.min(Math.round(totaleCent * bando.percentuale), bando.tetto_cent);
  return { contributo, aCarico: totaleCent - contributo };
}
