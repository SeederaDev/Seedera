import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/* I componenti del percorso voucher servono tutte le camere censite: un nome
   di camera, una percentuale o un tetto scritti dentro il codice tornerebbero
   a mostrare Frosinone-Latina anche sulla pagina di Bari. I valori arrivano
   dal bando, sempre. Se un testo davvero non va parametrizzato, si aggiunge
   qui l'eccezione con la sua ragione — non la si nasconde. */
const DIR = "src/components/voucher";

describe("i componenti voucher non conoscono nessuna camera", () => {
  const file = readdirSync(DIR).filter(f => /\.tsx?$/.test(f) && !f.includes(".test."));

  it("ce n'e' almeno uno da controllare", () => {
    expect(file.length).toBeGreaterThan(0);
  });

  it.each(file)("%s non nomina una camera di commercio", (nome) => {
    const testo = readFileSync(join(DIR, nome), "utf8");
    expect(testo).not.toMatch(/Frosinone|Latina|CCIAA/i);
  });

  it.each(file)("%s non cabla importi o percentuali del bando", (nome) => {
    const testo = readFileSync(join(DIR, nome), "utf8");
    expect(testo).not.toMatch(/10[._]000|4[._]000|1_000_000|400_000/);
    expect(testo).not.toMatch(/\b70\s*%/);
  });
});
