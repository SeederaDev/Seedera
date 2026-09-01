import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ElencoArticoli from "@/components/blog/ElencoArticoli";
import { articoli } from "@/lib/contenuti";
import { colonna } from "@/components/voucher/campi";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Come funzionano davvero i bandi, i voucher e i sistemi che costruiamo. Testi scritti per chi deve decidere, non per riempire una pagina.",
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": `${SITE.url}/blog/feed.xml` },
  },
  openGraph: { title: "Blog | Seedera", url: "/blog", type: "website" },
};

export default async function PaginaBlog() {
  const elenco = await articoli();
  return (
    <>
      <Navbar />
      <main>
        <section
          className="relative w-full flex items-end"
          style={{ minHeight: "210px", backgroundColor: "var(--color-yellow)",
          paddingTop: "104px", paddingBottom: "24px" }}
        >
          <div className="container-content pb-6">
            <h1 className="text-h1 text-black font-normal uppercase select-none">Blog</h1>
          </div>
        </section>

        <section className="bg-white" style={{ paddingTop: "70px", paddingBottom: "110px" }}>
          <div className="container-content">
            <div style={colonna}>
              <ElencoArticoli articoli={elenco} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
