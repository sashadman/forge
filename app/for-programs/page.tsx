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
import ThemedPublicPage from '@/components/theme/ThemedPublicPage'
import ThemedPublicSection from '@/components/theme/ThemedPublicSection'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `For Training Providers — ${siteConfig.name}`,
  description:
    'A provider-facing overview for training organizations, apprenticeship programs, workforce partners, and schools that want to request provider access and manage accurate training program information.',
}

const providerWorkflow = [
  {
    title: 'Request provider access',
    description:
      'A real provider starts by submitting an access request with organization details, contact information, program names, and evidence of connection.',
    icon: ShieldCheck,
  },
  {
    title: 'Admin reviews the request',
    description:
      'Provider access should not be automatic. An admin reviews the organization, website, evidence, and requested access before future editing tools are enabled.',
    icon: ClipboardCheck,
  },
  {
    title: 'Create or claim provider profile',
    description:
      'After review, a provider profile can identify the organization, location, contact information, website, and verification status.',
    icon: FilePenLine,
  },
  {
    title: 'Maintain accurate program data',
    description:
      'Dates, costs, application links, cohort availability, and admission requirements should be reviewed regularly so seekers do not rely on stale information.',
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

const providerTools = [
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
    <ThemedPublicPage>
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative grid gap-12 py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="eyebrow-dark">For training providers</p>

            <h1 className="page-title-dark mt-6">
              Help future skilled workers find accurate training pathways.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              {siteConfig.name} helps training providers,
              apprenticeship programs, workforce organizations, and schools can
              request access, manage verified provider profiles, submit programs,
              and request updates through an admin-reviewed workflow.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/training-providers/claim"
                className="btn-primary px-7 py-4"
              >
                Request provider access
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link href="#provider-workflow" className="btn-outline-dark px-7 py-4">
                Review provider workflow
              </Link>
            </div>

            <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-400">
              Provider tools stay behind claim review, verification,
              admin approval, and secure provider membership checks. This keeps program
              data trustworthy.
            </p>
          </div>

          <div className="card-dark p-6 shadow-2xl shadow-black/30">
            <div className="rounded-[1.5rem] bg-white p-6 text-slate-950">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                  <GraduationCap className="h-6 w-6" />
                </div>

                <div>
                  <p className="font-bold">Provider access model</p>
                  <p className="text-sm text-slate-500">
                    Claim · review · verify · manage programs
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {providerTools.slice(0, 4).map((tool) => (
                  <div key={tool} className="mini-card flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
                    <p className="leading-7 text-slate-700">{tool}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-4">
                <p className="text-sm font-semibold text-orange-900">
                  First live provider step
                </p>
                <p className="mt-1 text-sm leading-6 text-orange-800">
                  Training providers can now request access. Admin review comes
                  before any provider profile or program-editing privileges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ThemedPublicSection className="pb-20">
        <div className="section-shell">
          <div className="pt-8">
            <NextStepPanel
              title="Start with a verified provider request."
              description="The provider path should begin with ownership review. Organizations can request access, then admins can review the claim before provider tools are enabled."
              primaryHref="/training-providers/claim"
              primaryLabel="Request provider access"
              secondaryHref="#program-data"
              secondaryLabel="Review program data fields"
              icon={<ShieldCheck className="h-6 w-6" />}
            />
          </div>

          <section id="provider-workflow" className="section-padding scroll-mt-28">
            <div className="max-w-3xl">
              <p className="eyebrow">Provider workflow</p>

              <h2 className="section-title mt-6">
                The provider journey starts with ownership and accuracy.
              </h2>

              <p className="lead-text mt-5">
                A training provider should be able to request access, verify its
                connection to a real organization, and later manage program
                information through a secure provider workflow.
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
                  Before provider editing is enabled, the platform should define
                  program fields clearly. This prevents fake listings,
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
                  Provider insights
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-tight">
                  Providers should eventually see useful data, not just public
                  listing text.
                </h2>

                <p className="mt-5 max-w-3xl leading-7 text-slate-300">
                  Provider dashboards can eventually show how seekers interact with
                  program listings: views, saves, career-focus interest,
                  readiness patterns, and application-intent signals. That data
                  should support better program communication without exposing
                  private seeker information.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href="/training-providers/claim" className="btn-light">
                    Request provider access
                    <ArrowRight className="h-4 w-4" />
                  </Link>
<Link href="/training-providers/dashboard" className="btn-outline-dark px-7 py-4">
  Track provider request
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
                  {providerTools.map((tool) => (
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
      </ThemedPublicSection>

      <ThemedPublicSection className="pb-20">
        <div className="section-shell">
          <section className="dark-panel p-8 md:p-12">
            <div className="dark-panel-content grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-center">
              <div>
                <p className="eyebrow-dark">Provider pricing</p>

                <h2 className="section-title-dark mt-6">
                  Claim your profile and keep program information current.
                </h2>

                <p className="lead-text-dark mt-5">
                  Training providers can start with a reviewed claim. Paid plans unlock
                  enhanced visibility, program update tools, inquiry tracking, analytics,
                  and regional partnership support.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link href="/pricing" className="btn-primary">
                  View provider pricing
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link href="/training-providers/claim" className="btn-outline">
                  Request provider access
                </Link>
              </div>
            </div>
          </section>
        </div>
      </ThemedPublicSection>

      <SiteFooter />
    </ThemedPublicPage>
  )
}