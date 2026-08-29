import { revalidateTag } from "next/cache";
import { timingSafeEqual } from "node:crypto";

/**
 * Il pannello chiama qui quando pubblica qualcosa, e la pagina interessata si
 * rigenera alla prossima richiesta. E' cio' che sostituisce la build: prima
 * cambiare un contenuto voleva dire ricostruire e ripubblicare il sito.
 *
 * Il segreto si confronta a lunghezza costante: un confronto normale impiega
 * tempo diverso a seconda di quanti caratteri coincidono, e da quella
 * differenza si ricostruisce il segreto un carattere per volta.
 */
function segretoValido(dato: string, atteso: string) {
  const a = Buffer.from(dato);
  const b = Buffer.from(atteso);
  if (a.length !== b.length) {
    /* Lunghezze diverse: si confronta comunque qualcosa, o il tempo di risposta
       direbbe che la lunghezza e' sbagliata. */
    timingSafeEqual(b, b);
    return false;
  }
  return timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  const atteso = process.env.SEGRETO_RIGENERA ?? "";
  const dato = req.headers.get("x-segreto") ?? "";
  if (!atteso || !segretoValido(dato, atteso)) {
    return Response.json({ ok: false, errore: "non autorizzato" }, { status: 401 });
  }

  let etichette: unknown;
  try {
    ({ etichette } = await req.json());
  } catch {
    return Response.json({ ok: false, errore: "corpo non leggibile" }, { status: 400 });
  }
  if (!Array.isArray(etichette) || etichette.some(e => typeof e !== "string")) {
    return Response.json({ ok: false, errore: "servono le etichette da invalidare" }, { status: 400 });
  }

  /* Next 16 vuole anche il profilo di cache: `max` significa "quel contenuto e'
     cambiato davvero, butta via tutto quello che ne dipende". E' l'unico che ha
     senso qui — chi pubblica si aspetta di vedere la modifica, non una versione
     un po' meno vecchia. */
  for (const e of etichette) revalidateTag(e, "max");
  return Response.json({ ok: true, invalidate: etichette });
}
