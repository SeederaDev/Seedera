import { describe, it, expect } from "vitest";
import { domande } from "./FAQ";
import type { Bando } from "@/lib/bandi";

const bando = (p: Partial<Bando> = {}): Bando => ({
  slug: "bari", camera: "Camera di commercio di Bari", province: "BA", nome: "V", link: null,
  apertura: null, chiusura: null, esaurito: 0, percentuale: 0.5, tetto_cent: 500_000,
  spesa_minima_cent: 200_000, voci_ammissibili: ["Software", "Consulenza"], testo_pubblico: null, ...p,
});

describe("FAQ costruite dal bando", () => {
  it("dice le cifre di questo bando, non quelle di un altro", () => {
    const testo = domande(bando()).map(d => d.a).join(" ");
    expect(testo).toContain("50%");
    expect(testo).toContain("5.000");
    expect(testo).toContain("2.000");
    expect(testo).not.toContain("70%");
  });

  it("senza date non promette una scadenza", () => {
    expect(domande(bando()).some(d => /entro quando/i.test(d.q))).toBe(false);
  });

  it("con le date aggiunge la domanda sulle scadenze", () => {
    const d = domande(bando({ apertura: "2026-09-25", chiusura: "2026-11-10" }));
    const scadenze = d.find(x => /entro quando/i.test(x.q));
    expect(scadenze?.a).toContain("25/09/2026");
    expect(scadenze?.a).toContain("10/11/2026");
  });

  it("uno sportello a fondi non dice una data di chiusura inventata", () => {
    const d = domande(bando({ apertura: "2026-07-28" }));
    expect(d.find(x => /entro quando/i.test(x.q))?.a).toContain("esaurimento");
  });

  it("elenca le voci ammissibili di questo bando", () => {
    expect(domande(bando()).map(d => d.a).join(" ")).toContain("Software; Consulenza");
  });
});
