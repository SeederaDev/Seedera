"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Bando } from "@/lib/bandi";
import { OFFERTA_ENDPOINT, type Offerta } from "@/lib/api";
import Testata from "./Testata";
import ComeFunziona from "./ComeFunziona";
import RiepilogoOfferta from "./RiepilogoOfferta";
import ModuloOnboarding from "./ModuloOnboarding";
import Preventivatore from "./Preventivatore";
import FAQ from "./FAQ";
import { colonna } from "./campi";

/**
 * Il percorso completo di una camera: testata, offerta (se si arriva da un
 * link personale), spiegazione, modulo, domande. Non sa niente di *quale*
 * camera sia: tutto quello che mostra arriva dal bando che riceve.
 */
export default function PercorsoVoucher({ bando }: { bando: Bando }) {
  const [offerta, setOfferta] = useState<Offerta | null>(null);
  const [tokenOfferta, setTokenOfferta] = useState("");
  const [scelte, setScelte] = useState<boolean[]>([]);
  const [inviato, setInviato] = useState(false);
  const [tokenPratica, setTokenPratica] = useState<string | null>(null);
  /* La data si legge nel browser, non alla build: le pagine sono statiche e
     "mancano 12 giorni" diventerebbe falso il giorno dopo la pubblicazione.
     Finche' non e' nota si usa la data del build, cosi' il primo render del
     server e quello del client coincidono e React non protesta. */
  const [oggi, setOggi] = useState(() => new Date().toISOString().slice(0, 10));
  useEffect(() => setOggi(new Date().toISOString().slice(0, 10)), []);

  /* ?o=TOKEN: si carica l'offerta e la si mostra in cima. Un token morto non
     deve rompere la pagina: semplicemente niente riepilogo, e la candidatura
     resta possibile. */
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("o");
    if (!token || !OFFERTA_ENDPOINT) return;
    setTokenOfferta(token);
    fetch(`${OFFERTA_ENDPOINT}/${encodeURIComponent(token)}`)
      .then(res => (res.ok ? res.json() : null))
      .then(dati => {
        if (!dati) return;
        setOfferta(dati);
        setScelte(dati.righe.map(() => true)); // si parte con tutto incluso
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Testata bando={bando} oggi={oggi} />

        {/* A candidatura inviata resta solo la conferma: offerta, spiegazione e
            modulo hanno finito il loro lavoro, e lasciarli sotto fa sembrare che
            ci sia ancora qualcosa da fare. */}
        {inviato ? (
          <section
            className="bg-white"
            style={{ paddingTop: "clamp(44px, 6vw, 72px)", paddingBottom: "clamp(80px, 10vw, 128px)" }}
          >
            <div className="container-content">
              <div style={colonna}>
                <p
                  role="status"
                  className="text-h3 font-medium leading-relaxed"
                  style={{ color: "var(--color-black)" }}
                >
                  Ricevuto. Controlliamo i documenti e ti ricontattiamo noi entro un
                  giorno lavorativo per i passi successivi.
                </p>
                {/* Il link va dato adesso, mentre la persona e' ancora qui: e'
                    l'unico modo che ha di sapere a che punto siamo senza
                    telefonare, e glielo rimandiamo comunque via mail. */}
                {tokenPratica && (
                  <p className="leading-relaxed" style={{ color: "var(--color-black)", marginTop: "24px" }}>
                    Da qui puoi seguire la pratica e caricare i documenti che
                    mancano:{" "}
                    <a href={`/pratica?p=${encodeURIComponent(tokenPratica)}`} className="underline">
                      apri la tua pratica
                    </a>
                    . Salvati questo indirizzo: e&rsquo; tuo e resta valido.
                  </p>
                )}
              </div>
            </div>
          </section>
        ) : (
          <>
            {offerta && (
              <RiepilogoOfferta
                offerta={offerta}
                bando={bando}
                scelte={scelte}
                cambiaScelta={(i, tenuta) => setScelte(s => s.map((v, j) => (j === i ? tenuta : v)))}
              />
            )}
            <ComeFunziona bando={bando} oggi={oggi} />

            {/* Senza un'offerta in mano non ha senso chiedere subito visure e
                codici fiscali: prima si dice quanto costa e quanto ne copre il
                contributo, poi si compila. Con il token, il preventivo esiste
                gia' e si va dritti alla candidatura. */}
            {!offerta && !tokenOfferta ? (
              <Preventivatore bando={bando} />
            ) : (
            <ModuloOnboarding
              bando={bando}
              offerta={offerta}
              tokenOfferta={tokenOfferta}
              scelte={scelte}
              inviato={(token) => {
                setTokenPratica(token);
                setInviato(true);
                // Sopra sparisce tutto: senza questo si resterebbe a meta'
                // pagina, dove ora non c'e' piu' niente.
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
            )}
            <FAQ bando={bando} />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
