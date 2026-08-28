import { describe, it, expect } from "vitest";
import { passoCompleto, messaggioErrore } from "./preventivatore-logica";

describe("passoCompleto", () => {
  it("le domande vogliono settore, dimensione e almeno un obiettivo", () => {
    expect(passoCompleto(0, { settore: "commercio", obiettivi: [], dimensione: "6-15" })).toBe(false);
    expect(passoCompleto(0, { settore: "commercio", obiettivi: ["ecommerce"] })).toBe(false);
    expect(passoCompleto(0, { settore: "commercio", obiettivi: ["ecommerce"], dimensione: "6-15" })).toBe(true);
  });

  it("il contatto vuole email, azienda e consenso", () => {
    expect(passoCompleto(1, {}, { email: "a@b.it", azienda: "Acme", consenso: false })).toBe(false);
    expect(passoCompleto(1, {}, { email: "a@b.it", azienda: "", consenso: true })).toBe(false);
    expect(passoCompleto(1, {}, { email: "non-mail", azienda: "Acme", consenso: true })).toBe(false);
    expect(passoCompleto(1, {}, { email: "a@b.it", azienda: "Acme", consenso: true })).toBe(true);
  });

  it("non rifiuta un'email legittima solo perche' e' insolita", () => {
    expect(passoCompleto(1, {}, { email: "mario.rossi+voucher@sotto.dominio.co.uk", azienda: "A", consenso: true }))
      .toBe(true);
  });
});

describe("messaggioErrore", () => {
  it("un errore di rete dice cosa fare, non 'Failed to fetch'", () => {
    const m = messaggioErrore(new TypeError("Failed to fetch"));
    expect(m).toMatch(/connessione/i);
    expect(m).not.toContain("Failed to fetch");
  });
  it("un 404 dice che il bando non e' disponibile", () => {
    expect(messaggioErrore({ status: 404 })).toMatch(/non è al momento disponibile/i);
  });
  it("un 429 invita ad aspettare invece di insistere", () => {
    expect(messaggioErrore({ status: 429 })).toMatch(/troppe richieste/i);
  });
  it("un 503 manda a noi, perche' il problema e' nostro", () => {
    expect(messaggioErrore({ status: 503 })).toContain("info@seedera.it");
  });
});
