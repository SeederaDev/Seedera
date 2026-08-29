import { describe, it, expect } from "vitest";
import { inHtml, dataRfc822, metaArticolo, testoBreve } from "./blog";
import type { Articolo } from "./contenuti";

const articolo: Articolo = {
  slug: "il-voucher-non-e-un-fondo-perduto",
  titolo: "Il voucher digitale non è un contributo a fondo perduto",
  sommario: "Cosa cambia, e perché conta.",
  corpo: "## Il punto\n\nUn voucher **si rendiconta**.",
  copertina: "/media/abc",
  autore: { nome: "Ercole Sarno", ruolo: "Founder", slug: "ercole-sarno" },
  tag: ["voucher"],
  pubblicato_il: "2026-08-30",
  seo_titolo: null,
  seo_descrizione: null,
};

describe("inHtml", () => {
  it("rende il Markdown che si usa scrivendo", () => {
    const html = inHtml("## Titoletto\n\nUn **grassetto** e un [link](https://seedera.it).");
    expect(html).toContain("<h2>Titoletto</h2>");
    expect(html).toContain("<strong>grassetto</strong>");
    expect(html).toContain('href="https://seedera.it"');
  });

  it("toglie lo script, anche se il corpo lo scriviamo noi", () => {
    // Il corpo passa da un incolla, e un giorno potrebbe passare da un import:
    // "e' nostro" e "e' sicuro" non sono la stessa cosa.
    const html = inHtml('Ciao <script>alert(1)</script> mondo');
    expect(html).not.toContain("<script");
    expect(html).not.toContain("alert(1)");
  });

  it("toglie i gestori di evento appesi ai tag ammessi", () => {
    expect(inHtml('<p onclick="rubare()">testo</p>')).not.toContain("onclick");
  });

  it("un corpo vuoto non diventa 'undefined'", () => {
    expect(inHtml("")).toBe("");
    expect(inHtml(null as unknown as string)).toBe("");
  });
});

describe("dataRfc822", () => {
  it("il feed vuole le date in RFC 822", () => {
    expect(dataRfc822("2026-08-30")).toBe("Sun, 30 Aug 2026 00:00:00 GMT");
  });

  it("senza data non inventa l'oggi: non c'e' nulla da dichiarare", () => {
    expect(dataRfc822(null)).toBe(null);
  });
});

describe("metaArticolo", () => {
  it("senza campi per i motori usa titolo e sommario", () => {
    const m = metaArticolo(articolo);
    expect(m.titolo).toBe(articolo.titolo);
    expect(m.descrizione).toBe("Cosa cambia, e perché conta.");
  });

  it("i campi per i motori, se ci sono, vincono", () => {
    const m = metaArticolo({ ...articolo, seo_titolo: "Voucher: come funziona", seo_descrizione: "Guida breve." });
    expect(m.titolo).toBe("Voucher: come funziona");
    expect(m.descrizione).toBe("Guida breve.");
  });

  it("senza sommario la descrizione nasce dal corpo, senza i segni del Markdown", () => {
    const m = metaArticolo({ ...articolo, sommario: null });
    expect(m.descrizione).toContain("Un voucher si rendiconta");
    expect(m.descrizione).not.toContain("**");
    expect(m.descrizione).not.toContain("##");
  });
});

describe("testoBreve", () => {
  it("taglia sulla parola, non a meta'", () => {
    const t = testoBreve("uno due tre quattro cinque sei sette otto", 20);
    expect(t.length).toBeLessThanOrEqual(21);
    expect(t.endsWith("…")).toBe(true);
    expect(t).not.toContain("quattr ");
  });

  it("un testo gia' corto resta intero, senza puntini", () => {
    expect(testoBreve("breve", 20)).toBe("breve");
  });
});
