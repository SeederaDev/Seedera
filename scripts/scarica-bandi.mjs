/* Il sito e' un export statico: i dati dei bandi entrano a build-time, non a
   runtime. Si lancia a mano dopo aver corretto qualcosa nel pannello, e il JSON
   si committa — cosi' la build resta riproducibile anche con l'API spenta. */
import { writeFileSync } from "node:fs";

const API = process.env.BANDI_API ?? "http://localhost:3001/api/bandi/pubblici";

const res = await fetch(API);
if (!res.ok) {
  console.error(`API dei bandi: HTTP ${res.status} su ${API}`);
  process.exit(1);
}
const { bandi } = await res.json();
if (!Array.isArray(bandi)) {
  console.error("risposta inattesa: manca l'elenco dei bandi");
  process.exit(1);
}
writeFileSync("src/dati/bandi.json", JSON.stringify(bandi, null, 2) + "\n");
console.log(`${bandi.length} bandi pubblicabili scritti in src/dati/bandi.json`);
