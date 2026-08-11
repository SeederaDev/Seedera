import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

/* Con output: export queste route vanno dichiarate statiche a mano. */
export const dynamic = "force-static";

/* Export statico: questo file diventa /robots.txt a build time.
   Lo staging non si blocca da qui (stesso file su entrambi gli host): va
   escluso a livello di server, oppure ci pensa il canonical. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
