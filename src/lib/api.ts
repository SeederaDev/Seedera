/* Gli endpoint del backend proprietario (repo seedera-backend). Con
   `output: 'export'` non esistono API route: l'indirizzo arriva da una
   variabile letta **alla build**, e senza di essa i moduli ricadono sulla
   mail invece di inviare. Sta in un file solo perche' tre componenti diversi
   parlano con la stessa API. */
export const VOUCHER_ENDPOINT = process.env.NEXT_PUBLIC_VOUCHER_ENDPOINT ?? "";
export const OFFERTA_ENDPOINT = VOUCHER_ENDPOINT.replace("/voucher/onboarding", "/offerta");
export const PREVENTIVO_ENDPOINT = VOUCHER_ENDPOINT.replace("/voucher/onboarding", "/preventivo");
export const CONTACT_EMAIL = "info@seedera.it";

export interface RigaOfferta {
  descrizione: string;
  dettaglio: string | null;
  importo_cent: number;
  opzionale: boolean;
}

export interface Offerta {
  intestatario: string;
  referente: string | null;
  bando_slug?: string | null;
  righe: RigaOfferta[];
  totale_lordo_cent?: number;
  sconto_cent?: number;
  sconto_tipo?: "percento" | "importo" | null;
  sconto_valore?: number | null;
  totale_cent: number;
  contributo_cent: number;
  a_carico_cent: number;
}
