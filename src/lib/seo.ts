/* Dati del sito e dell'azienda in un posto solo: li usano i metadata del
   layout, il sitemap, il manifest, i dati strutturati e l'informativa
   privacy. Se cambia la sede o la P.IVA si cambia qui, non in cinque file. */

export const SITE = {
  url: "https://seedera.it",
  nome: "Seedera",
  claim: "Prima il problema. Poi il sistema.",
  email: "info@seedera.it",
  linkedin: "https://www.linkedin.com/company/seedera",
} as const;

/* Dati di visura (CCIAA Frosinone–Latina, estratta il 02/07/2026). Seedera
   e' il nome commerciale: il titolare del trattamento e' Altera SRLs. */
export const AZIENDA = {
  ragioneSociale: "Altera Società a Responsabilità Limitata Semplificata",
  sigla: "Altera SRLs",
  piva: "03195120591",
  rea: "LT-311555",
  pec: "alterasrls@pec.it",
  indirizzo: "Via A. Sebastiani 77",
  cap: "04026",
  citta: "Minturno",
  provincia: "LT",
  paese: "IT",
} as const;

/* Ultimo aggiornamento dell'informativa privacy: in chiaro, perche' e' un
   dato che l'interessato deve poter leggere e verificare. */
export const PRIVACY_AGGIORNATA = "11 agosto 2026";

export const datiStrutturati = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE.url}/#organization`,
      name: SITE.nome,
      legalName: AZIENDA.ragioneSociale,
      alternateName: AZIENDA.sigla,
      url: SITE.url,
      logo: `${SITE.url}/icon-512.png`,
      image: `${SITE.url}/opengraph-image.png`,
      email: SITE.email,
      vatID: AZIENDA.piva,
      taxID: AZIENDA.piva,
      slogan: SITE.claim,
      description:
        "Product & Service Company: software su misura, second brain e AI, consulenza. Non eseguiamo brief, identifichiamo il problema e costruiamo il sistema che lo risolve.",
      address: {
        "@type": "PostalAddress",
        streetAddress: AZIENDA.indirizzo,
        postalCode: AZIENDA.cap,
        addressLocality: AZIENDA.citta,
        addressRegion: AZIENDA.provincia,
        addressCountry: AZIENDA.paese,
      },
      sameAs: [SITE.linkedin],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.nome,
      inLanguage: "it-IT",
      publisher: { "@id": `${SITE.url}/#organization` },
    },
  ],
};
