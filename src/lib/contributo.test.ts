import { describe, it, expect } from "vitest";
import { scontoSu, contributoSu } from "./contributo";

const bando = { percentuale: 0.7, tetto_cent: 1_000_000 };

describe("contributoSu", () => {
  it("applica la percentuale del bando sotto il tetto", () => {
    expect(contributoSu(800_000, bando)).toEqual({ contributo: 560_000, aCarico: 240_000 });
  });
  it("si ferma al tetto del bando", () => {
    expect(contributoSu(2_000_000, bando)).toEqual({ contributo: 1_000_000, aCarico: 1_000_000 });
  });
  it("usa i parametri di un'altra camera senza scomodare il 70%", () => {
    expect(contributoSu(1_200_000, { percentuale: 0.5, tetto_cent: 500_000 }))
      .toEqual({ contributo: 500_000, aCarico: 700_000 });
  });
});

describe("scontoSu", () => {
  it("sconto in percentuale", () => {
    expect(scontoSu(1_000_000, "percento", 15)).toBe(150_000);
  });
  it("sconto in euro", () => {
    expect(scontoSu(1_000_000, "importo", 250_000)).toBe(250_000);
  });
  it("non scende mai sotto zero se il cliente toglie delle voci", () => {
    expect(scontoSu(100_000, "importo", 250_000)).toBe(100_000);
  });
  it("uno sconto che non si capisce vale zero, non rompe il totale", () => {
    expect(scontoSu(100_000, null, 10)).toBe(0);
    expect(scontoSu(100_000, "percento", 0)).toBe(0);
    expect(scontoSu(100_000, "percento", NaN)).toBe(0);
  });
});
