import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";
import ScrollRevealProvider from "@/components/ui/ScrollRevealProvider";
import DynamicPopup from "@/components/ui/DynamicPopup";
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
  title: "Atlantic Optical International Limited — Equipamiento Óptico Profesional",
  description: "Atlantic Optical International Limited — Empresa dedicada a la comercialización internacional de productos ópticos generales y marcas propias. Envío directo desde China a México.",
  keywords: "foróptero, lentómetro, equipo oftálmico, auto refractómetro, lámpara de hendidura, tónómetro, equipo optométrico, monturas, lentes de sol, Atlantic Optical International, Panamá, México",
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://equipos.atlanticopticalgroup.com' },
  icons: { icon: '/favicon.png', apple: '/images/logo-light.png' },
  openGraph: {
    title: "Atlantic Optical International Limited — Equipamiento Óptico Profesional",
    description: "Empresa dedicada a la comercialización internacional de productos ópticos generales y marcas propias.",
    type: "website",
    locale: "es_MX",
    siteName: "Atlantic Optical International Limited",
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
        <AuthProvider>
        <ScrollRevealProvider>
          <ScrollProgress />
          <Header />
          <main className="flex-1 pt-[126px]">{children}</main>
          <Footer />
          <DynamicPopup />
        </ScrollRevealProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

