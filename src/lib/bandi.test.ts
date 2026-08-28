import { describe, it, expect } from "vitest";
import { statoBando, bandoPerProvincia, ordinaPerPriorita, euro, euroTondo, PROVINCE, type Bando } from "./bandi";

const bando = (p: Partial<Bando>): Bando => ({
  slug: "bari", camera: "CCIAA di Bari", province: "BA", nome: "V", link: null,
  apertura: null, chiusura: null, esaurito: 0, percentuale: 0.5, tetto_cent: 500_000,
  spesa_minima_cent: 200_000, voci_ammissibili: ["Software"], testo_pubblico: null, ...p,
});

describe("statoBando", () => {
  it("in apertura conta i giorni che mancano", () => {
    expect(statoBando(bando({ apertura: "2026-09-10" }), "2026-09-01"))
      .toEqual({ stato: "in_apertura", giorni: 9 });
  });
  it("aperto conta i giorni alla chiusura", () => {
    expect(statoBando(bando({ apertura: "2026-08-01", chiusura: "2026-09-30" }), "2026-09-01"))
      .toEqual({ stato: "aperto", giorni: 29 });
  });
  it("chiuso dopo la scadenza", () => {
    expect(statoBando(bando({ chiusura: "2026-08-01" }), "2026-09-01").stato).toBe("chiuso");
  });
  it("esaurito vince su tutto", () => {
    expect(statoBando(bando({ esaurito: 1, chiusura: "2026-12-31" }), "2026-09-01").stato).toBe("esaurito");
  });
  it("senza date non si inventa uno stato", () => {
    expect(statoBando(bando({}), "2026-09-01").stato).toBe("da_definire");
  });
});

describe("ordinaPerPriorita", () => {
  it("gli sportelli in apertura vengono prima degli aperti", () => {
    const elenco = ordinaPerPriorita([
      bando({ slug: "aperto", apertura: "2026-01-01", chiusura: "2026-12-31" }),
      bando({ slug: "apre-dopo", apertura: "2026-09-25", chiusura: "2026-11-10" }),
    ], "2026-09-01");
    expect(elenco[0].slug).toBe("apre-dopo");
  });
  it("fra due aperti viene prima chi chiude prima", () => {
    const elenco = ordinaPerPriorita([
      bando({ slug: "tardi", apertura: "2026-01-01", chiusura: "2026-12-31" }),
      bando({ slug: "presto", apertura: "2026-01-01", chiusura: "2026-09-30" }),
    ], "2026-09-01");
    expect(elenco[0].slug).toBe("presto");
  });
  it("i chiusi finiscono in fondo", () => {
    const elenco = ordinaPerPriorita([
      bando({ slug: "chiuso", chiusura: "2026-01-01" }),
      bando({ slug: "vivo", apertura: "2026-01-01", chiusura: "2026-12-31" }),
    ], "2026-09-01");
    expect(elenco.map(b => b.slug)).toEqual(["vivo", "chiuso"]);
  });
});

describe("bandoPerProvincia", () => {
  it("trova la camera competente dalla sigla", () => {
    const elenco = [bando({ province: "FR, LT", slug: "frosinone-latina" }), bando({ province: "BA" })];
    expect(bandoPerProvincia(elenco, "LT")?.slug).toBe("frosinone-latina");
    expect(bandoPerProvincia(elenco, "lt")?.slug).toBe("frosinone-latina");
    expect(bandoPerProvincia(elenco, "ZZ")).toBeUndefined();
  });
  it("non confonde una sigla con un pezzo di un'altra", () => {
    expect(bandoPerProvincia([bando({ province: "FR, LT" })], "F")).toBeUndefined();
  });
});

describe("PROVINCE", () => {
  it("elenca le sigle una volta sola, in ordine", () => {
    expect(PROVINCE([bando({ province: "FR, LT" }), bando({ province: "LT, RM" })]))
      .toEqual(["FR", "LT", "RM"]);
  });
});

describe("euro", () => {
  it("raggruppa le migliaia anche sotto i 10.000", () => {
    expect(euro(800_000)).toContain("8.000");
  });
});

describe("euroTondo", () => {
  it("toglie i centesimi dove sono rumore", () => {
    expect(euroTondo(1_000_000)).toContain("10.000");
    expect(euroTondo(1_000_000)).not.toContain(",00");
  });
  it("arrotonda invece di troncare", () => {
    expect(euroTondo(199_990)).toContain("2.000");
  });
});
