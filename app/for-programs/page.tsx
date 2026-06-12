import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  FilePenLine,
  GraduationCap,
  ListChecks,
  ShieldCheck,
  Users,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
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

      <section
        className="relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #0F172A 0%, #172033 52%, #1E293B 100%)',
          color: '#F8FAFC',
        }}
      >
        <div className="hero-fade" />

        <div className="section-shell relative grid gap-8 py-14 sm:py-16 lg:grid-cols-[0.95fr_0.75fr] lg:items-center">
          <div className="max-w-3xl">
            <p className="eyebrow-dark">For training providers</p>

            <h1
              className="mt-5 font-bold leading-tight tracking-tight"
              style={{ color: '#FFFFFF', fontSize: 'clamp(1.8rem, 3.2vw, 2.65rem)' }}
            >
              Help future skilled workers find accurate training pathways.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 sm:text-lg" style={{ color: '#E2E8F0' }}>
              {siteConfig.name} helps training providers,
              apprenticeship programs, workforce organizations, and schools can
              request access, manage verified provider profiles, submit programs,
              and request updates through an admin-reviewed workflow.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/training-providers/claim"
                className="btn-primary px-6 py-3"
              >
                Request provider access
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="#provider-workflow"
                className="btn-outline px-6 py-3"
                style={{ borderColor: 'rgba(255,255,255,0.28)', color: '#F8FAFC' }}
              >
                Review provider workflow
              </Link>
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-6" style={{ color: '#CBD5E1' }}>
              Provider tools stay behind claim review, verification,
              admin approval, and secure provider membership checks. This keeps program
              data trustworthy.
            </p>
          </div>

          <div className="card-dark p-4 shadow-2xl shadow-black/30">
            <div
              className="rounded-[1.25rem] p-5"
              style={{
                background: '#D97706',
                color: '#111827',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.24)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-950 shadow-sm">
                  <GraduationCap className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-bold text-slate-950">Provider access model</p>
                  <p className="text-sm font-semibold text-slate-900">
                    Claim · review · verify · manage programs
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {providerTools.slice(0, 3).map((tool) => (
                  <div
                    key={tool}
                    className="flex gap-3 rounded-xl border border-white/60 bg-white/90 p-3 shadow-sm"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-slate-950" />
                    <p className="text-sm font-semibold leading-6 text-slate-950">{tool}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-white/60 bg-white p-3 shadow-sm">
                <p className="text-sm font-bold text-slate-950">
                  First live provider step
                </p>
                <p className="mt-1 text-sm font-medium leading-6 text-slate-800">
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
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl"
                      style={{ background: '#D97706', color: '#FFFFFF' }}
                    >
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
            className="scroll-mt-28 rounded-[2rem] p-8 shadow-sm md:p-12"
            style={{
              background:
                'linear-gradient(135deg, #111827 0%, #172033 60%, #1E293B 100%)',
              border: '1px solid rgba(255,255,255,0.14)',
            }}
          >
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p
                  className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.12em]"
                  style={{
                    borderColor: 'rgba(217,119,6,0.45)',
                    background: 'rgba(217,119,6,0.18)',
                    color: '#FDBA74',
                  }}
                >
                  Program data model
                </p>

                <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-white">
                  What a provider should be able to enter and maintain.
                </h2>

                <p className="mt-5 text-base leading-7 text-slate-200">
                  Before provider editing is enabled, the platform should define
                  program fields clearly. This prevents fake listings,
                  incomplete records, and confusing provider claims.
                </p>
              </div>

              <div className="grid gap-3">
                {programDataFields.map((field) => (
                  <div
                    key={field}
                    className="flex gap-3 rounded-xl border p-4 shadow-sm"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      borderColor: 'rgba(255,255,255,0.14)',
                    }}
                  >
                    <ListChecks className="mt-0.5 h-5 w-5 shrink-0" style={{ color: '#D97706' }} />
                    <p className="font-medium leading-7 text-slate-100">{field}</p>
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
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl"
                      style={{ background: '#D97706', color: '#FFFFFF' }}
                    >
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
    </ThemedPublicPage>
  )
}
