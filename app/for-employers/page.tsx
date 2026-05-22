import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  FilePenLine,
  GraduationCap,
  HardHat,
  ShieldCheck,
  Users,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import NextStepPanel from '@/components/ui/NextStepPanel'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `For Employers — ${siteConfig.name}`,
  description:
    'A focused employer workflow for creating a verified employer profile, publishing real jobs and apprenticeships, and reviewing applicants.',
}

const employerWorkflow = [
  {
    title: 'Create an employer account',
    description:
      'Start with employer access so listings, applicants, and profile information stay attached to the right organization.',
    icon: ShieldCheck,
  },
  {
    title: 'Build an employer profile',
    description:
      'Add organization details, location, website, contact information, and public trust signals before posting listings.',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Publish real listings',
    description:
      'Create actual jobs, apprenticeships, trainee roles, or pre-apprenticeships with clear requirements, pay, schedule, and application steps.',
    icon: FilePenLine,
  },
  {
    title: 'Review applicants',
    description:
      'Use submitted applications, readiness snapshots, notes, and status history to move qualified applicants forward.',
    icon: ClipboardList,
  },
]

const benefits = [
  {
    title: 'Reach prepared career seekers',
    description:
      'Connect with people who are comparing career paths, reviewing training programs, and preparing for skilled-trades work.',
    icon: Users,
  },
  {
    title: 'Improve listing quality',
    description:
      'Clear listings help applicants understand the role, requirements, pay, schedule, and how to apply.',
    icon: CheckCircle2,
  },
  {
    title: 'Build a long-term pipeline',
    description:
      'Employers can become visible earlier in the career journey instead of relying only on one-time job posts.',
    icon: GraduationCap,
  },
]

const employerTools = [
  'Employer account and sign-in',
  'Employer profile management',
  'Jobs and apprenticeship listings',
  'Applicant review workflow',
  'Readiness snapshots',
  'Future candidate-interest insights',
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
              Manage skilled-trades hiring from one employer workflow.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              {siteConfig.name} helps employers create a real organization
              profile, publish jobs and apprenticeships, and review applicants
              through a focused employer path.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/employers/sign-up" className="btn-primary px-7 py-4">
                Create employer account
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/employers/sign-in"
                className="btn-outline-dark px-7 py-4"
              >
                Employer sign in
              </Link>
            </div>

            <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-400">
              Employers should manage their own profile, listings, and applicants
              from the employer workspace — not from the career-seeker directory.
            </p>
          </div>

          <div className="card-dark p-6 shadow-2xl shadow-black/30">
            <div className="rounded-[1.5rem] bg-white p-6 text-slate-950">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                  <BriefcaseBusiness className="h-6 w-6" />
                </div>

                <div>
                  <p className="font-bold">Employer workspace</p>
                  <p className="text-sm text-slate-500">
                    Profile · listings · applicants
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {employerTools.slice(0, 5).map((tool) => (
                  <div key={tool} className="mini-card flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
                    <p className="leading-7 text-slate-700">{tool}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-4">
                <p className="text-sm font-semibold text-orange-900">
                  Employer path
                </p>
                <p className="mt-1 text-sm leading-6 text-orange-800">
                  Create or sign into an employer account before managing
                  listings or reviewing applicants.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="pt-8">
            <NextStepPanel
              title="Start with employer access, then manage listings and applicants."
              description="A clean employer workflow keeps organization details, job and apprenticeship listings, and applicant review tools in one role-specific workspace."
              primaryHref="/employers/sign-up"
              primaryLabel="Create employer account"
              secondaryHref="/employers/sign-in"
              secondaryLabel="Employer sign in"
              icon={<BriefcaseBusiness className="h-6 w-6" />}
            />
          </div>

          <section id="employer-workflow" className="section-padding scroll-mt-28">
            <div className="max-w-3xl">
              <p className="eyebrow">Employer workflow</p>

              <h2 className="section-title mt-6">
                Employers need a hiring workflow, not a seeker browsing flow.
              </h2>

              <p className="lead-text mt-5">
                Career seekers browse jobs and apprenticeships. Employers create
                listings, maintain organization details, and review applicants.
                Those workflows should stay separate.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {employerWorkflow.map((step) => {
                const Icon = step.icon

                return (
                  <div key={step.title} className="card card-hover p-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                      <Icon className="h-7 w-7" />
                    </div>

                    <h3 className="mt-6 text-2xl font-bold tracking-tight">
                      {step.title}
                    </h3>

                    <p className="muted-text mt-4">{step.description}</p>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-12">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p className="eyebrow">Why employers matter</p>

                <h2 className="section-title mt-4">
                  The workforce gap will not be solved by job posts alone.
                </h2>

                <p className="lead-text mt-5">
                  Skilled-trades employers need better ways to explain real
                  roles, show requirements clearly, and connect with applicants
                  who understand the pathway before they apply.
                </p>
              </div>

              <div className="grid gap-4">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon

                  return (
                    <div key={benefit.title} className="mini-card flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-950">
                          {benefit.title}
                        </h3>

                        <p className="mt-2 leading-7 text-slate-600">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-xl md:p-12">
            <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-300">
                  Employer tools
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-tight">
                  Listings and applicants should be managed from the employer workspace.
                </h2>

                <p className="mt-5 max-w-3xl leading-7 text-slate-300">
                  The public jobs and apprenticeships page is for career seekers.
                  Employers should create and maintain listings from their own
                  secure employer workflow.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href="/employers/sign-up" className="btn-light">
                    Create employer account
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/employers/sign-in"
                    className="btn-outline border-white/20 bg-white/10 text-white hover:bg-white/15"
                  >
                    Employer sign in
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/15">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-300 ring-1 ring-orange-400/20">
                  <HardHat className="h-7 w-7" />
                </div>

                <h3 className="mt-6 text-2xl font-bold">
                  Employer workspace includes
                </h3>

                <ul className="mt-5 space-y-3 text-slate-300">
                  {employerTools.map((tool) => (
                    <li key={tool} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-300" />
                      <span>{tool}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start gap-3">
                    <BarChart3 className="mt-0.5 h-5 w-5 shrink-0 text-orange-300" />
                    <p className="text-sm leading-6 text-slate-300">
                      Future employer insights can show applicant activity and
                      listing performance without exposing private seeker data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}