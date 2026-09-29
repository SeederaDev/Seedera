import { describe, expect, it } from "vitest";
import { posizione } from "./persone-griglia";

describe("posizione in scacchiera", () => {
  it("su 4 colonne alterna foto e caselle libere, due persone per riga", () => {
    const celle = [0, 1, 2, 3, 4, 5].map(i => posizione(i, 4));
    expect(celle.map(c => [c.riga, c.colonna])).toEqual([
      [1, 1], [1, 3],
      [2, 2], [2, 4],
      [3, 1], [3, 3],
    ]);
  });

  it("la bio va nella casella libera a destra, e a sinistra solo sull'ultima colonna", () => {
    expect([0, 1, 2, 3].map(i => posizione(i, 4).bio)).toEqual([2, 4, 3, 3]);
    expect([0, 1, 2, 3].map(i => posizione(i, 4).lato)).toEqual(["destra", "destra", "destra", "sinistra"]);
  });

  it("la casella della bio e' sempre libera: mai sopra un'altra foto della stessa riga", () => {
    for (const colonne of [2, 4] as const) {
      for (let i = 0; i < 12; i++) {
        const p = posizione(i, colonne);
        const foto = Array.from({ length: 12 }, (_, j) => posizione(j, colonne))
          .filter(q => q.riga === p.riga)
          .map(q => q.colonna);
        expect(foto).not.toContain(p.bio);
      }
    }
  });

  it("su 2 colonne una persona per riga, alternando il lato", () => {
    expect([0, 1, 2].map(i => posizione(i, 2))).toEqual([
      { riga: 1, colonna: 1, bio: 2, lato: "destra" },
      { riga: 2, colonna: 2, bio: 1, lato: "sinistra" },
      { riga: 3, colonna: 1, bio: 2, lato: "destra" },
    ]);
  });
});
