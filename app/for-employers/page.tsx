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
  'List entry-level jobs, apprenticeships, and trainee roles',
  'Share apprenticeship or trainee openings',
  'Connect with people who saved related jobs or programs',
  'Build visibility with career seekers before they apply',
  'Support local workforce-development efforts',
]

const futureTools = [
  'Employer profiles',
  'Entry-level jobs and apprenticeship listings',
  'Apprenticeship and trainee postings',
  'Candidate interest signals',
  'Connections with program providers',
]

export default function ForEmployersPage() {
  return (
    <main className="page-shell">
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative grid gap-12 py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="eyebrow-dark">For employers</p>

            <h1 className="page-title-dark mt-6">
              Build a stronger pipeline for skilled-trades talent.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              {siteConfig.name} is being built to help employers connect with
              career seekers earlier — before they are lost, confused, or pushed
              away from the skilled trades.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/opportunities" className="btn-primary px-7 py-4">
                View jobs & apprenticeships
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link href="/employers/sign-up" className="btn-outline-dark px-7 py-4">
                Create employer profile
              </Link>
            </div>
          </div>

          <div className="card-dark p-6 shadow-2xl shadow-black/30">
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
                  <div key={item} className="mini-card flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
                    <p className="leading-7 text-slate-700">{item}</p>
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
            <p className="eyebrow">Why employers matter</p>

            <h2 className="section-title mt-6">
              The workforce gap will not be solved by job posts alone.
            </h2>

            <p className="lead-text mt-5">
              Skilled-trades employers need better ways to reach people earlier,
              explain real career pathways, and connect with training programs
              that prepare future workers.
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
                <p className="eyebrow-dark">Marketplace direction</p>

                <h2 className="section-title-dark mt-4">
                  From career discovery to employer opportunity.
                </h2>

                <p className="lead-text-dark mt-5 max-w-3xl">
                  The long-term goal is to help employers connect with people
                  who have already explored trades, saved pathways, and shown
                  interest in specific career directions.
                </p>
              </div>

              <div className="card-dark">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-300 ring-1 ring-orange-400/20">
                  <HardHat className="h-7 w-7" />
                </div>

                <h3 className="mt-6 text-2xl font-bold">
                  Future employer tools
                </h3>

                <ul className="mt-5 space-y-3 text-slate-300">
                  {futureTools.map((tool) => (
                    <li key={tool} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-300" />
                      <span>{tool}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/employers/new" className="btn-light mt-8">
                  Create employer profile
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