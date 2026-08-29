#!/usr/bin/env node
/**
 * Prima di costruire: l'API risponde?
 *
 * Le pagine leggono i contenuti da li'. Se l'API non risponde, `contenuti.ts`
 * ripiega su elenchi vuoti — giusto a runtime, dove una pagina gia' resa
 * continua a servirsi — ma **in compilazione produrrebbe un sito con le pagine
 * vuote**, che e' peggio che non pubblicare: il vecchio sito almeno funzionava.
 *
 * Quindi qui si fallisce, forte e chiaro.
 */
const API = process.env.API_BASE ?? "http://127.0.0.1:3001";

try {
  const res = await fetch(`${API}/api/bandi/pubblici`, { signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const { bandi } = await res.json();
  console.log(`API raggiungibile su ${API} — ${bandi.length} bandi pubblicabili`);
} catch (err) {
  console.error(`\nAPI non raggiungibile su ${API}: ${err.message}`);
  console.error("La build si ferma qui: un sito costruito senza contenuti e' peggio di uno vecchio che funziona.");
  console.error("Controlla che il backend sia acceso, o correggi API_BASE.\n");
  process.exit(1);
}
