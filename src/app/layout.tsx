import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";
import ScrollRevealProvider from "@/components/ui/ScrollRevealProvider";
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
  title: "Atlantic Optical Internacional â€” Equipamiento Ã“ptico Profesional",
  description: "Atlantic Optical Internacional S.A. â€” Empresa dedicada a la comercializaciÃ³n internacional de productos Ã³pticos generales y marcas propias. EnvÃ­o directo desde China a MÃ©xico.",
  keywords: "forÃ³ptero, lentÃ³metro, equipo oftÃ¡lmico, auto refractÃ³metro, lÃ¡mpara de hendidura, tonÃ³metro, equipo optomÃ©trico, monturas, lentes de sol, Atlantic Optical, PanamÃ¡, MÃ©xico",
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://equipos.atlanticopticalgroup.com' },
  icons: { icon: '/images/logo-atlantic-retina.png' },
  openGraph: {
    title: "Atlantic Optical Internacional â€” Equipamiento Ã“ptico Profesional",
    description: "Empresa dedicada a la comercializaciÃ³n internacional de productos Ã³pticos generales y marcas propias.",
    type: "website",
    locale: "es_MX",
    siteName: "Atlantic Optical Internacional S.A.",
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
        <ScrollRevealProvider>
          <ScrollProgress />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ScrollRevealProvider>
      </body>
    </html>
  );
}

