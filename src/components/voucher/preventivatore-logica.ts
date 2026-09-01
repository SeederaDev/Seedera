/* Logica pura del preventivatore, fuori da React perche' sia verificabile:
   quali passi sono completi e cosa dire quando la chiamata non riesce. */

export const SETTORI = [
  { valore: "commercio", etichetta: "Commercio e vendita al dettaglio" },
  { valore: "manifattura", etichetta: "Produzione e artigianato" },
  { valore: "servizi", etichetta: "Servizi e professioni" },
  { valore: "ristorazione", etichetta: "Ristorazione e ospitalità" },
  { valore: "edilizia", etichetta: "Edilizia e impianti" },
  { valore: "altro", etichetta: "Altro" },
] as const;

export const OBIETTIVI = [
  { valore: "sito", etichetta: "Farmi trovare online" },
  { valore: "ecommerce", etichetta: "Vendere online" },
  { valore: "gestionale", etichetta: "Mettere ordine in ordini, clienti e magazzino" },
  { valore: "automazione", etichetta: "Smettere di ricopiare dati a mano" },
  { valore: "ai", etichetta: "Usare l'intelligenza artificiale nel lavoro" },
  { valore: "dati", etichetta: "Capire i numeri dell'azienda" },
  { valore: "sicurezza", etichetta: "Mettere in sicurezza dati e sistemi" },
] as const;

export const DIMENSIONI = [
  { valore: "1-5", etichetta: "Da 1 a 5" },
  { valore: "6-15", etichetta: "Da 6 a 15" },
  { valore: "oltre-15", etichetta: "Più di 15" },
] as const;

export interface Risposte {
  settore?: string;
  obiettivi?: string[];
  dimensione?: string;
}

export interface Contatto {
  email?: string;
  azienda?: string;
  telefono?: string;
  consenso?: boolean;
}

/* Controllo volutamente indulgente: la validazione seria la fa il backend, qui
   serve solo a non far premere un pulsante che tornerebbe indietro con un
   errore. Una regex severa sulle email rifiuta indirizzi legittimi. */
const emailPlausibile = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export function passoCompleto(indice: number, risposte: Risposte, contatto: Contatto = {}): boolean {
  if (indice === 0) {
    return Boolean(risposte.settore)
      && Boolean(risposte.dimensione)
      && (risposte.obiettivi?.length ?? 0) > 0;
  }
  return Boolean(contatto.consenso)
    && Boolean(contatto.azienda?.trim())
    && emailPlausibile(contatto.email ?? "");
}

/* "Failed to fetch" non dice niente a chi sta compilando. Ogni errore qui esce
   con cosa e' successo e cosa puo' fare. */
export function messaggioErrore(errore: unknown, contatto = "info@seedera.it"): string {
  const stato = typeof errore === "object" && errore !== null && "status" in errore
    ? Number((errore as { status: unknown }).status)
    : null;

  if (stato === 404) return "Questo bando non è al momento disponibile. Scrivici e ti diciamo cosa è aperto per te.";
  if (stato === 429) return "Abbiamo ricevuto troppe richieste in poco tempo: riprova fra qualche minuto.";
  if (stato === 503) return `Il preventivo automatico non è disponibile in questo momento: scrivici a ${contatto} e te lo prepariamo noi.`;
  if (stato && stato >= 400 && stato < 500) return "Qualche dato non è stato accettato: ricontrolla e riprova.";
  if (stato && stato >= 500) return `Problema dalla nostra parte: riprova fra poco, o scrivici a ${contatto}.`;
  return `Non siamo riusciti a inviare: controlla la connessione e riprova. Se insiste, scrivici a ${contatto}.`;
}

/* Cosa e' successo davvero all'invio. Le tre risposte possibili del backend si
   somigliano — sono tutte `ok: true` — ma portano la persona in tre posti
   diversi, e distinguerle qui evita che la pagina chiami "errore" un preventivo
   che sta per arrivare. */
export type Esito =
  | { tipo: "offerta"; token: string }
  | { tipo: "in_carico" }
  | { tipo: "errore" };

export function esitoInvio(dati: unknown): Esito {
  const d = (dati ?? {}) as { token?: unknown; in_carico?: unknown };
  if (typeof d.token === "string" && d.token) return { tipo: "offerta", token: d.token };
  if (d.in_carico === true) return { tipo: "in_carico" };
  /* Nessuno dei due: e' la risposta che diamo all'honeypot, e a una persona
     finita li' dentro serve comunque una via d'uscita. */
  return { tipo: "errore" };
}
