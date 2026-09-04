/* Logica pura della pagina della pratica, fuori da React perche' sia
   verificabile: come si legge lo stato e cosa si dice quando il link non porta
   da nessuna parte. */

export interface VocePratica {
  id: string;
  nome: string;
  descrizione: string | null;
  /* Alcune cose si mandano (la polizza, i report), altre si hanno soltanto
     (SPID, firma digitale, PEC). Offrire un caricamento per la PEC non
     significa niente, e chiederlo fa perdere fiducia nel resto della pagina. */
  si_carica: boolean;
  /* `da_fare` tocca ancora a lui, `in_corso` l'ha mandata e la controlliamo noi,
     `pronto` e' a posto. Il riquadro resta sempre: cambia lo stato. */
  stato: "da_fare" | "da_firmare" | "in_corso" | "pronto" | "non_applicabile";
}

/* Un documento che abbiamo preparato noi e che aspetta la sua firma. Sta in un
   elenco suo perche' il gesto e' diverso da "mandaci la polizza": prima si
   scarica, poi si firma, poi si ricarica. */
export interface VoceDaFirmare {
  id: string;
  nome: string;
  descrizione: string | null;
  firma: string | null;
  /* Manca quando la voce e' stata consegnata senza allegarci il file: il
     caricamento resta possibile, il download no — e la pagina deve dirlo invece
     di mostrare un pulsante che scarica il vuoto. */
  documento_id: string | null;
  consegnato_il: string | null;
}

/** Cosa dice il riquadro di una voce, secondo il suo stato. */
export function segnoVoce(stato: VocePratica["stato"], si_carica: boolean) {
  if (stato === "pronto") return { etichetta: "A posto", tono: "fatto" as const };
  if (stato === "in_corso") {
    return {
      etichetta: si_carica ? "Ricevuto, lo stiamo controllando" : "Confermato, grazie",
      tono: "ricevuto" as const,
    };
  }
  return { etichetta: si_carica ? "Da mandare" : "Da confermare", tono: "aperto" as const };
}

/* Un documento che abbiamo preparato e che e' suo da tenere, senza giro di
   firma: il preventivo firmato da noi, una scheda tecnica. Arriva solo se un
   file c'e' davvero: nessun pulsante sul vuoto. */
export interface VoceDaScaricare {
  id: string;
  nome: string;
  descrizione: string | null;
  documento_id: string;
}

export interface Pratica {
  impresa: string | null;
  camera: string | null;
  bando: string | null;
  aperta_il: string | null;
  aggiornata_il: string | null;
  stato: string;
  prossimo_passo: string;
  serve_a_te: VocePratica[];
  da_firmare: VoceDaFirmare[];
  /* Facoltativo: un'API piu' vecchia non lo manda, e la pagina non deve
     rompersi per questo. */
  da_scaricare?: VoceDaScaricare[];
  stiamo_facendo: string[];
  fatte: number;
}

const STATI: Record<string, string> = {
  aperta: "in preparazione",
  inviata: "inviata alla Camera di Commercio",
  chiusa: "chiusa",
  "in valutazione": "in valutazione",
};

export const etichettaStato = (stato: string) => STATI[stato] ?? stato;

/* Un link senza token, uno morto e un problema di rete sono tre cose diverse per
   chi sta guardando: chi non ha il token deve cercare la mail, chi ha un link
   revocato deve chiedercene un altro, e chi ha la rete che balla deve solo
   riprovare. Un unico "errore" li manderebbe tutti a scrivere. */
export function messaggioAssenza(caso: "senza-token" | "non-valido" | "rete", contatto = "info@seedera.it"): string {
  if (caso === "senza-token") {
    return "Questo indirizzo va aperto dal link che ti abbiamo mandato: lo trovi nella mail o nel messaggio con cui ti abbiamo scritto.";
  }
  if (caso === "non-valido") {
    return `Questo link non è più attivo. Scrivici a ${contatto} e te ne mandiamo uno nuovo.`;
  }
  return "Non siamo riusciti a caricare la pratica: controlla la connessione e riprova fra un momento.";
}

/* Le date arrivano come "2026-08-20": in pagina si leggono all'italiana. */
export const dataIt = (iso: string | null) => (iso ? iso.split("-").reverse().join("/") : "");

/** C'e' davvero un file da prendere, o la voce e' stata consegnata a vuoto. */
export const siPuoScaricare = (v: Pick<VoceDaFirmare, "documento_id">) =>
  Boolean(v.documento_id);
