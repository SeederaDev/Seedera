"use client";

import { euro, percento, type Bando } from "@/lib/bandi";
import { scontoSu, contributoSu } from "@/lib/contributo";
import type { Offerta } from "@/lib/api";
import { Etichetta, colonna } from "./campi";

export default function RiepilogoOfferta({
  offerta,
  bando,
  scelte,
  cambiaScelta,
}: {
  offerta: Offerta;
  bando: Bando;
  scelte: boolean[];
  cambiaScelta: (indice: number, tenuta: boolean) => void;
}) {
  const lordo = offerta.righe.reduce(
    (somma, riga, i) => somma + (scelte[i] ? riga.importo_cent : 0),
    0,
  );
  const sconto = scontoSu(lordo, offerta.sconto_tipo, offerta.sconto_valore);
  const totale = lordo - sconto;
  const { contributo, aCarico } = contributoSu(totale, bando);

  return (
    <section style={{ backgroundColor: "var(--color-yellow)" }}>
      <div
        className="container-content"
        style={{
          paddingTop: "clamp(44px, 6vw, 64px)",
          paddingBottom: "clamp(44px, 6vw, 64px)",
        }}
      >
        <div style={colonna}>
          <div style={{ marginBottom: "20px" }}>
            <Etichetta>La tua offerta</Etichetta>
          </div>
          <div style={{ color: "var(--color-black)" }}>
            <h2 className="text-h3 font-medium" style={{ marginBottom: "16px" }}>
              Proposta riservata a {offerta.intestatario}
              {offerta.referente ? `, c.a. ${offerta.referente}` : ""}
            </h2>
            <ul style={{ marginBottom: "16px" }}>
              {offerta.righe.map((r, i) => (
                <li
                  key={i}
                  className="flex justify-between gap-6"
                  style={{
                    padding: "10px 0",
                    borderBottom: "1px solid rgba(0,0,0,0.25)",
                    opacity: scelte[i] ? 1 : 0.45,
                  }}
                >
                  {r.opzionale ? (
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={scelte[i]}
                        onChange={(e) => cambiaScelta(i, e.target.checked)}
                        style={{ marginTop: "5px" }}
                      />
                      <span>
                        <span className="font-medium">{r.descrizione}</span>{" "}
                        <em style={{ fontSize: "13px" }}>(opzionale: puoi toglierla)</em>
                        {r.dettaglio && (
                          <span className="block leading-relaxed" style={{ fontSize: "14px", marginTop: "2px" }}>
                            {r.dettaglio}
                          </span>
                        )}
                      </span>
                    </label>
                  ) : (
                    <span>
                      <span className="font-medium">{r.descrizione}</span>
                      {r.dettaglio && (
                        <span className="block leading-relaxed" style={{ fontSize: "14px", marginTop: "2px" }}>
                          {r.dettaglio}
                        </span>
                      )}
                    </span>
                  )}
                  <span
                    className="font-medium whitespace-nowrap"
                    style={{ textDecoration: scelte[i] ? "none" : "line-through" }}
                  >
                    {euro(r.importo_cent)}
                  </span>
                </li>
              ))}
              {sconto > 0 && (
                <>
                  <li className="flex justify-between gap-6" style={{ padding: "10px 0" }}>
                    <span>Totale di listino</span>
                    <span className="whitespace-nowrap" style={{ textDecoration: "line-through" }}>
                      {euro(lordo)}
                    </span>
                  </li>
                  <li className="flex justify-between gap-6 font-medium" style={{ padding: "10px 0" }}>
                    <span>
                      Sconto riservato
                      {offerta.sconto_tipo === "percento" ? ` (${offerta.sconto_valore}%)` : ""}
                    </span>
                    <span className="whitespace-nowrap">−{euro(sconto)}</span>
                  </li>
                </>
              )}
              <li className="flex justify-between gap-6 font-medium" style={{ padding: "10px 0" }}>
                <span>Totale progetto</span>
                <span className="whitespace-nowrap">{euro(totale)}</span>
              </li>
            </ul>
            <p className="leading-relaxed">
              Con il voucher, il contributo camerale copre{" "}
              <strong>{euro(contributo)}</strong>: a carico tuo restano{" "}
              <strong>{euro(aCarico)}</strong>.
            </p>

            {/* Non e' una riga d'offerta a importo zero: le righe vogliono un
                importo positivo, e una voce da 0 € in mezzo alle altre sembra
                un errore di battitura. E' una dichiarazione sotto il totale,
                dove il cliente sta gia' guardando. */}
            <p className="leading-relaxed" style={{ marginTop: "8px", fontSize: "14px" }}>
              Preparazione e presentazione della domanda sono incluse, senza costi
              aggiuntivi: il contributo si calcola sulle voci qui sopra.
            </p>

            {totale < bando.spesa_minima_cent && (
              <p className="leading-relaxed font-medium" style={{ marginTop: "8px" }}>
                Attenzione: sotto {euro(bando.spesa_minima_cent)} di investimento
                questo bando non ammette la domanda. Rimetti una voce o scrivici
                per rimodulare la proposta.
              </p>
            )}
            <p className="leading-relaxed" style={{ marginTop: "8px", fontSize: "14px" }}>
              Il contributo ({percento(bando.percentuale)} della spesa, massimo{" "}
              {euro(bando.tetto_cent)}) è concesso da {bando.camera} in ordine
              di arrivo delle domande, fino a esaurimento fondi.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
