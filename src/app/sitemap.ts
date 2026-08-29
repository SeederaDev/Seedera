import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";
import { bandiPubblici, progetti } from "@/lib/contenuti";

/* Le schede progetto arrivano dalla stessa sorgente di generateStaticParams,
   cosi' non si pubblica un progetto dimenticandosi la mappa. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fisse: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE.url}/portfolio`, changeFrequency: "monthly", priority: 0.8 },
    /* pagina persone nascosta: fuori dalla mappa finche' non torna online */
    { url: `${SITE.url}/parliamo`, changeFrequency: "yearly", priority: 0.7 },
    {
      url: `${SITE.url}/privacy-policy`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  /* Una voce per ogni bando pubblicabile, piu' la pagina pilastro che le
     raccoglie. I bandi non censiti non escono dall'API, quindi non finiscono in
     mappa: una pagina che non esiste non si dichiara. */
  const voucher: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/voucher-digitale`, changeFrequency: "weekly", priority: 0.9 },
    ...(await bandiPubblici()).map((b) => ({
      url: `${SITE.url}/voucher-digitale/${b.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];

  /* Solo i progetti pubblicati: non escono dall'API, quindi non si dichiara
     una pagina che non c'e'. */
  const schede: MetadataRoute.Sitemap = (await progetti()).map((p) => ({
    url: `${SITE.url}/portfolio/${p.slug}`,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...fisse, ...voucher, ...schede];
}
