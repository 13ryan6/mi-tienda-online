import type { Metadata } from 'next';
import './globals.css';
import { SITE_URL } from '@/lib/site-config';

const OG_IMAGE = 'https://i.ibb.co/Swq98SM4/Whats-App-Image-2026-03-11-at-7-24-15-AM.jpg';
const OG_DESCRIPTION = 'Flores eternas, ramos con chocolates, muñecas decoradas y cartas digitales. Sangolquí, Ecuador.';

// Metadatos conservados tal cual del index.html original (título, descripción, Open Graph, Twitter,
// verificación de Google Search Console, robots). Se agrega solo la URL canónica.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Detalles Creativos 🌸 | Sangolquí, Ecuador',
  description:
    'Detalles Creativos — Flores eternas, ramos, muñecas decoradas y cartas digitales personalizadas en Sangolquí, Ecuador.',
  keywords: ['flores eternas', 'ramos', 'muñecas barbie flores', 'regalos personalizados', 'Sangolquí', 'Ecuador'],
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  verification: { google: 'kPoJDUDRx7QQ_g7ufvgsUOHRVOt2mlTgaJ4xDUWl1qs' },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌸</text></svg>",
  },
  openGraph: {
    title: 'Detalles Creativos 🌸',
    description: OG_DESCRIPTION,
    type: 'website',
    url: `${SITE_URL}/`,
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
    locale: 'es_EC',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Detalles Creativos 🌸',
    description: OG_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Jost:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
