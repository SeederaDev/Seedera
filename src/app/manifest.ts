import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

/* Con output: export queste route vanno dichiarate statiche a mano. */
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Seedera | Product & Service Company",
    short_name: SITE.nome,
    description: SITE.claim,
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    lang: "it",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
