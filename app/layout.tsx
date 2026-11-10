import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans, DM_Mono, Caveat } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Intro } from "@/components/Intro";
import { JsonLd } from "@/components/JsonLd";
import { graph, organizationLd, personLd, websiteLd } from "@/lib/seo";

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  variable: "--font-fraunces",
  display: "swap",
});
const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument", display: "swap" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dm-mono", display: "swap" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}: college advice from a Nigerian boarding school to a US degree`,
    template: `%s | ${site.name}`,
  },
  description:
    "Yeyeside Talabi went from a boarding school in Nigeria to graduating high school in Texas at 16, then community college, a private college and grad school. Everything she learned about getting into college and through it, shelved by topic.",
  applicationName: site.name,
  authors: [{ name: site.author.name, url: `${site.url}/about` }],
  creator: site.author.name,
  publisher: site.legalName,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    url: site.url,
  },
  twitter: { card: "summary_large_image", creator: "@Modishye", site: "@Modishye" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Zoom stays enabled. The old site blocked it, which fails WCAG 1.4.4.
  themeColor: "#fbf7ee",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${instrument.variable} ${dmMono.variable} ${caveat.variable}`}>
      <head>
        <script
          // Decides before first paint whether the intro card plays, so there is no flash.
          dangerouslySetInnerHTML={{
            __html: `try{if(!sessionStorage.getItem('modishye-intro')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.dataset.intro='1';sessionStorage.setItem('modishye-intro','1')}}catch(e){}`,
          }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Intro />
        <Header />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <JsonLd data={graph(organizationLd(), personLd(), websiteLd())} />
      </body>
    </html>
  );
}
