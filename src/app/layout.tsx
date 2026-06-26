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
  title: "Atlantic Optical Internacional — Equipamiento Óptico Profesional",
  description: "Atlantic Optical Internacional S.A. — Empresa dedicada a la comercialización internacional de productos ópticos generales y marcas propias. Envío directo desde China a México.",
  keywords: "foróptero, lentómetro, equipo oftálmico, auto refractómetro, lámpara de hendidura, tonómetro, equipo optométrico, monturas, lentes de sol, Atlantic Optical, Panamá, México",
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://atlanticoptical.com.mx' },
  icons: { icon: '/images/logo-atlantic-retina.png' },
  openGraph: {
    title: "Atlantic Optical Internacional — Equipamiento Óptico Profesional",
    description: "Empresa dedicada a la comercialización internacional de productos ópticos generales y marcas propias.",
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
