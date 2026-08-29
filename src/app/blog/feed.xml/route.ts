import { articoli } from "@/lib/contenuti";
import { dataRfc822, metaArticolo } from "@/lib/blog";
import { SITE } from "@/lib/seo";

/* Un feed non e' un vezzo: e' come un articolo arriva a chi ci segue senza
   passare da un algoritmo. Le date vanno in RFC 822, che e' cio' che i lettori
   sanno leggere. */
const scappa = (t: string) =>
  t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export async function GET() {
  const elenco = await articoli();
  const voci = elenco
    .map((a) => {
      const { descrizione } = metaArticolo(a);
      const data = dataRfc822(a.pubblicato_il);
      return `    <item>
      <title>${scappa(a.titolo)}</title>
      <link>${SITE.url}/blog/${a.slug}</link>
      <guid isPermaLink="true">${SITE.url}/blog/${a.slug}</guid>
      <description>${scappa(descrizione)}</description>${data ? `
      <pubDate>${data}</pubDate>` : ""}${a.autore ? `
      <dc:creator>${scappa(a.autore.nome)}</dc:creator>` : ""}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${scappa(SITE.nome)} — Blog</title>
    <link>${SITE.url}/blog</link>
    <description>${scappa(SITE.claim)}</description>
    <language>it-IT</language>
    <atom:link href="${SITE.url}/blog/feed.xml" rel="self" type="application/rss+xml"/>
${voci}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "content-type": "application/rss+xml; charset=utf-8" },
  });
}
