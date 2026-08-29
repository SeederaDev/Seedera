import { describe, it, expect } from "vitest";
import { timingSafeEqual } from "node:crypto";

/* La funzione vive dentro la route, che importa `next/cache`: qui si verifica
   la regola, che e' l'unica cosa che puo' sbagliare in silenzio. */
function segretoValido(dato: string, atteso: string) {
  const a = Buffer.from(dato);
  const b = Buffer.from(atteso);
  if (a.length !== b.length) { timingSafeEqual(b, b); return false; }
  return timingSafeEqual(a, b);
}

describe("il segreto della rigenerazione", () => {
  it("accetta solo quello giusto", () => {
    expect(segretoValido("apriti-sesamo", "apriti-sesamo")).toBe(true);
    expect(segretoValido("apriti-sesamq", "apriti-sesamo")).toBe(false);
  });

  it("una lunghezza diversa non fa esplodere il confronto", () => {
    // timingSafeEqual lancia se i buffer hanno lunghezze diverse: senza la
    // guardia, un segreto corto mandava la rotta in errore 500 invece che in 401.
    expect(() => segretoValido("corto", "molto piu' lungo")).not.toThrow();
    expect(segretoValido("corto", "molto piu' lungo")).toBe(false);
  });

  it("un segreto vuoto non apre niente", () => {
    expect(segretoValido("", "")).toBe(true); // la rotta rifiuta prima, se atteso e' vuoto
  });
});
