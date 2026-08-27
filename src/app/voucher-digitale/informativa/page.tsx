import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Informativa privacy — Voucher digitale",
  description:
    "Come trattiamo i dati e i documenti inviati con la candidatura al voucher digitale della Camera di Commercio Frosinone-Latina.",
  alternates: { canonical: "/voucher-digitale/informativa" },
  robots: { index: false },
};

/* NOTA INTERNA: testo da far validare al consulente privacy prima della
   messa online del modulo (aperto gia' a verbale nel vault). */

const SEZIONI: { titolo: string; corpo: React.ReactNode }[] = [
  {
    titolo: "Titolare del trattamento",
    corpo: (
      <>
        Altera S.r.l.s. (nome commerciale Seedera), Via A. Sebastiani 77, 04026
        Minturno (LT) — P.IVA e C.F. 03195120591 — email{" "}
        <a className="underline" href="mailto:info@altera.consulting">info@altera.consulting</a>,
        PEC alterasrls@pec.it.
      </>
    ),
  },
  {
    titolo: "Quali dati raccogliamo",
    corpo: (
      <>
        I dati che inserisci nel modulo: dati dell&apos;impresa (ragione
        sociale, partita IVA, contatti, PEC), dati del legale rappresentante
        (nome, codice fiscale, data e luogo di nascita, residenza), la
        descrizione del progetto e i documenti che carichi (visura camerale,
        polizza catastrofale, eventuali certificazioni).
      </>
    ),
  },
  {
    titolo: "Perché li trattiamo",
    corpo: (
      <>
        Per valutare i requisiti di ammissione al bando, predisporre insieme a
        te la domanda di contributo e ricontattarti sulla pratica. La base
        giuridica è l&apos;esecuzione di misure precontrattuali richieste
        dall&apos;interessato (art. 6.1.b GDPR) e, per i documenti caricati, il
        consenso espresso con la spunta del modulo (art. 6.1.a GDPR).
      </>
    ),
  },
  {
    titolo: "A chi possono essere comunicati",
    corpo: (
      <>
        Se decidi di presentare la domanda, i dati e i documenti necessari
        confluiscono nella pratica trasmessa alla Camera di Commercio
        Frosinone-Latina attraverso la piattaforma ReStart di InfoCamere. Non
        vendiamo i dati e non li usiamo per pubblicità.
      </>
    ),
  },
  {
    titolo: "Per quanto li conserviamo",
    corpo: (
      <>
        Per il tempo necessario a preparare e seguire la pratica e, se il
        contributo viene concesso, per i termini di conservazione previsti dal
        bando (5 anni dalla liquidazione per la documentazione di spesa). Se la
        candidatura non prosegue, i documenti vengono eliminati entro 12 mesi.
      </>
    ),
  },
  {
    titolo: "I tuoi diritti",
    corpo: (
      <>
        Puoi chiedere in ogni momento accesso, rettifica, cancellazione,
        limitazione, portabilità e opporti al trattamento, oltre a revocare il
        consenso (artt. 15-22 GDPR), scrivendo a{" "}
        <a className="underline" href="mailto:info@altera.consulting">info@altera.consulting</a>.
        Hai anche il diritto di reclamo al Garante per la protezione dei dati
        personali.
      </>
    ),
  },
  {
    titolo: "Dove stanno i dati",
    corpo: (
      <>
        Su sistemi gestiti direttamente da Altera S.r.l.s. in ambito UE. Non
        c&apos;è profilazione né alcun processo decisionale automatizzato.
      </>
    ),
  },
];

export default function InformativaVoucherPage() {
  return (
    <>
      <Navbar />
      <main>
        <section
          className="relative w-full flex items-end"
          style={{
            height: "280px",
            backgroundColor: "var(--color-yellow)",
            paddingTop: "80px",
          }}
        >
          <div className="container-content pb-10">
            <h1 className="text-h2 text-black font-normal uppercase select-none">
              Informativa privacy — Voucher digitale
            </h1>
          </div>
        </section>

        <section className="bg-white">
          <div
            className="container-content"
            style={{ paddingTop: "60px", paddingBottom: "120px", maxWidth: "860px" }}
          >
            <p
              className="leading-relaxed"
              style={{ color: "#5a5a5a", marginBottom: "40px" }}
            >
              Questa informativa riguarda i dati e i documenti inviati con il
              modulo di candidatura al Bando Voucher Doppia Transizione
              Digitale ed Ecologica 2026 della Camera di Commercio
              Frosinone-Latina.
            </p>
            {SEZIONI.map(s => (
              <div key={s.titolo} style={{ marginBottom: "32px" }}>
                <h2
                  className="font-medium uppercase tracking-wide"
                  style={{ color: "var(--color-black)", fontSize: "15px", marginBottom: "8px" }}
                >
                  {s.titolo}
                </h2>
                <p className="leading-relaxed" style={{ color: "var(--color-black)" }}>
                  {s.corpo}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
