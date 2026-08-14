import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";
import { PROJECTS } from "./portfolio/[slug]/projectsData";

/* Con output: export queste route vanno dichiarate statiche a mano. */
export const dynamic = "force-static";

/* Export statico: questo file diventa /sitemap.xml a build time. Le schede
   progetto arrivano dalla stessa sorgente di generateStaticParams, cosi'
   non si aggiunge un progetto dimenticandosi la mappa. */
export default function sitemap(): MetadataRoute.Sitemap {
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

  const progetti: MetadataRoute.Sitemap = PROJECTS.map((p) => ({
    url: `${SITE.url}/portfolio/${p.slug}`,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...fisse, ...progetti];
}
