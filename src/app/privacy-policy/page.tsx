import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE, AZIENDA, PRIVACY_AGGIORNATA } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "Come Seedera (Altera SRLs) tratta i dati personali di chi visita seedera.it o ci scrive: cosa raccogliamo, perché, per quanto tempo e quali diritti hai.",
  alternates: { canonical: "/privacy-policy" },
  openGraph: {
    title: "Privacy policy | Seedera",
    description:
      "Titolare, dati trattati, base giuridica, conservazione e diritti dell'interessato.",
    url: "/privacy-policy",
    type: "article",
  },
  /* Pagina di servizio: si indicizza, ma non deve competere con le pagine
     che raccontano l'azienda. */
  robots: { index: true, follow: true },
};

/* Blocchi di testo: un elenco, non JSX ripetuto, cosi' l'informativa si
   legge e si aggiorna come un documento invece che come un componente. */
const SEZIONI: { titolo: string; corpo: React.ReactNode }[] = [
  {
    titolo: "1. Chi tratta i tuoi dati",
    corpo: (
      <>
        <p>
          Il titolare del trattamento è <strong>{AZIENDA.ragioneSociale}</strong>{" "}
          ({AZIENDA.sigla}), che opera con il nome commerciale{" "}
          <strong>Seedera</strong>, con sede in {AZIENDA.indirizzo},{" "}
          {AZIENDA.cap} {AZIENDA.citta} ({AZIENDA.provincia}), P.IVA e codice
          fiscale {AZIENDA.piva}, REA {AZIENDA.rea}.
        </p>
        <p>
          Per qualsiasi questione relativa ai dati personali puoi scrivere a{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a> oppure via PEC a{" "}
          <a href={`mailto:${AZIENDA.pec}`}>{AZIENDA.pec}</a>.
        </p>
        <p>
          Non è stato nominato un Responsabile della protezione dei dati: non
          ricorrono i casi previsti dall&apos;art. 37 del Regolamento (UE)
          2016/679 (di seguito, &laquo;GDPR&raquo;).
        </p>
      </>
    ),
  },
  {
    titolo: "2. Cosa raccoglie questo sito",
    corpo: (
      <>
        <p>
          <strong>Dati di navigazione.</strong> Come ogni sito, i server che lo
          ospitano registrano automaticamente alcuni dati tecnici: indirizzo IP,
          data e ora della richiesta, pagina richiesta, tipo di browser e
          sistema operativo. Servono a far funzionare il sito, a tenerlo sicuro
          e a diagnosticare i malfunzionamenti. Non li usiamo per identificare
          le persone e non li incrociamo con altre informazioni.
        </p>
        <p>
          <strong>Dati che ci mandi tu.</strong> Il modulo della pagina{" "}
          <a href="/parliamo">Parliamo</a> non trasmette nulla a un nostro
          server: compone un messaggio e apre il tuo programma di posta, che lo
          invia a {SITE.email}. Riceviamo quindi quello che scegli di scriverci
          — di norma nome, azienda, indirizzo e-mail e la descrizione del
          progetto — esattamente come se ci avessi mandato una mail.
        </p>
        <p>
          Non raccogliamo categorie particolari di dati (art. 9 GDPR) e non
          chiediamo dati di pagamento su questo sito.
        </p>
      </>
    ),
  },
  {
    titolo: "3. Cookie e tecnologie di tracciamento",
    corpo: (
      <>
        <p>
          <strong>Questo sito non installa cookie</strong>, né propri né di
          terze parti, e non usa strumenti di analisi statistica o di
          profilazione. Non salva informazioni nella memoria locale del browser
          e non carica risorse da domini esterni: i font e le immagini sono
          serviti dallo stesso dominio.
        </p>
        <p>
          Per questo non trovi un banner di consenso: non c&apos;è nulla da
          consentire. Se in futuro introdurremo strumenti di misurazione,
          questa pagina sarà aggiornata prima della loro attivazione e il
          consenso sarà richiesto quando previsto.
        </p>
      </>
    ),
  },
  {
    titolo: "4. Perché trattiamo i dati e con quale base giuridica",
    corpo: (
      <ul>
        <li>
          <strong>Far funzionare il sito e proteggerlo</strong> da abusi e
          malfunzionamenti — legittimo interesse del titolare (art. 6.1.f
          GDPR).
        </li>
        <li>
          <strong>Rispondere alle tue richieste</strong> e valutare insieme un
          possibile progetto — esecuzione di misure precontrattuali prese su
          tua richiesta (art. 6.1.b GDPR).
        </li>
        <li>
          <strong>Adempiere a obblighi di legge</strong>, fiscali e contabili,
          quando la conversazione diventa un rapporto contrattuale (art. 6.1.c
          GDPR).
        </li>
      </ul>
    ),
  },
  {
    titolo: "5. Chi può vedere i dati",
    corpo: (
      <>
        <p>
          I dati non sono diffusi e non sono ceduti a terzi per finalità
          commerciali. Possono trattarli, per nostro conto e su nostra
          istruzione, i fornitori che rendono possibile il servizio: il
          fornitore di hosting del sito e il fornitore del servizio di posta
          elettronica. Sono designati responsabili del trattamento ai sensi
          dell&apos;art. 28 GDPR.
        </p>
        <p>
          Se un fornitore tratta dati fuori dallo Spazio Economico Europeo, il
          trasferimento avviene sulla base di una decisione di adeguatezza
          della Commissione europea o delle clausole contrattuali standard.
        </p>
        <p>
          Internamente accedono ai dati solo le persone di Seedera che devono
          farlo per rispondere, autorizzate e istruite al trattamento.
        </p>
      </>
    ),
  },
  {
    titolo: "6. Per quanto tempo li conserviamo",
    corpo: (
      <ul>
        <li>
          <strong>Log di sistema:</strong> per il tempo tecnico necessario alla
          sicurezza e alla diagnostica, secondo le impostazioni del fornitore
          di hosting, e comunque per un periodo limitato.
        </li>
        <li>
          <strong>Messaggi e-mail:</strong> per il tempo necessario a gestire la
          richiesta. Se non ne nasce un rapporto, li cancelliamo entro
          ventiquattro mesi.
        </li>
        <li>
          <strong>Dati di rapporti contrattuali:</strong> dieci anni dalla
          conclusione, come impongono le norme civilistiche e fiscali.
        </li>
      </ul>
    ),
  },
  {
    titolo: "7. I tuoi diritti",
    corpo: (
      <>
        <p>
          In qualsiasi momento puoi chiederci l&apos;accesso ai tuoi dati, la
          rettifica, la cancellazione, la limitazione del trattamento, la
          portabilità, e puoi opporti ai trattamenti fondati sul legittimo
          interesse (artt. 15-22 GDPR). Basta una mail a{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>: rispondiamo entro
          un mese.
        </p>
        <p>
          Se ritieni che il trattamento violi il GDPR puoi proporre reclamo al
          Garante per la protezione dei dati personali (
          <a
            href="https://www.garanteprivacy.it"
            target="_blank"
            rel="noopener noreferrer"
          >
            garanteprivacy.it
          </a>
          ) o rivolgerti all&apos;autorità giudiziaria.
        </p>
      </>
    ),
  },
  {
    titolo: "8. Conferimento dei dati",
    corpo: (
      <p>
        Il conferimento dei dati di navigazione è tecnicamente necessario alla
        consultazione del sito. Scriverci è invece libero: senza i dati minimi
        di contatto, però, non possiamo risponderti.
      </p>
    ),
  },
  {
    titolo: "9. Aggiornamenti",
    corpo: (
      <p>
        Questa informativa può cambiare se cambia il sito o il modo in cui
        trattiamo i dati. La versione valida è sempre quella pubblicata a
        questo indirizzo, con la data di aggiornamento in testa alla pagina.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Stessa testata delle altre pagine interne: fascia gialla alta 350
            con l'H1 a filo del bordo inferiore. */}
        <section
          className="relative w-full flex items-end"
          style={{
            height: "350px",
            backgroundColor: "var(--color-yellow)",
            paddingTop: "80px",
          }}
        >
          <div className="container-content pb-10">
            <h1 className="text-h1 text-black font-normal uppercase select-none">
              Privacy policy
            </h1>
          </div>
        </section>

        <section className="bg-white">
          <div className="container-content pt-14 pb-20 md:pt-20 md:pb-28">
            <div className="flex flex-col md:grid md:grid-cols-[464fr_896fr] md:items-start">
              <div className="mb-8 md:mb-0">
                <span
                  className="inline-flex items-center border border-black text-black"
                  style={{
                    borderRadius: "5px",
                    padding: "5px 10px",
                    fontSize: "14px",
                    lineHeight: "20px",
                  }}
                >
                  Aggiornata al {PRIVACY_AGGIORNATA}
                </span>
              </div>

              <div className="informativa max-w-[70ch]">
                {/* Margine inline: la regola .informativa p ha piu' peso di
                    una utility mb-*, e il cappello resterebbe attaccato al
                    primo titolo. */}
                <p
                  className="text-[18px] leading-[26px]"
                  style={{ marginBottom: "40px" }}
                >
                  Informativa sul trattamento dei dati personali ai sensi degli
                  artt. 13 e 14 del Regolamento (UE) 2016/679. Vale per chi
                  naviga su {SITE.url.replace("https://", "")} e per chi ci
                  scrive.
                </p>

                {SEZIONI.map((s) => (
                  <section key={s.titolo} className="mb-10">
                    <h2 className="text-black font-bold text-[18px] leading-[24px] mb-3">
                      {s.titolo}
                    </h2>
                    {s.corpo}
                  </section>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
