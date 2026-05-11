import type {Metadata} from 'next'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import HomeHero from '@/components/home/HomeHero'
import HomeFeaturedTrades from '@/components/home/HomeFeaturedTrades'
import HomeHowItWorks from '@/components/home/HomeHowItWorks'
import HomeEmployerCTA from '@/components/home/HomeEmployerCTA'
import { Building2, Droplets, GraduationCap, Search, Sun, Zap, Wind } from 'lucide-react'
import Link from 'next/link'  



export const metadata: Metadata = {
  title: 'Forge — Skilled Trades Career Platform',
  description:
    'Discover skilled trade careers, find apprenticeships, and connect with employers.',
}


export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <SiteNavbar />
      <HomeHero />
      <HomeFeaturedTrades />
      <HomeHowItWorks />
      <HomeEmployerCTA />
      <SiteFooter /> 
    </main>
  )
}