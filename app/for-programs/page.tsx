import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Handshake,
  ListChecks,
  Users,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `For Programs — ${siteConfig.name}`,
  description:
    'Learn how training providers, apprenticeship programs, workforce organizations, and schools can participate in the skilled trades workforce marketplace.',
}

const benefits = [
  {
    title: 'Reach motivated career seekers',
    description:
      'Connect with people actively exploring skilled trades, apprenticeships, and training pathways.',
    icon: Users,
  },
  {
    title: 'Make your pathway easier to understand',
    description:
      'Help learners compare program type, trade focus, location, duration, requirements, and outcomes.',
    icon: ListChecks,
  },
  {
    title: 'Build a stronger local workforce pipeline',
    description:
      'Support a clearer bridge between career exploration, training readiness, and employer demand.',
    icon: Handshake,
  },
]

const participationSteps = [
  'Review your public listing information',
  'Claim or verify your program profile when provider accounts are available',
  'Keep requirements, dates, costs, and application links current',
  'Receive better-prepared prospective applicants over time',
]

export default function ForProgramsPage() {
  return (
    <main className="page-shell">
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative grid gap-12 py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="eyebrow-dark">For training programs</p>

            <h1 className="page-title-dark mt-6">
              Help future skilled workers find the right training pathway.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              {siteConfig.name} is being built as a skilled-trades workforce
              marketplace that helps people move from career discovery to real
              training, apprenticeships, and employment pathways.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/programs" className="btn-primary px-7 py-4">
                View program directory
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link href="/auth/sign-up" className="btn-outline-dark px-7 py-4">
                Create account
              </Link>
            </div>
          </div>

          <div className="card-dark p-6 shadow-2xl shadow-black/30">
            <div className="rounded-[1.5rem] bg-white p-6 text-slate-950">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                  <GraduationCap className="h-6 w-6" />
                </div>

                <div>
                  <p className="font-bold">Program directory layer</p>
                  <p className="text-sm text-slate-500">
                    Listings today · verified profiles later
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {participationSteps.map((step) => (
                  <div key={step} className="mini-card flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
                    <p className="leading-7 text-slate-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-light section-padding">
        <div className="section-shell">
          <div className="max-w-3xl">
            <p className="eyebrow">Why programs matter</p>

            <h2 className="section-title mt-6">
              Discovery is not enough. People need a next step.
            </h2>

            <p className="lead-text mt-5">
              Many people are interested in skilled trades but do not know where
              to begin. A clear program directory helps turn interest into action.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon

              return (
                <div key={benefit.title} className="card card-hover p-8">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                    <Icon className="h-7 w-7" />
                  </div>

                  <h3 className="mt-6 text-2xl font-bold tracking-tight">
                    {benefit.title}
                  </h3>

                  <p className="muted-text mt-4">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section-light pb-24">
        <div className="section-shell">
          <div className="dark-panel px-8 py-16 md:px-16">
            <div className="dark-panel-content grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
              <div>
                <p className="eyebrow-dark">Directory first, partnerships later</p>

                <h2 className="section-title-dark mt-4">
                  We are not claiming partnership unless a provider verifies it.
                </h2>

                <p className="lead-text-dark mt-5 max-w-3xl">
                  Current program listings are public directory information.
                  Future provider profiles can allow programs to claim, verify,
                  and manage their listings directly.
                </p>
              </div>

              <div className="card-dark">
                <h3 className="text-2xl font-bold">Future provider tools</h3>

                <ul className="mt-5 space-y-3 text-slate-300">
                  <li>Claim program listing</li>
                  <li>Update application requirements</li>
                  <li>Add deadlines and cohort dates</li>
                  <li>Receive better-prepared applicants</li>
                  <li>Connect with employers and workforce partners</li>
                </ul>

                <Link href="/auth/sign-up" className="btn-light mt-8">
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}