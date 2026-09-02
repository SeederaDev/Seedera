import { describe, it, expect } from "vitest";
import { documentiDaChiedere } from "./documenti";

const base = [
  { campo: "polizza", etichetta: "Polizza", aiuto: null, link: null, obbligatorio: true, condizione: null, si_dichiara_mancante: true },
];
const conExtra = [
  ...base,
  { campo: "sustainability", etichetta: "SUSTAINability", aiuto: null, link: { url: "https://esg.dintec.it", testo: "Compilalo" }, obbligatorio: false, condizione: "green", si_dichiara_mancante: false },
];

describe("quali documenti chiedere", () => {
  it("comandano quelli dell'offerta: sono scelti per questa impresa", () => {
    expect(documentiDaChiedere(conExtra, base).map(d => d.campo))
      .toEqual(["polizza", "sustainability"]);
  });

  it("senza offerta restano quelli che valgono per tutti", () => {
    expect(documentiDaChiedere(undefined, base).map(d => d.campo)).toEqual(["polizza"]);
  });

  it("un'offerta che non ne porta nessuno non svuota il modulo", () => {
    /* Un'offerta vecchia, salvata prima che i documenti viaggiassero con lei,
       non deve far sparire anche i tre che si chiedono sempre. */
    expect(documentiDaChiedere([], base).map(d => d.campo)).toEqual(["polizza"]);
  });
});
