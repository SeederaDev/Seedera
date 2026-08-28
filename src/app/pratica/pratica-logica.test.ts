import { describe, it, expect } from "vitest";
import { etichettaStato, messaggioAssenza, dataIt } from "./pratica-logica";

describe("etichettaStato", () => {
  it("traduce lo stato interno in qualcosa che il cliente capisce", () => {
    expect(etichettaStato("aperta")).toBe("in preparazione");
    expect(etichettaStato("inviata")).toContain("Camera di Commercio");
  });
  it("uno stato che non conosce lo mostra com'e', invece di sparire", () => {
    expect(etichettaStato("stato-nuovo")).toBe("stato-nuovo");
  });
});

describe("messaggioAssenza", () => {
  it("chi arriva senza token viene mandato a cercare il link, non a scriverci", () => {
    expect(messaggioAssenza("senza-token")).toMatch(/link che ti abbiamo mandato/i);
  });
  it("un link revocato dice di chiederne un altro, e a chi", () => {
    expect(messaggioAssenza("non-valido")).toContain("info@seedera.it");
  });
  it("un problema di rete dice di riprovare, non che il link e' morto", () => {
    expect(messaggioAssenza("rete")).toMatch(/riprova/i);
    expect(messaggioAssenza("rete")).not.toMatch(/non è più attivo/i);
  });
});

describe("dataIt", () => {
  it("mette il giorno davanti", () => {
    expect(dataIt("2026-08-20")).toBe("20/08/2026");
    expect(dataIt(null)).toBe("");
  });
});
