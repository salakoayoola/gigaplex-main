import type { Metadata } from "next";
import { Nunito, Andika, Inter, Noto_Serif } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

const andika = Andika({
  variable: "--font-andika",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aunty Wúrà | Learn Yoruba Naturally",
  description: "Preserving African languages through engaging stories, songs, and nature. Join Aunty Wúrà on a journey to connect with your heritage.",
  keywords: ["Yoruba learning", "African languages", "kids education", "Yoruba for kids", "heritage language", "Aunty Wura"],
  openGraph: {
    title: "Aunty Wúrà | Learn Yoruba Naturally",
    description: "Preserving African languages through engaging stories, songs, and nature.",
    url: "https://auntywura.com", // Placeholder
    siteName: "Aunty Wúrà",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aunty Wúrà | Learn Yoruba Naturally",
    description: "Preserving African languages through engaging stories, songs, and nature.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} ${andika.variable} ${inter.variable} ${notoSerif.variable} antialiased bg-warm-cream text-deep-forest font-body`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Aunty Wúrà",
              "url": "https://auntywura.com",
              "logo": "https://auntywura.com/logo.png",
              "sameAs": [
                "https://twitter.com/auntywura",
                "https://instagram.com/auntywura",
                "https://youtube.com/auntywura"
              ],
              "description": "Preserving African languages through engaging, well-crafted learning experiences that connect learners to their heritage while exploring the natural world."
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
