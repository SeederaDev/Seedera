import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team",
  description:
    "Le persone che operano dentro i progetti Seedera: prodotto e tech, AI e automazione, project management, progetti culturali.",
  openGraph: {
    title: "Team | Seedera",
    description:
      "Poche persone che operano dentro i progetti, non un organigramma che li osserva da fuori.",
    type: "website",
  },
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
