import type { Metadata } from "next";
import { Lora, Cormorant_Garamond } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

// ArtisualDeco — kept for the wordmark/logo only
const artisualDeco = localFont({
  src: [
    { path: "./fonts/ArtisualDeco-Thin.otf", weight: "100", style: "normal" },
    { path: "./fonts/ArtisualDeco-ThinItalic.otf", weight: "100", style: "italic" },
    { path: "./fonts/ArtisualDeco-Light.otf", weight: "300", style: "normal" },
    { path: "./fonts/ArtisualDeco-LightItalic.otf", weight: "300", style: "italic" },
    { path: "./fonts/ArtisualDeco-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/ArtisualDeco-RegularItalic.otf", weight: "400", style: "italic" },
    { path: "./fonts/ArtisualDeco-Bold.otf", weight: "700", style: "normal" },
    { path: "./fonts/ArtisualDeco-BoldItalic.otf", weight: "700", style: "italic" },
    { path: "./fonts/ArtisualDeco-Black.otf", weight: "900", style: "normal" },
    { path: "./fonts/ArtisualDeco-BlackItalic.otf", weight: "900", style: "italic" },
  ],
  variable: "--font-artisual",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gempursuit.com"),
  title: {
    default: "Gem Pursuit — An Antique Jewellery Podcast",
    template: "%s | Gem Pursuit",
  },
  description:
    "Stories, history and obsessions from the world of antique and vintage jewellery, brought to you by Courtville Antiques in Dublin. Listen on Spotify, YouTube and your favourite podcast app.",
  keywords: [
    "antique jewellery podcast",
    "vintage jewellery",
    "Gem Pursuit",
    "Courtville Antiques",
    "Matthew Weldon",
    "podcast Dublin",
    "jewellery history",
  ],
  openGraph: {
    title: "Gem Pursuit — An Antique Jewellery Podcast",
    description:
      "An antique jewellery podcast from Courtville Antiques in Dublin. Listen on Spotify and YouTube.",
    url: "https://gempursuit.com",
    siteName: "Gem Pursuit",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gem Pursuit — An Antique Jewellery Podcast",
    description:
      "Stories, history and obsessions from the world of antique and vintage jewellery.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${lora.variable} ${cormorantGaramond.variable} ${artisualDeco.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        {children}
        <Script src="https://play.pod.co/embed/frame-v1.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
