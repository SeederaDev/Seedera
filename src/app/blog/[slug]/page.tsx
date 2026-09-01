import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { articoli, articolo as leggiArticolo } from "@/lib/contenuti";
import { inHtml, metaArticolo } from "@/lib/blog";
import { colonna, GRIGIO_TESTO } from "@/components/voucher/campi";
import { dataIt } from "@/lib/bandi";
import { SITE } from "@/lib/seo";

export async function generateStaticParams() {
  return (await articoli()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = await leggiArticolo(slug);
  if (!a) return { title: "Articolo" };

  const { titolo, descrizione } = metaArticolo(a);
  const immagini = a.copertina ? [a.copertina] : undefined;
  return {
    title: titolo,
    description: descrizione,
    alternates: { canonical: `/blog/${a.slug}` },
    openGraph: {
      title: `${titolo} | Seedera`,
      description: descrizione,
      url: `/blog/${a.slug}`,
      type: "article",
      publishedTime: a.pubblicato_il ?? undefined,
      authors: a.autore ? [a.autore.nome] : undefined,
      images: immagini,
    },
    twitter: { card: "summary_large_image", title: titolo, description: descrizione, images: immagini },
  };
}

export default async function PaginaArticolo({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = await leggiArticolo(slug);
  /* Una bozza non esiste, per chi guarda da fuori: l'API risponde 404 e qui
     finisce allo stesso modo di uno slug inventato. */
  if (!a) notFound();

  const { titolo, descrizione } = metaArticolo(a);
  const datiArticolo = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: titolo,
    description: descrizione,
    datePublished: a.pubblicato_il ?? undefined,
    image: a.copertina ? `${SITE.url}${a.copertina}` : undefined,
    author: a.autore
      ? { "@type": "Person", name: a.autore.nome, jobTitle: a.autore.ruolo ?? undefined }
      : { "@type": "Organization", name: SITE.nome },
    publisher: { "@id": `${SITE.url}/#organization` },
    mainEntityOfPage: `${SITE.url}/blog/${a.slug}`,
    keywords: a.tag.length ? a.tag.join(", ") : undefined,
  };

  return (
    <>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datiArticolo) }}
      />
      <main>
        <section
          className="relative w-full flex items-end"
          style={{ minHeight: "210px", backgroundColor: "var(--color-yellow)",
          paddingTop: "104px", paddingBottom: "24px" }}
        >
          <div className="container-content pb-6">
            <div style={colonna}>
              <Link href="/blog" style={{ color: GRIGIO_TESTO, fontSize: "14px" }}>
                ← Blog
              </Link>
              <h1
                className="text-black font-normal leading-[1.1]"
                style={{ fontSize: "var(--font-h2)", marginTop: "6px" }}
              >
                {a.titolo}
              </h1>
            </div>
          </div>
        </section>

        <article className="bg-white" style={{ paddingTop: "48px", paddingBottom: "110px" }}>
          <div className="container-content">
            <div style={colonna}>
              <p style={{ color: GRIGIO_TESTO, fontSize: "14px", marginBottom: "28px" }}>
                {a.pubblicato_il ? dataIt(a.pubblicato_il) : "senza data"}
                {a.autore ? ` · ${a.autore.nome}${a.autore.ruolo ? `, ${a.autore.ruolo}` : ""}` : ""}
              </p>

              {a.copertina && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={a.copertina}
                  alt=""
                  style={{ width: "100%", borderRadius: "10px", marginBottom: "36px" }}
                />
              )}

              {a.sommario && (
                <p style={{ fontSize: "20px", lineHeight: 1.55, marginBottom: "30px", maxWidth: "68ch" }}>
                  {a.sommario}
                </p>
              )}

              {/* Il corpo e' gia' ripulito da `inHtml`: quello che arriva qui e'
                  un sottoinsieme dichiarato di tag, senza script ne' gestori. */}
              <div className="corpo-articolo" dangerouslySetInnerHTML={{ __html: inHtml(a.corpo) }} />

              {a.tag.length > 0 && (
                <p style={{ color: GRIGIO_TESTO, fontSize: "14px", marginTop: "44px" }}>
                  {a.tag.join(" · ")}
                </p>
              )}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
