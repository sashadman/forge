import type { Metadata } from 'next'
import { Barlow, DM_Sans, JetBrains_Mono } from 'next/font/google'
import ToastProvider from '@/components/providers/ToastProvider'
import ThemeProvider from '@/components/theme/ThemeProvider'
import './globals.css'
import './theme-overrides.css'

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-barlow',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Forge — Start Your Trade Career',
    template: '%s | Forge',
  },
  description:
    'Discover skilled trade careers, find apprenticeships, and connect with employers in the construction, electrical, HVAC, plumbing, welding, and solar industries.',
  keywords: [
    'skilled trades',
    'apprenticeship',
    'electrician',
    'HVAC',
    'plumbing',
    'welding',
    'solar',
    'trade career',
    'trade school',
  ],
  authors: [{ name: 'Forge Platform' }],
  creator: 'Forge Platform',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://getforge.com',
    siteName: 'Forge',
    title: 'Forge — Start Your Trade Career',
    description: "The career platform for America's skilled trades.",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forge — Start Your Trade Career',
    description: "The career platform for America's skilled trades.",
    creator: '@getforge',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${barlow.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-white font-body text-forge-navy antialiased">
        <ThemeProvider>
          {children}
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  )
}