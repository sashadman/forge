import Link from 'next/link'
import {
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  Hammer,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { siteConfig } from '@/config/site'

const marketplaceSteps = [
  {
    title: 'Discover',
    description: 'Explore trade careers and understand what the work really looks like.',
    icon: Search,
    href: '/trades',
  },
  {
    title: 'Prepare',
    description: 'Compare training pathways, apprenticeships, and career requirements.',
    icon: GraduationCap,
    href: '/programs',
  },
  {
    title: 'Connect',
    description: 'Move toward programs, employers, and real workforce opportunities.',
    icon: BriefcaseBusiness,
    href: '/opportunities',
  },
]

const platformLayers = [
  {
    title: 'Personalized trade matches',
    description: 'Take the quiz, compare trades, and save career paths.',
    icon: ShieldCheck,
  },
  {
    title: 'Training pathway layer',
    description: 'Explore real programs, apprenticeships, and workforce pathways.',
    icon: GraduationCap,
  },
  {
    title: 'Employer ecosystem',
    description: 'Prepare for future employer opportunities and workforce connections.',
    icon: BriefcaseBusiness,
  },
]

export default function HomeHero() {
  return (
    <section className="hero-dark">
      <div className="hero-fade" />

      <div className="section-shell relative grid gap-12 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
        <div>
          <p className="eyebrow-dark items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Skilled trades workforce marketplace
          </p>

          <h1 className="mt-6 max-w-4xl text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Build a real path into the skilled trades.
          </h1>

          <p className="lead-text-dark mt-6 max-w-3xl">
            {siteConfig.name} helps career seekers discover skilled trades, take a
            career-fit quiz, save promising paths, and prepare for training,
            apprenticeships, and employer opportunities.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/quiz" className="btn-primary px-7 py-4">
              Start career quiz
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link href="/trades" className="btn-outline-dark px-7 py-4">
              Explore trades
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {marketplaceSteps.map((step) => {
              const Icon = step.icon

              return (
                <Link
                  key={step.title}
                  href={step.href}
                  className="card-dark group transition hover:-translate-y-1 hover:border-orange-400/30"
                >
                  <Icon className="h-6 w-6 text-orange-300" />

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="font-bold text-white">{step.title}</p>
                    <ArrowRight className="h-4 w-4 text-orange-300 transition group-hover:translate-x-1" />
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {step.description}
                  </p>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="rounded-[2.25rem] border border-white/10 bg-white/[0.08] p-5 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="rounded-[1.75rem] bg-white/95 p-6 text-slate-950 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                <Hammer className="h-6 w-6" />
              </div>

              <div>
                <p className="font-bold">Marketplace foundation</p>
                <p className="text-sm text-slate-500">
                  Career seekers · programs · employers
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {platformLayers.map((layer) => {
                const Icon = layer.icon

                return (
                  <div key={layer.title} className="mini-card">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-orange-600" />
                      <p className="font-semibold">{layer.title}</p>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {layer.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}