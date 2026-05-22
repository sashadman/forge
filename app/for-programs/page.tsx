import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  FilePenLine,
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
    'A provider-facing overview for training organizations, apprenticeship programs, workforce partners, and schools that want to prepare accurate program listings and future provider-managed data.',
}

const providerWorkflow = [
  {
    title: 'Create or claim provider profile',
    description:
      'A provider profile should identify the organization, location, contact information, website, and verification status before program editing is allowed.',
    icon: ShieldCheck,
  },
  {
    title: 'Add training program information',
    description:
      'Each program should have a clear name, program type, career focus, location, duration, cost, requirements, outcomes, and application instructions.',
    icon: FilePenLine,
  },
  {
    title: 'Maintain accuracy over time',
    description:
      'Dates, costs, application links, cohort availability, and admission requirements should be reviewed regularly so seekers do not rely on stale information.',
    icon: ClipboardCheck,
  },
  {
    title: 'Understand seeker interest later',
    description:
      'Future provider tools should show useful signals such as views, saves, career-path interest, and applicant readiness trends without exposing private seeker data.',
    icon: BarChart3,
  },
]

const programDataFields = [
  'Provider name and public contact information',
  'Program name, type, and career focus',
  'Location, service area, and delivery format',
  'Duration, schedule, cost, and financial-aid notes',
  'Requirements, prerequisites, and application steps',
  'Outcomes, credentials, certificates, or apprenticeship connections',
  'Application URL, contact email, and verification status',
]

const futureProviderTools = [
  'Provider profile claim and verification',
  'Program listing creation and editing',
  'Application deadline and cohort-date management',
  'Program requirement and outcome updates',
  'Directory visibility and seeker-interest analytics',
  'Employer and workforce-partner connection tools',
]

const providerPrinciples = [
  {
    title: 'Accuracy before growth',
    description:
      'Program listings should be useful only if they are current, specific, and tied to a real provider or public source.',
    icon: CheckCircle2,
  },
  {
    title: 'Provider control with verification',
    description:
      'Provider editing should require ownership or verification so no one can incorrectly alter a public program listing.',
    icon: ShieldCheck,
  },
  {
    title: 'Better-prepared applicants',
    description:
      'The long-term value is not just visibility. It is helping seekers understand requirements before they apply.',
    icon: Users,
  },
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
              Manage accurate training pathway information for future skilled workers.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              {siteConfig.name} is being designed so training providers,
              apprenticeship programs, workforce organizations, and schools can
              eventually manage clear program information, verification status,
              and useful seeker-interest data from one provider workflow.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="#provider-workflow" className="btn-primary px-7 py-4">
                Review provider workflow
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link href="#program-data" className="btn-outline-dark px-7 py-4">
                See program data fields
              </Link>
            </div>

            <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-400">
              Provider account tools are not being claimed as live until the
              claim, verification, editing, and security workflow is built.
            </p>
          </div>

          <div className="card-dark p-6 shadow-2xl shadow-black/30">
            <div className="rounded-[1.5rem] bg-white p-6 text-slate-950">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                  <GraduationCap className="h-6 w-6" />
                </div>

                <div>
                  <p className="font-bold">Provider workspace model</p>
                  <p className="text-sm text-slate-500">
                    Profile · programs · verification · insights
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {futureProviderTools.slice(0, 4).map((tool) => (
                  <div key={tool} className="mini-card flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
                    <p className="leading-7 text-slate-700">{tool}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-4">
                <p className="text-sm font-semibold text-orange-900">
                  Build note
                </p>
                <p className="mt-1 text-sm leading-6 text-orange-800">
                  This page defines the provider experience. The actual provider
                  portal should be built only after the database, RLS policies,
                  ownership checks, and verification workflow are designed.
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
              title="Training providers need a provider workflow, not a seeker directory redirect."
              description="The provider path should help organizations understand what they will manage, what data matters, and how future claim or verification tools will work."
              primaryHref="#provider-workflow"
              primaryLabel="Review workflow"
              secondaryHref="#provider-insights"
              secondaryLabel="Review future insights"
              icon={<ShieldCheck className="h-6 w-6" />}
            />
          </div>

          <section id="provider-workflow" className="section-padding scroll-mt-28">
            <div className="max-w-3xl">
              <p className="eyebrow">Provider workflow</p>

              <h2 className="section-title mt-6">
                The provider journey should start with ownership and accuracy.
              </h2>

              <p className="lead-text mt-5">
                A training provider should be able to manage its profile, add or
                maintain program listings, verify public details, and later
                review useful visibility and seeker-interest data.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {providerWorkflow.map((step) => {
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

          <section
            id="program-data"
            className="scroll-mt-28 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-12"
          >
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p className="eyebrow">Program data model</p>

                <h2 className="section-title mt-4">
                  What a provider should be able to enter and maintain.
                </h2>

                <p className="lead-text mt-5">
                  Before building the provider portal, the platform should define
                  the program fields clearly. This prevents fake listings,
                  incomplete records, and confusing provider claims.
                </p>
              </div>

              <div className="grid gap-3">
                {programDataFields.map((field) => (
                  <div key={field} className="mini-card flex gap-3">
                    <ListChecks className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
                    <p className="leading-7 text-slate-700">{field}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="section-padding">
            <div className="max-w-3xl">
              <p className="eyebrow">Business logic</p>

              <h2 className="section-title mt-6">
                A provider page should not behave like a career-seeker page.
              </h2>

              <p className="lead-text mt-5">
                Career seekers compare programs. Training providers manage
                program information. Those are related, but they are not the same
                workflow.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {providerPrinciples.map((principle) => {
                const Icon = principle.icon

                return (
                  <div key={principle.title} className="card card-hover p-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                      <Icon className="h-7 w-7" />
                    </div>

                    <h3 className="mt-6 text-2xl font-bold tracking-tight">
                      {principle.title}
                    </h3>

                    <p className="muted-text mt-4">{principle.description}</p>
                  </div>
                )
              })}
            </div>
          </section>

          <section
            id="provider-insights"
            className="scroll-mt-28 rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-xl md:p-12"
          >
            <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-300">
                  Future provider insights
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-tight">
                  Providers should eventually see useful data, not just public listing text.
                </h2>

                <p className="mt-5 max-w-3xl leading-7 text-slate-300">
                  Future provider dashboards can show how seekers interact with
                  program listings: views, saves, career-focus interest,
                  readiness patterns, and application-intent signals. That data
                  should support better program communication without exposing
                  private seeker information.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href="#program-data" className="btn-light">
                    Review program data fields
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="#provider-workflow"
                    className="btn-outline border-white/20 bg-white/10 text-white hover:bg-white/15"
                  >
                    Back to provider workflow
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/15">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-300 ring-1 ring-orange-400/20">
                  <BarChart3 className="h-7 w-7" />
                </div>

                <h3 className="mt-6 text-2xl font-bold">
                  Future provider dashboard
                </h3>

                <ul className="mt-5 space-y-3 text-slate-300">
                  {futureProviderTools.map((tool) => (
                    <li key={tool} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-300" />
                      <span>{tool}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start gap-3">
                    <Handshake className="mt-0.5 h-5 w-5 shrink-0 text-orange-300" />
                    <p className="text-sm leading-6 text-slate-300">
                      Provider tools should be built as a secured workflow, not
                      as a simple public form that anyone can submit.
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