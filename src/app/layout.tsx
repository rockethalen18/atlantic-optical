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
  title: "Atlantic Optical — Equipamiento Óptico Profesional",
  description: "Tu proveedor de confianza en equipo oftálmico y optométrico. Envío directo desde China a México con costos transparentes.",
  keywords: "foróptero, lentómetro, equipo oftálmico, auto refractómetro, lámpara de hendidura, egter, tonómetro, equipo optométrico, China, México",
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://atlanticoptical.com.mx' },
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: "Atlantic Optical — Equipamiento Óptico Profesional",
    description: "Envío directo desde China con costos variables en tiempo real.",
    type: "website",
    locale: "es_MX",
    siteName: "Atlantic Optical",
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
