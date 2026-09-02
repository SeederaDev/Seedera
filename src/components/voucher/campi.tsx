"use client";

import React from "react";

/* Vocabolario visivo del percorso voucher: stili e campi di modulo condivisi
   da tutte le pagine camera. Qui dentro non entra nessun dato di bando. */

/* Il grigio di sistema del sito (#ccc) su bianco non si legge: per i testi
   secondari di queste pagine si usa un grigio che regge il contrasto. */
export const GRIGIO_TESTO = "#5a5a5a";
/* Il token --color-light-grey non esiste nel sito: con una variabile
   inesistente la dichiarazione border decade e i campi restano senza bordo. */
export const BORDO_CAMPO = "#c9c9c9";

export const MAX_FILE = 20 * 1024 * 1024;
/* Il bando ammette solo PDF e scansioni. */
export const ACCEPT = "application/pdf,image/jpeg,image/png";

/* Il resto del sito impagina in due colonne (etichetta a sinistra, testo a
   destra con `.request-col`): va bene per una pagina che si legge, non per un
   modulo da compilare, che finiva spinto a destra con mezzo schermo vuoto.
   Qui la colonna sta al centro e il contenuto la segue tutto.
   `width: 100%` non e' ridondante: dentro un contenitore flex i margini
   automatici annullano lo stretch, e senza larghezza il blocco si stringe sul
   proprio contenuto (i pulsanti finivano in mezzo alla pagina). */
export const colonna = {
  width: "100%",
  maxWidth: "760px",
  marginLeft: "auto",
  marginRight: "auto",
} as const;

export const etichettaPill = {
  borderRadius: "5px",
  padding: "5px 10px",
  fontSize: "14px",
  lineHeight: "20px",
} as const;

/* Campi da modulo, non da manifesto: etichetta sopra, input compatto.
   16px fissi sull'input: sotto quella soglia iOS zooma la pagina. */
export const stileEtichetta = {
  display: "block",
  fontSize: "13px",
  fontWeight: 500,
  color: "var(--color-black)",
  marginBottom: "4px",
} as const;

export const stileCampo = {
  width: "100%",
  padding: "10px 12px",
  fontSize: "16px",
  borderRadius: "8px",
  border: `1px solid ${BORDO_CAMPO}`,
  backgroundColor: "#fff",
  color: "var(--color-black)",
} as const;

export const stilePulsante = {
  borderRadius: "5px",
  border: "2px solid var(--color-yellow)",
  padding: "12px 20px",
  fontSize: "var(--font-btn)",
  color: "var(--color-black)",
  backgroundColor: "transparent",
} as const;

export function Etichetta({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center border border-black text-black tracking-wide uppercase"
      style={etichettaPill}
    >
      {children}
    </span>
  );
}

export function Campo({
  nome,
  etichetta,
  esempio,
  tipo = "text",
  obbligatorio = false,
  larga = false,
  valore,
  cambia,
}: {
  nome: string;
  etichetta: string;
  esempio?: string;
  tipo?: string;
  obbligatorio?: boolean;
  larga?: boolean;
  valore?: string;
  cambia?: (v: string) => void;
}) {
  return (
    <label className={larga ? "md:col-span-2" : undefined}>
      <span style={stileEtichetta}>
        {etichetta}
        {obbligatorio && <span aria-hidden="true"> *</span>}
      </span>
      <input
        type={tipo}
        name={nome}
        placeholder={esempio}
        required={obbligatorio}
        {...(cambia ? { value: valore ?? "", onChange: e => cambia(e.target.value) } : {})}
        className="outline-none transition-colors duration-200 focus:border-[var(--color-black)]"
        style={stileCampo}
      />
    </label>
  );
}

export function Blocco({
  etichetta,
  children,
}: {
  /* Senza etichetta il blocco e' solo la griglia dei campi: serve dentro una
     fisarmonica, dove il titolo lo dice gia' l'intestazione e ripeterlo due
     volte fa sembrare che siano due sezioni diverse. */
  etichetta?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={colonna}>
      {etichetta && (
        <div style={{ marginBottom: "20px" }}>
          <Etichetta>{etichetta}</Etichetta>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "16px" }}>
        {children}
      </div>
    </div>
  );
}

