import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  HardHat,
  Users,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `For Employers — ${siteConfig.name}`,
  description:
    'Learn how skilled-trades employers can use the workforce marketplace to build stronger talent pipelines.',
}

const benefits = [
  {
    title: 'Reach career-ready candidates',
    description:
      'Connect with people who are actively exploring skilled trades, saving career paths, and preparing for training.',
    icon: Users,
  },
  {
    title: 'Build a future workforce pipeline',
    description:
      'Move beyond one-time job posts by connecting with learners earlier in their training and career journey.',
    icon: ClipboardList,
  },
  {
    title: 'Partner with training pathways',
    description:
      'Create stronger bridges between employers, apprenticeships, workforce programs, and local talent.',
    icon: GraduationCap,
  },
]

const employerUseCases = [
  'List entry-level skilled-trades opportunities',
  'Share apprenticeship or trainee openings',
  'Connect with people who saved related trades or programs',
  'Build visibility with career seekers before they apply',
  'Support local workforce-development efforts',
]

export default function ForEmployersPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <SiteNavbar />

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.25),transparent_34rem)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14),transparent_30rem)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-50 to-transparent" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-orange-300">
              For employers
            </p>

            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
              Build a stronger pipeline for skilled-trades talent.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              {siteConfig.name} is being built to help employers connect with
              career seekers earlier — before they are lost, confused, or pushed
              away from the skilled trades.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/programs"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-600 px-7 py-4 font-semibold text-white hover:bg-orange-700"
              >
                View training pathways
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/auth/sign-up"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-4 font-semibold text-white hover:bg-white/10"
              >
                Create account
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="rounded-[1.5rem] bg-white p-6 text-slate-950">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                  <BriefcaseBusiness className="h-6 w-6" />
                </div>

                <div>
                  <p className="font-bold">Employer pipeline layer</p>
                  <p className="text-sm text-slate-500">
                    Visibility today · workforce matching later
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {employerUseCases.map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
                    <p className="leading-7 text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-orange-700">
              Why employers matter
            </p>

            <h2 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
              The workforce gap will not be solved by job posts alone.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Skilled-trades employers need better ways to reach people earlier,
              explain real career pathways, and connect with training programs
              that prepare future workers.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon

              return (
                <div
                  key={benefit.title}
                  className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                    <Icon className="h-7 w-7" />
                  </div>

                  <h3 className="mt-6 text-2xl font-bold tracking-tight">
                    {benefit.title}
                  </h3>

                  <p className="mt-4 leading-7 text-slate-600">
                    {benefit.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="overflow-hidden rounded-[2.25rem] bg-slate-950 px-8 py-16 text-white shadow-2xl shadow-slate-900/20 md:px-16">
            <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-orange-400">
                  Marketplace direction
                </p>

                <h2 className="mt-4 text-4xl font-bold tracking-tight">
                  From career discovery to employer opportunity.
                </h2>

                <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
                  The long-term goal is to help employers connect with people
                  who have already explored trades, saved pathways, and shown
                  interest in specific career directions.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-300 ring-1 ring-orange-400/20">
                  <HardHat className="h-7 w-7" />
                </div>

                <h3 className="mt-6 text-2xl font-bold">
                  Future employer tools
                </h3>

                <ul className="mt-5 space-y-3 text-slate-300">
                  <li>Employer profiles</li>
                  <li>Entry-level opportunity listings</li>
                  <li>Apprenticeship and trainee postings</li>
                  <li>Candidate interest signals</li>
                  <li>Connections with program providers</li>
                </ul>

                <Link
                  href="/auth/sign-up"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-slate-950 hover:bg-slate-100"
                >
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