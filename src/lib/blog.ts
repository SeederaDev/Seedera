/**
 * Regole di pagina sugli articoli: pure, quindi verificabili senza montare
 * nulla. I dati arrivano da `contenuti.ts`; qui si decide come si leggono.
 */
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import type { Articolo } from "./contenuti";

/**
 * Il corpo e' Markdown, ma quello che finisce in pagina resta **HTML costruito
 * da testo**: passa da una ripulitura. Il corpo lo scriviamo noi, e un giorno
 * potrebbe arrivare da un incolla o da un import — "e' nostro" e "e' sicuro"
 * non sono la stessa cosa.
 */
export function inHtml(markdown: string): string {
  if (!markdown) return "";
  const grezzo = marked.parse(markdown, { gfm: true, breaks: false, async: false });
  return sanitizeHtml(grezzo, {
    allowedTags: [
      "h2", "h3", "h4", "p", "a", "strong", "em", "ul", "ol", "li",
      "blockquote", "code", "pre", "hr", "br", "img", "figure", "figcaption",
      "table", "thead", "tbody", "tr", "th", "td",
    ],
    allowedAttributes: {
      a: ["href", "title"],
      img: ["src", "alt", "title", "loading"],
    },
    /* Solo indirizzi che un browser puo' seguire: `javascript:` in un href e'
       uno script travestito da collegamento. */
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      /* Un link esterno che apre nella stessa scheda porta via il lettore; e
         `noopener` perche' la pagina aperta non deve poter toccare la nostra. */
      a: (nome, attribs) =>
        attribs.href?.startsWith("http")
          ? { tagName: nome, attribs: { ...attribs, target: "_blank", rel: "noopener noreferrer" } }
          : { tagName: nome, attribs },
    },
  });
}

/** Il testo nudo del Markdown: serve alle descrizioni, dove i simboli sarebbero rumore. */
export const senzaMarkdown = (markdown: string): string =>
  sanitizeHtml(inHtml(markdown), { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();

/** Taglia sulla parola: una descrizione spezzata a meta' sillaba si nota. */
export function testoBreve(testo: string, limite: number): string {
  if (testo.length <= limite) return testo;
  const tagliato = testo.slice(0, limite - 1);
  const spazio = tagliato.lastIndexOf(" ");
  return `${(spazio > limite / 2 ? tagliato.slice(0, spazio) : tagliato).trimEnd()}…`;
}

/**
 * Le date del feed vanno in RFC 822: e' cio' che i lettori sanno leggere.
 * Senza data non si dichiara niente — inventare l'oggi farebbe risultare
 * "nuovo" un articolo che nuovo non e'.
 */
export function dataRfc822(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d.toUTCString();
}

/** Titolo e descrizione per i motori, con i ripieghi dichiarati nel pannello. */
export function metaArticolo(a: Articolo): { titolo: string; descrizione: string } {
  return {
    titolo: a.seo_titolo?.trim() || a.titolo,
    descrizione:
      a.seo_descrizione?.trim() ||
      a.sommario?.trim() ||
      testoBreve(senzaMarkdown(a.corpo), 155),
  };
}
