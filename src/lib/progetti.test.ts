import { describe, it, expect } from "vitest";
import { isVideo, categorie, inColonne } from "./progetti";

describe("isVideo", () => {
  it("riconosce i formati che il portfolio usa davvero", () => {
    expect(isVideo("/images/projects/zentro/zentro5.mp4")).toBe(true);
    expect(isVideo("/x/y.webm")).toBe(true);
    expect(isVideo("/x/y.MOV")).toBe(true);
  });

  it("un'immagine non e' un video", () => {
    expect(isVideo("/images/projects/zentro/zentro1.jpg")).toBe(false);
    expect(isVideo("/media/abc")).toBe(false);
  });

  it("l'estensione conta solo in fondo", () => {
    // Una cartella chiamata "mp4" non fa di un jpg un video.
    expect(isVideo("/images/mp4/copertina.jpg")).toBe(false);
  });
});

describe("categorie", () => {
  it("nascono dai progetti, senza ripetizioni e con 'Tutti' davanti", () => {
    expect(categorie([
      { categoria: "Brand Identity" },
      { categoria: "Comunicazione" },
      { categoria: "Brand Identity" },
    ])).toEqual(["Tutti", "Brand Identity", "Comunicazione"]);
  });

  it("un progetto senza categoria non aggiunge un filtro vuoto", () => {
    expect(categorie([{ categoria: "" }, { categoria: "Web Development" }]))
      .toEqual(["Tutti", "Web Development"]);
  });
});

describe("inColonne", () => {
  it("distribuisce in ordine di lettura: il secondo progetto apre la seconda colonna", () => {
    expect(inColonne(["a", "b", "c", "d", "e"], 3)).toEqual([["a", "d"], ["b", "e"], ["c"]]);
  });

  it("con meno progetti che colonne, le colonne in piu' restano vuote", () => {
    expect(inColonne(["a"], 3)).toEqual([["a"], [], []]);
  });

  it("una colonna sola e' l'elenco com'e'", () => {
    expect(inColonne(["a", "b"], 1)).toEqual([["a", "b"]]);
  });
});
