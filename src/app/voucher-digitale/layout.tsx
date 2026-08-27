import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Voucher digitale 2026",
  description:
    "Candidatura al voucher digitale della Camera di Commercio Frosinone-Latina: fino a 10.000 € a fondo perduto. Carica i documenti, al resto pensiamo noi.",
  alternates: { canonical: "/voucher-digitale" },
  openGraph: {
    title: "Voucher digitale 2026 | Seedera",
    description:
      "Fino a 10.000 € a fondo perduto per la digitalizzazione. Carica i documenti, al resto pensiamo noi.",
    url: "/voucher-digitale",
    type: "website",
  },
};

export default function VoucherDigitaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
