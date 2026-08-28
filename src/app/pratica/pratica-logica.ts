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
