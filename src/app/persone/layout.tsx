import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chi siamo",
  description:
    "Le persone di Seedera: chi diagnostica, chi costruisce e chi resta dentro il progetto fino a quando il team del cliente sa fare da solo.",
  alternates: { canonical: "/persone" },
  openGraph: {
    title: "Chi siamo | Seedera",
    description:
      "Le persone di Seedera: non consulenti che consigliano da fuori, operatori che condividono gli obiettivi.",
    url: "/persone",
    type: "website",
  },
};

export default function PersoneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
