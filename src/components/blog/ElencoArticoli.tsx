import Link from "next/link";
import type { Articolo } from "@/lib/contenuti";
import { GRIGIO_TESTO } from "@/components/voucher/campi";
import { dataIt } from "@/lib/bandi";

/* L'elenco del blog. Una colonna, non una griglia di schede: sono testi da
   leggere, e la decisione che il lettore prende e' "questo si' o questo no",
   non "quale delle sei". */
export default function ElencoArticoli({ articoli }: { articoli: Articolo[] }) {
  if (articoli.length === 0) {
    return (
      <p style={{ color: GRIGIO_TESTO, fontSize: "17px" }}>
        Non c&apos;è ancora niente da leggere. Torna fra qualche giorno.
      </p>
    );
  }

  return (
    <div className="flex flex-col">
      {articoli.map((a, i) => (
        <article
          key={a.slug}
          style={{
            paddingTop: i === 0 ? 0 : "34px",
            paddingBottom: "34px",
            borderBottom: i === articoli.length - 1 ? "none" : "1px solid #e4e4e4",
          }}
        >
          <Link href={`/blog/${a.slug}`} className="block group">
            <p style={{ color: GRIGIO_TESTO, fontSize: "14px", marginBottom: "8px" }}>
              {a.pubblicato_il ? dataIt(a.pubblicato_il) : "senza data"}
              {a.autore ? ` · ${a.autore.nome}` : ""}
            </p>
            <h2
              className="font-normal leading-[1.15] group-hover:underline"
              style={{ fontSize: "var(--font-h3)", color: "var(--color-black)", textUnderlineOffset: "4px" }}
            >
              {a.titolo}
            </h2>
            {a.sommario && (
              <p style={{ color: GRIGIO_TESTO, fontSize: "17px", marginTop: "10px", maxWidth: "68ch" }}>
                {a.sommario}
              </p>
            )}
          </Link>
        </article>
      ))}
    </div>
  );
}
