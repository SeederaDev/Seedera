import { statoBando, dataIt, type Bando } from "@/lib/bandi";
import { GRIGIO_TESTO } from "./campi";

/* Sotto il titolo si dice **subito** in che momento del bando siamo: chi arriva
   da un annuncio deve capire in tre secondi se puo' ancora candidarsi. I giorni
   li conta il browser dalle date del build, cosi' il conto alla rovescia non
   invecchia fra una pubblicazione e l'altra. */
function statoInParole(bando: Bando, oggi: string): string {
  const { stato, giorni } = statoBando(bando, oggi);
  if (stato === "esaurito") return "I fondi di questo bando sono esauriti.";
  if (stato === "chiuso") return `Le domande si sono chiuse il ${dataIt(bando.chiusura)}.`;
  if (stato === "in_apertura") {
    return giorni === 0
      ? `Lo sportello apre oggi, ${dataIt(bando.apertura)}.`
      : `Lo sportello apre il ${dataIt(bando.apertura)}: mancano ${giorni} giorni.`;
  }
  if (stato === "aperto" && bando.chiusura) {
    return giorni === 0
      ? `Ultimo giorno per presentare la domanda: oggi, ${dataIt(bando.chiusura)}.`
      : `Domande aperte fino al ${dataIt(bando.chiusura)}: restano ${giorni} giorni.`;
  }
  if (stato === "aperto") return "Domande aperte fino a esaurimento fondi.";
  return "Le date di questo bando non sono ancora state pubblicate.";
}

export default function Testata({ bando, oggi }: { bando: Bando; oggi: string }) {
  return (
    <section
      className="relative w-full flex items-end"
      style={{ height: "210px", backgroundColor: "var(--color-yellow)", paddingTop: "80px" }}
    >
      <div className="container-content pb-6">
        <h1 className="text-h1 text-black font-normal uppercase select-none">
          Voucher digitale — {bando.camera}
        </h1>
        <p style={{ color: GRIGIO_TESTO, marginTop: "6px", fontSize: "15px" }}>
          {statoInParole(bando, oggi)}
        </p>
      </div>
    </section>
  );
}
