import type { Metadata } from 'next'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import HomeHero from '@/components/home/HomeHero'
import HomeHowItWorks from '@/components/home/HomeHowItWorks'
import HomeEmployerCTA from '@/components/home/HomeEmployerCTA'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `${siteConfig.name} — Skilled-Trades Pathway Platform`,
  description:
    'A skilled-trades pathway platform with separate journeys for career seekers, employers, and training providers.',
}

export default function HomePage() {
  return (
    <main className="page-shell">
      <SiteNavbar />
      <HomeHero />
      <HomeHowItWorks />
      <HomeEmployerCTA />
      <SiteFooter />
    </main>
  )
}