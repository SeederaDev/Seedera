import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LenisProvider } from "@/components/LenisProvider";
import Cursor from "@/components/Cursor";
import { SITE, datiStrutturati } from "@/lib/seo";

const bdoGrotesk = localFont({
  src: "../fonts/BDOGrotesk-VF.ttf",
  variable: "--font-bdo-grotesk",
  weight: "100 900", // Permette di utilizzare tutti i pesi (da Light a Black)
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
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
  applicationName: "Seedera",
  authors: [{ name: "Seedera", url: SITE.url }],
  creator: "Seedera",
  publisher: "Altera SRLs",
  category: "technology",
  /* Il sito e' servito anche da staging.seedera.it: senza canonical i due
     host sono contenuto duplicato agli occhi di Google. */
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Seedera | Product & Service Company",
    description:
      "Execution Partner Cognitivo. Non eseguiamo brief: identifichiamo il problema vero e costruiamo il sistema che lo risolve.",
    url: "/",
    type: "website",
    locale: "it_IT",
    siteName: "Seedera",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Seedera — prima il problema, poi il sistema",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Seedera | Product & Service Company",
    description:
      "Execution Partner Cognitivo. Non eseguiamo brief: identifichiamo il problema vero e costruiamo il sistema che lo risolve.",
    images: ["/opengraph-image.png"],
  },
  /* Il marchio della slide 8 del brand book, nelle due versioni: quadrato
     nero su chiaro, quadrato giallo su scuro (altrimenti su una barra
     scheda scura il nero sparisce). L'ICO resta per i lettori vecchi. */
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/icon.svg", type: "image/svg+xml" },
      {
        url: "/icon-dark.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={bdoGrotesk.variable} suppressHydrationWarning>
      <head>
        {/* Organization + WebSite: e' cosi' che il knowledge graph collega
            nome commerciale, ragione sociale, sede e profili. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(datiStrutturati) }}
        />
      </head>
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
