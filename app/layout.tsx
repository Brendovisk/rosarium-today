import type { Metadata } from 'next'
import { Cormorant_Garamond, Source_Serif_4, Cinzel, Inter } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-source-serif',
  display: 'swap',
})

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-cinzel',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Rosarium Today',
  description: 'A sacred rosary prayer experience',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      suppressHydrationWarning
      className={`${cormorant.variable} ${sourceSerif.variable} ${cinzel.variable} ${inter.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
