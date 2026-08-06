import type { Metadata } from "next";

export const metadata: Metadata = {
  /* Il template va ridichiarato: un title stringa in un layout intermedio
     azzera quello ereditato dal root per i segmenti figli. */
  title: { default: "Portfolio", template: "%s | Seedera" },
  description:
    "I progetti in cui abbiamo costruito il sistema, non solo il deliverable. Ogni lavoro qui è nato da una diagnosi, non da un brief.",
  openGraph: {
    title: "Portfolio | Seedera",
    description:
      "I progetti in cui abbiamo costruito il sistema, non solo il deliverable.",
    type: "website",
  },
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
