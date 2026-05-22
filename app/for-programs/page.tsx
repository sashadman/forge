import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Handshake,
  ListChecks,
  ShieldCheck,
  Users,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import NextStepPanel from '@/components/ui/NextStepPanel'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `For Training Providers — ${siteConfig.name}`,
  description:
    'Learn how training providers, apprenticeship programs, workforce organizations, and schools can participate in the skilled-trades pathway platform.',
}

const benefits = [
  {
    title: 'Reach motivated career seekers',
    description:
      'Connect with people comparing career paths, training programs, jobs, and apprenticeships.',
    icon: Users,
  },
  {
    title: 'Make your program easier to compare',
    description:
      'Help learners understand program type, career focus, location, duration, cost, requirements, and outcomes.',
    icon: ListChecks,
  },
  {
    title: 'Support a stronger workforce pathway',
    description:
      'Create a clearer bridge between exploration, training readiness, apprenticeships, and employer demand.',
    icon: Handshake,
  },
]

const participationSteps = [
  'Review how your program appears in the public directory',
  'Keep requirements, dates, costs, and application links current when provider tools are available',
  'Help seekers compare training options honestly',
  'Support better-prepared applicants over time',
]

const futureProviderTools = [
  'Claim or verify a training program listing',
  'Update application requirements',
  'Add deadlines and cohort dates',
  'Show outcomes and career focus',
  'Connect with employers and workforce partners',
]

export default function ForProgramsPage() {
  return (
    <main className="page-shell">
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative grid gap-12 py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="eyebrow-dark">For training providers</p>

            <h1 className="page-title-dark mt-6">
              Help future skilled workers understand your training pathway.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              {siteConfig.name} helps career seekers compare training programs
              with career paths, jobs, and apprenticeships so they can choose a
              practical route into skilled-trades work.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/programs" className="btn-primary px-7 py-4">
                View training program directory
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="#provider-readiness"
                className="btn-outline-dark px-7 py-4"
              >
                See provider roadmap
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
                  <p className="font-bold">Training program directory</p>
                  <p className="text-sm text-slate-500">
                    Public listings now · provider tools later
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

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="pt-8">
            <NextStepPanel
              title="Provider participation should be honest and verifiable."
              description="The directory can help seekers compare programs today. Provider account tools should only be promised when claim, verification, and editing workflows are actually built."
              primaryHref="/programs"
              primaryLabel="View training programs"
              secondaryHref="#provider-readiness"
              secondaryLabel="Review roadmap"
              icon={<ShieldCheck className="h-6 w-6" />}
            />
          </div>

          <section className="section-padding">
            <div className="max-w-3xl">
              <p className="eyebrow">Why training providers matter</p>

              <h2 className="section-title mt-6">
                Career discovery only works when it leads to a practical pathway.
              </h2>

              <p className="lead-text mt-5">
                Many people are interested in skilled trades but do not know
                where to begin. Clear training program information helps turn
                interest into action.
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
          </section>

          <section
            id="provider-readiness"
            className="scroll-mt-28 rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-xl md:p-12"
          >
            <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-300">
                  Directory first, provider tools later
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-tight">
                  We do not claim partnership unless a provider verifies it.
                </h2>

                <p className="mt-5 max-w-3xl leading-7 text-slate-300">
                  Current training program listings are public directory
                  information. Future provider tools can allow organizations to
                  claim, verify, and manage their listings directly after the
                  verification workflow is built.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href="/programs" className="btn-light">
                    View training program directory
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/for-employers"
                    className="btn-outline border-white/20 bg-white/10 text-white hover:bg-white/15"
                  >
                    Employer path
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/15">
                <h3 className="text-2xl font-bold">Future provider tools</h3>

                <ul className="mt-5 space-y-3 text-slate-300">
                  {futureProviderTools.map((tool) => (
                    <li key={tool} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-300" />
                      <span>{tool}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}