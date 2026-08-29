/* I bandi camerali: qui stanno solo le regole, i dati arrivano dall'API
   (src/lib/contenuti.ts). Fino al 29/08/2026 il censimento era un file JSON da
   scaricare e committare a mano — il prezzo dell'export statico — con il
   rischio di pubblicare una pagina con dati vecchi. Ora si legge, e basta.

   L'API restituisce solo i bandi **pubblicabili**: quelli di cui il pannello
   conosce i parametri economici. Gli altri non hanno pagina, ed e' voluto. */

export interface Bando {
  slug: string;
  camera: string;
  province: string | null;
  nome: string;
  link: string | null;
  apertura: string | null;
  chiusura: string | null;
  esaurito: number;
  percentuale: number;
  tetto_cent: number;
  spesa_minima_cent: number;
  voci_ammissibili: string[];
  testo_pubblico: string | null;
}

export type Stato = "in_apertura" | "aperto" | "chiuso" | "esaurito" | "da_definire";

/* Stessa regola di src/dominio/bandi.js nel backend. Vive anche qui perche' i
   giorni mancanti si ricalcolano nel browser: altrimenti il conto alla rovescia
   invecchierebbe fra un deploy e l'altro. Date ISO, confronto lessicografico:
   niente fusi orari. */
const giorniFra = (da: string, a: string) =>
  Math.round((Date.parse(a) - Date.parse(da)) / 86_400_000);

export function statoBando(b: Bando, oggi: string): { stato: Stato; giorni: number | null } {
  if (b.esaurito) return { stato: "esaurito", giorni: null };
  if (b.chiusura && oggi > b.chiusura) return { stato: "chiuso", giorni: null };
  if (b.apertura && oggi < b.apertura) return { stato: "in_apertura", giorni: giorniFra(oggi, b.apertura) };
  if (b.chiusura) return { stato: "aperto", giorni: giorniFra(oggi, b.chiusura) };
  if (b.apertura) return { stato: "aperto", giorni: null };
  return { stato: "da_definire", giorni: null };
}

const PESO: Record<Stato, number> = {
  in_apertura: 0, aperto: 1, da_definire: 2, esaurito: 3, chiuso: 4,
};

/* Prima gli sportelli che devono ancora aprire, chi apre prima in cima: e' li'
   che ci si prepara per l'ordine cronologico. Poi gli aperti per scadenza. */
export function ordinaPerPriorita(elenco: Bando[], oggi: string): Bando[] {
  return [...elenco].sort((a, b) => {
    const sa = statoBando(a, oggi), sb = statoBando(b, oggi);
    if (PESO[sa.stato] !== PESO[sb.stato]) return PESO[sa.stato] - PESO[sb.stato];
    const chiave = (x: Bando, s: Stato) => (s === "in_apertura" ? x.apertura : x.chiusura) ?? "9999";
    return chiave(a, sa.stato).localeCompare(chiave(b, sb.stato)) || a.camera.localeCompare(b.camera);
  });
}

export const bandoPerSlug = (elenco: Bando[], slug: string) => elenco.find(b => b.slug === slug);

const sigle = (b: Bando) =>
  (b.province ?? "").split(",").map(p => p.trim().toUpperCase()).filter(Boolean);

export function bandoPerProvincia(elenco: Bando[], sigla: string): Bando | undefined {
  const s = sigla.trim().toUpperCase();
  return elenco.find(b => sigle(b).includes(s));
}

export const PROVINCE = (elenco: Bando[]) =>
  [...new Set(elenco.flatMap(sigle))].sort();

export const euro = (cent: number) =>
  /* useGrouping "always": in italiano il default raggruppa solo da cinque cifre,
     e in colonna "12.000,00" accanto a "1800,00" si legge male. */
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", useGrouping: "always" })
    .format(cent / 100);

/* Nei titoli e nelle frasi discorsive i centesimi sono rumore: i contributi
   camerali sono sempre cifre tonde, e "fino a 10.000,00 €" si legge peggio di
   "fino a 10.000 €". Dove si parla di soldi dovuti (il riepilogo dell'offerta)
   si continua a usare euro(), centesimi compresi. */
export const euroTondo = (cent: number) =>
  new Intl.NumberFormat("it-IT", {
    style: "currency", currency: "EUR", useGrouping: "always", maximumFractionDigits: 0,
  }).format(cent / 100);

/* "2026-11-10" -> "10/11/2026". In pagina le date si leggono all'italiana. */
export const dataIt = (iso: string | null) => (iso ? iso.split("-").reverse().join("/") : "");

export const percento = (frazione: number) => `${Math.round(frazione * 100)}%`;
