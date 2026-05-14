import type { Metadata } from 'next'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import HomeHero from '@/components/home/HomeHero'
import HomeHowItWorks from '@/components/home/HomeHowItWorks'
import HomeFeaturedTrades from '@/components/home/HomeFeaturedTrades'
import HomeEmployerCTA from '@/components/home/HomeEmployerCTA'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `${siteConfig.name} — Skilled Trades Workforce Marketplace`,
  description:
    'A skilled-trades workforce marketplace helping people discover career paths, take a career quiz, save trades, and connect with future training and employer opportunities.',
}

export default function HomePage() {
  return (
    <main className="page-shell">
      <SiteNavbar />
      <HomeHero />
      <HomeHowItWorks />
      <HomeFeaturedTrades />
      <HomeEmployerCTA />
      <SiteFooter />
    </main>
  )
}