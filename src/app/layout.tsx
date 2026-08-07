import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LenisProvider } from "@/components/LenisProvider";
import Cursor from "@/components/Cursor";

const bdoGrotesk = localFont({
  src: "../fonts/BDOGrotesk-VF.ttf",
  variable: "--font-bdo-grotesk",
  weight: "100 900", // Permette di utilizzare tutti i pesi (da Light a Black)
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://seedera.it"),
  title: {
    default: "Seedera | Product & Service Company",
    template: "%s | Seedera",
  },
  description:
    "Rendiamo le imprese capaci di fare cose che prima non sapevano fare. Software su misura, second brain e AI, consulenza: prima il problema, poi il sistema.",
  keywords: [
    "execution partner",
    "software su misura",
    "second brain aziendale",
    "agenti AI",
    "product company",
    "startup studio",
    "co-investimento",
    "Seedera",
  ],
  openGraph: {
    title: "Seedera | Product & Service Company",
    description:
      "Execution Partner Cognitivo. Non eseguiamo brief: identifichiamo il problema vero e costruiamo il sistema che lo risolve.",
    type: "website",
    locale: "it_IT",
    siteName: "Seedera",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={bdoGrotesk.variable} suppressHydrationWarning>
      <body
        className="antialiased"
        suppressHydrationWarning
      >
        <Cursor />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
