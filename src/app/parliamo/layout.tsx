import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apri una conversazione",
  description:
    "Niente brief, niente fasce di budget. Raccontaci il problema: capiamo insieme se il progetto ha senso per entrambi.",
  alternates: { canonical: "/parliamo" },
  openGraph: {
    title: "Apri una conversazione | Seedera",
    description:
      "Niente brief. Raccontaci il problema e capiamo insieme se il progetto ha senso per entrambi.",
    url: "/parliamo",
    type: "website",
  },
};

export default function ParliamoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
