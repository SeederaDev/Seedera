import type { NextConfig } from "next";

/* Il sito e' servito da Node, non esportato come file statici.
 *
 * Fino al 29/08/2026 c'era `output: 'export'`: i contenuti stavano in file del
 * repo e per cambiarne uno serviva un deploy. Con un blog non regge — si
 * scrive un articolo e non succede niente finche' qualcuno non ricostruisce.
 * Ora le pagine leggono dall'API (src/lib/contenuti.ts) e pubblicare invalida
 * la cache invece di far ripartire una build.
 *
 * Il prezzo, dichiarato: il sito ha una dipendenza a runtime dal backend.
 * La cache di Next la attenua (una pagina gia' resa continua a servirsi anche
 * se l'API non risponde) ma non la toglie.
 */
const nextConfig: NextConfig = {
  images: {
    /* I media caricati dal pannello li serve l'API, non il repo: senza questo
       `next/image` li rifiuta perche' vengono da un altro host. */
    remotePatterns: [
      { protocol: "https", hostname: "api.seedera.it", pathname: "/media/**" },
      { protocol: "http", hostname: "localhost", pathname: "/media/**" },
      { protocol: "http", hostname: "127.0.0.1", pathname: "/media/**" },
    ],
  },
};

export default nextConfig;
