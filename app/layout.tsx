import type { Metadata, Viewport } from 'next'
import { Inter, Noto_Serif, JetBrains_Mono, Tiny5 } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})


const notoSerif = Noto_Serif({
  subsets: ['latin'],
  variable: '--font-noto-serif',
  weight: ['400', '700'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

const tiny5 = Tiny5({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-tiny5',
})

export const metadata: Metadata = {
  title: 'Praxis | Evaluaciones de Ingeniería de Alta Fidelidad',
  description:
    'Operando en modo sigiloso. Praxis reemplaza las pruebas de código tradicionales con simulaciones inmersivas de entornos de trabajo reales para evaluar talento técnico.',
  generator: 'praxis',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0F0F0F',
}

import { SmoothScroll } from '@/components/smooth-scroll'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark bg-background">
      <body
        className={`${inter.variable} ${notoSerif.variable} ${jetbrainsMono.variable} ${tiny5.variable} font-sans antialiased`}
      >
        <SmoothScroll />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
