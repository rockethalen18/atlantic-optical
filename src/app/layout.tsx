import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Montserrat } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";
import ScrollRevealProvider from "@/components/ui/ScrollRevealProvider";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { AuthProvider } from "@/lib/AuthContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const montserrat = Montserrat({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://equipos.atlanticopticalgroup.com'),
  title: {
    default: 'Atlantic Optical International Limited — Equipamiento Oftálmico Profesional',
    template: '%s | Atlantic Optical',
  },
  description: 'Distribuidor directo de equipos oftálmicos: phorópteros, auto refractómetros, lámparas de hendidura, tonómetros y más. Envío directo desde China a toda Latinoamérica.',
  keywords: ['phoropter', 'lensometer', 'auto refractometer', 'slit lamp', 'ophthalmic equipment', 'equipos oftálmicos', 'equipo oftalmológico', 'lentes de prueba'],
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://equipos.atlanticopticalgroup.com',
    siteName: 'Atlantic Optical International',
    title: 'Atlantic Optical International Limited — Equipamiento Oftálmico Profesional',
    description: 'Distribuidor directo de equipos oftálmicos. Envío directo desde China a toda Latinoamérica.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Atlantic Optical International',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atlantic Optical International Limited',
    description: 'Distribuidor directo de equipos oftálmicos. Envío directo desde China a toda Latinoamérica.',
    images: ['/images/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-XXXXX');
            `,
          }}
        />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXX"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <AuthProvider>
          <LoadingScreen />
          <ScrollRevealProvider>
            <ScrollProgress />
            <Header />
            <main className="flex-1 pt-[128px] md:pt-[138px]">{children}</main>
            <Footer />
          </ScrollRevealProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
