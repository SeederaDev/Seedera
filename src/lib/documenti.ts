import type { DocumentoRichiesto } from "./contenuti";

/**
 * Quali documenti chiedere a chi sta compilando.
 *
 * Comandano quelli dell'offerta: chi l'ha preparata ha guardato il progetto di
 * quella impresa e ha abilitato cio' che serve — il report sostenibilita' a chi
 * fa interventi green, il programma del corso a chi fa formazione. Un elenco
 * uguale per tutti manda la persona a cercare carte che non la riguardano, e
 * finisce che le salta tutte.
 *
 * Il ripiego e' l'elenco di base (i documenti che valgono per ogni impresa):
 * vale per le offerte salvate prima che i documenti viaggiassero con loro, e
 * per quando l'offerta non si carica. Meglio chiedere i tre di sempre che
 * mostrare un modulo vuoto.
 */
export function documentiDaChiedere(
  dallOfferta: DocumentoRichiesto[] | undefined,
  base: DocumentoRichiesto[],
): DocumentoRichiesto[] {
  return dallOfferta && dallOfferta.length > 0 ? dallOfferta : base;
}
