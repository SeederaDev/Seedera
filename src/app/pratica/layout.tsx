import type { Metadata } from "next";

/* Non si indicizza: la pagina non ha senso senza il token di qualcuno, e un
   motore di ricerca che la trovasse mostrerebbe solo la schermata "apri dal
   link che ti abbiamo mandato". */
export const metadata: Metadata = {
  title: "La tua pratica",
  robots: { index: false, follow: false },
};

export default function LayoutPratica({ children }: { children: React.ReactNode }) {
  return children;
}
