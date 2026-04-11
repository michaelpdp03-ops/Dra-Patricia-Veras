import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: 'swap', variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], display: 'swap', variable: '--font-playfair' });

export const metadata: Metadata = {
  metadataBase: new URL('https://drapatriciaveras.com'),
  title: "Dra. Patricia Veras | Cirujana General, Laparoscópica y Bariátrica",
  description: "Dra. Patricia Veras, especialista en Cirugía General, Laparoscópica y Bariátrica. Transforma tu salud, previene enfermedades y recupera tu calidad de vida.",
  keywords: ["Cirujano General", "Cirujana General", "Cirujano Bariátrico", "Cirugía Laparoscópica", "Obesidad", "Reflujo Gastroesofágico", "Dra. Patricia Veras", "Bariátrica República Dominicana"],
  openGraph: {
    title: "Dra. Patricia Veras | Cirujana General y Bariátrica",
    description: "Expertos en Cirugía General, Laparoscópica y Bariátrica. Transforma tu vida con un abordaje clínico seguro y probado.",
    url: "https://drapatriciaveras.com",
    siteName: "Dra. Patricia Veras - Cirugía",
    images: [
      {
        url: "/media/doctora/photo_2026-04-10_18-59-49.jpg",
        width: 800,
        height: 600,
      },
    ],
    locale: "es_ES",
    type: "website",
  },
};

// Schema.org para LocalBusiness/MedicalClinic
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  "name": "Clínica de la Dra. Patricia Veras",
  "image": "https://drapatriciaveras.com/media/doctora/photo_2026-04-10_18-59-49.jpg",
  "@id": "",
  "url": "https://drapatriciaveras.com",
  "telephone": "+123456789",
  "priceRange": "$$",
  "medicalSpecialty": [
    "General Surgery",
    "Bariatric Surgery"
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Tu Dirección Aquí",
    "addressLocality": "Tu Ciudad",
    "addressRegion": "Tu Estado",
    "postalCode": "00000",
    "addressCountry": "DO"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 18.4861,
    "longitude": -69.9312
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday"
    ],
    "opens": "09:00",
    "closes": "18:00"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
