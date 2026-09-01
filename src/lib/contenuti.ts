/**
 * Da qui le pagine leggono i contenuti, e da nessun'altra parte.
 *
 * Un posto solo perche' e' li' che si decide quanto vive la cache e con che
 * etichetta si invalida: `fetch` sparsi per le pagine vorrebbero dire regole
 * diverse in ogni file, e il giorno che una non si aggiorna nessuno sa dove
 * guardare.
 *
 * La lettura avviene **sul server**: le pagine restano indicizzabili, e
 * l'indirizzo dell'API non finisce nel browser.
 */

import type { Bando } from "./bandi";

const API = process.env.API_BASE ?? "http://127.0.0.1:3001";

/* Un'ora e' lungo di proposito: le pagine non si rigenerano a orologio ma
   quando un contenuto cambia, e a quel punto il pannello invalida l'etichetta
   (src/app/api/rigenera). La scadenza e' solo la rete di sicurezza. */
const DURATA = 3600;

async function leggi<T>(percorso: string, etichetta: string, ripiego: T): Promise<T> {
  try {
    const res = await fetch(`${API}${percorso}`, {
      next: { revalidate: DURATA, tags: [etichetta] },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch (errore) {
    /* Un backend che non risponde non deve svuotare il sito: si serve il
       ripiego e si registra. In **compilazione** invece si alza la voce
       (vedi scripts/controlla-api.mjs): pubblicare un sito con le pagine
       vuote e' peggio che non pubblicare. */
    console.error(`contenuti: ${percorso} non raggiungibile —`, errore);
    return ripiego;
  }
}

export interface Articolo {
  slug: string;
  titolo: string;
  sommario: string | null;
  corpo: string;
  copertina: string | null;
  autore: { nome: string; ruolo: string | null; slug: string } | null;
  tag: string[];
  pubblicato_il: string | null;
  seo_titolo: string | null;
  seo_descrizione: string | null;
}

export interface Progetto {
  slug: string;
  cliente: string;
  categoria: string;
  tag: string[];
  descrizione: string;
  copertina: string;
  media: string[];
}

export interface PersonaPubblica {
  slug: string;
  nome: string;
  ruolo: string;
  bio: string;
  foto: string | null;
  colonna: 1 | 2 | 3;
  riga: number;
}

/* L'API restituisce `{ generato_il, bandi }`: qui esce l'elenco, che e' cio'
   che serve alle pagine. */
export const bandiPubblici = async (): Promise<Bando[]> =>
  (await leggi<{ bandi: Bando[] }>("/api/bandi/pubblici", "bandi", { bandi: [] })).bandi;

/* Come si comporta il backend, non cosa contiene: se il preventivo lo scriviamo
   noi, la pagina non deve prometterlo in due minuti. Il ripiego e' "lo
   scriviamo noi" perche' e' la promessa piu' prudente: se l'API non risponde,
   dire di meno e' meglio che dire una cosa che non manteniamo. */
export const preventivoAutomatico = async (): Promise<boolean> =>
  (await leggi<{ preventivo_automatico: boolean }>(
    "/api/configurazione", "configurazione", { preventivo_automatico: false },
  )).preventivo_automatico === true;

export const articoli = () => leggi<Articolo[]>("/api/blog", "blog", []);
export const articolo = (slug: string) =>
  leggi<Articolo | null>(`/api/blog/${encodeURIComponent(slug)}`, `blog:${slug}`, null);
export const progetti = () => leggi<Progetto[]>("/api/progetti", "progetti", []);
export const persone = () => leggi<PersonaPubblica[]>("/api/persone", "persone", []);
