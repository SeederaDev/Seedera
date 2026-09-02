import { describe, it, expect } from "vitest";
import { etichettaStato, messaggioAssenza, dataIt, segnoVoce, siPuoScaricare } from "./pratica-logica";

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

describe("segnoVoce", () => {
  it("finche' tocca a lui dice cosa deve fare", () => {
    expect(segnoVoce("da_fare", true).etichetta).toBe("Da mandare");
    expect(segnoVoce("da_fare", false).etichetta).toBe("Da confermare");
  });

  it("appena mandata conferma la ricezione, invece di far sparire il riquadro", () => {
    expect(segnoVoce("in_corso", true).etichetta).toMatch(/ricevuto/i);
    expect(segnoVoce("in_corso", false).etichetta).toMatch(/confermato/i);
  });

  it("a controllo fatto lo dice", () => {
    expect(segnoVoce("pronto", true).etichetta).toBe("A posto");
  });
});

describe("uno stato inatteso non manda in contraddizione il riquadro", () => {
  it("cade su 'da fare', cosi' etichetta e corpo dicono la stessa cosa", () => {
    // @ts-expect-error: e' proprio il caso di un valore che non dovrebbe arrivare
    const s = segnoVoce(undefined, true);
    expect(s.tono).toBe("aperto");
    expect(s.etichetta).toBe("Da mandare");
  });
});

/* Una voce consegnata senza il file allegato capita: si spunta la voce e ci si
   dimentica di caricare il modulo. La pagina non deve offrire un pulsante che
   scarica il vuoto, ma deve comunque lasciar caricare il firmato: il cliente
   potrebbe averlo ricevuto per altra via. */
describe("il documento da scaricare", () => {
  const voce = (documento_id: string | null) => ({
    id: "v1", nome: "Modulo di Domanda", descrizione: null,
    firma: "legale_rappresentante", documento_id, consegnato_il: "2026-09-02",
  });

  it("si scarica quando il file c'e'", () => {
    expect(siPuoScaricare(voce("doc-1"))).toBe(true);
  });

  it("non si scarica quando non c'e' niente da prendere", () => {
    expect(siPuoScaricare(voce(null))).toBe(false);
  });
});