export function CampoFile({
  nome,
  etichetta,
  aiuto,
  obbligatorio = false,
  disabilitato = false,
}: {
  nome: string;
  etichetta: string;
  aiuto?: string;
  obbligatorio?: boolean;
  disabilitato?: boolean;
}) {
  return (
    <label
      className="md:col-span-2 block cursor-pointer transition-opacity duration-200"
      style={{
        border: `1px dashed ${BORDO_CAMPO}`,
        borderRadius: "8px",
        padding: "12px 14px",
        backgroundColor: "#fff",
        opacity: disabilitato ? 0.45 : 1,
      }}
    >
      <span style={stileEtichetta}>
        {etichetta}
        {obbligatorio && <span aria-hidden="true"> *</span>}
      </span>
      {aiuto && (
        <span className="block" style={{ fontSize: "13px", color: GRIGIO_TESTO, marginBottom: "6px" }}>
          {aiuto}
        </span>
      )}
      {/* Il testo del sito e' bianco per impostazione, e le sezioni chiare non
          lo ridichiarano: senza questo colore il nome del file scelto restava
          bianco su bianco e il caricamento sembrava non essere avvenuto. */}
      <input
        type="file"
        name={nome}
        accept={ACCEPT}
        required={obbligatorio && !disabilitato}
        disabled={disabilitato}
        className="campo-file block w-full"
        style={{ fontSize: "14px", color: "var(--color-black)" }}
      />
    </label>
  );
}

/**
 * Una sezione che si apre e si chiude.
 *
 * Sostituisce i passi affiancati in cima al modulo: con quelli si vedeva dove si
 * era, ma per rileggere un dato gia' inserito bisognava tornare indietro e poi
 * riavanzare. Qui si va avanti nell'ordine — chi finisce una sezione apre la
 * successiva — ma nessuna e' chiusa a chiave: si riapre quella che si vuole,
 * quando si vuole, senza perdere il posto.
 *
 * Il contenuto resta **montato** anche da chiusa (`hidden`, non smontato): i
 * file gia' scelti e i campi compilati non si perdono, ed e' la stessa ragione
 * per cui i passi non venivano smontati prima.
 */
export function Fisarmonica({
  titolo,
  aperta,
  completata = false,
  onCommuta,
  riferimento,
  children,
}: {
  titolo: string;
  aperta: boolean;
  completata?: boolean;
  onCommuta: () => void;
  riferimento?: (el: HTMLDivElement | null) => void;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        border: `1px solid ${aperta ? "var(--color-black)" : BORDO_CAMPO}`,
        borderRadius: "10px",
        transition: "border-color 200ms",
      }}
    >
      <h3 style={{ margin: 0 }}>
        <button
          type="button"
          onClick={onCommuta}
          aria-expanded={aperta}
          className="w-full flex items-center justify-between text-left transition-colors duration-200"
          style={{
            padding: "16px 18px",
            background: aperta ? "var(--color-yellow)" : "transparent",
            borderRadius: aperta ? "9px 9px 0 0" : "9px",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: 500,
            color: "var(--color-black)",
          }}
        >
          <span>
            {titolo}
            {completata && !aperta && (
              <span style={{ color: GRIGIO_TESTO, fontWeight: 400 }}> — compilata</span>
            )}
          </span>
          {/* Il segno dice cosa succede al click, non in che stato siamo: e'
              l'unica delle due letture che serve a chi deve decidere. */}
          <span aria-hidden="true" style={{ fontSize: "20px", lineHeight: 1 }}>
            {aperta ? "\u2212" : "+"}
          </span>
        </button>
      </h3>
      <div ref={riferimento} hidden={!aperta} style={{ padding: "22px 18px 24px" }}>
        {children}
      </div>
    </section>
  );
}
