import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  HardHat,
  LogIn,
  PlusCircle,
  UserPlus,
  Users,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import ThemedPublicPage from '@/components/theme/ThemedPublicPage'
import ThemedPublicSection from '@/components/theme/ThemedPublicSection'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `For Employers — ${siteConfig.name}`,
  description:
    'A focused employer workflow for creating an employer account, building a public profile, submitting real jobs or apprenticeships for review, and reviewing applicants.',
}

const employerActions = [
  {
    title: 'Create employer account',
    description:
      'Start the employer onboarding path and connect future listings to the correct organization.',
    href: '/employers/sign-up',
    icon: UserPlus,
    primary: true,
  },
  {
    title: 'Employer sign in',
    description:
      'Return to your employer workspace to manage profile, listings, and applications.',
    href: '/employers/sign-in',
    icon: LogIn,
    primary: false,
  },
  {
    title: 'Employer dashboard',
    description:
      'Go directly to the employer dashboard if your account and employer profile are already active.',
    href: '/employers/dashboard',
    icon: BriefcaseBusiness,
    primary: false,
  },
  {
    title: 'Submit a listing for review',
    description:
      'Submit a real job, apprenticeship, trainee, or pre-apprenticeship for admin review after your employer profile exists.',
    href: '/employers/opportunities/new',
    icon: PlusCircle,
    primary: false,
  },
]

const benefits = [
  {
    title: 'Reach career-ready candidates',
    description:
      'Connect with people who are actively exploring skilled trades, saving career paths, comparing programs, and preparing for applications.',
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

const employerWorkflow = [
  'Create an employer account',
  'Build a public employer profile',
  'Submit real jobs or apprenticeships for review',
  'Review applications and readiness snapshots',
  'Keep listings current and connected to real hiring needs',
]

const employerTools = [
  'Employer profile management',
  'Reviewed jobs and apprenticeship listings',
  'Application review workflow',
  'Applicant readiness snapshots',
  'Submission review and listing status control',
]

export default function ForEmployersPage() {
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

        <div className="section-shell relative grid gap-12 py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="eyebrow-dark">For employers</p>

            <h1 className="page-title-dark mt-6" style={{ color: '#FFFFFF' }}>
              Build a stronger pipeline for skilled-trades talent.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl" style={{ color: '#E2E8F0' }}>
              {siteConfig.name} helps skilled-trades employers create a real
              employer profile, submit honest jobs or apprenticeships for review, and
              review applicants through a focused employer workflow.
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

            <p className="mt-5 max-w-2xl text-sm leading-6" style={{ color: '#CBD5E1' }}>
              Employer accounts stay separate from career-seeker dashboards so
              hiring workflows, listings, and applicants remain attached to the
              correct organization.
            </p>
          </div>

          <div className="card-dark p-6 shadow-2xl shadow-black/30">
            <div
              className="rounded-[1.5rem] p-6"
              style={{
                background: '#D97706',
                color: '#111827',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.28)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-950 shadow-sm">
                  <BriefcaseBusiness className="h-6 w-6" />
                </div>

                <div>
                  <p className="font-bold text-slate-950">Employer workflow</p>
                  <p className="text-sm font-semibold text-slate-900">
                    Account · profile · listings · applicants
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {employerWorkflow.map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 rounded-2xl border border-white/60 bg-white/90 p-4 shadow-sm"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-slate-950" />
                    <p className="font-semibold leading-7 text-slate-950">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ThemedPublicSection className="pb-20">
        <div className="section-shell">
          <section className="grid gap-5 pt-8 md:grid-cols-2 xl:grid-cols-4">
            {employerActions.map((action) => {
              const Icon = action.icon

              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group card card-hover p-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h2 className="mt-5 text-xl font-bold text-slate-950">
                    {action.title}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {action.description}
                  </p>

                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-sky-700">
                    Open
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              )
            })}
          </section>

          <section className="section-padding">
            <div className="max-w-3xl">
              <p className="eyebrow">Why employers matter</p>

              <h2 className="section-title mt-6">
                The workforce gap will not be solved by job posts alone.
              </h2>

              <p className="lead-text mt-5">
                Skilled-trades employers need better ways to reach people
                earlier, explain real career pathways, and connect with training
                programs that prepare future workers.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {benefits.map((benefit) => {
                const Icon = benefit.icon

                return (
                  <div key={benefit.title} className="card card-hover p-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
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

          <section className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-xl md:p-12">
            <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-300">
                  Employer workspace
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-tight">
                  Keep hiring actions inside the employer journey.
                </h2>

                <p className="mt-5 max-w-3xl leading-7 text-slate-300">
                  Employers should not be routed into the job-seeker dashboard.
                  They should manage profile quality, listings, and applications
                  from the employer workspace.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link href="/employers/sign-up" className="btn-light">
                    Create employer account
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/employers/dashboard"
                    className="btn-outline border-white/20 bg-white/10 text-white hover:bg-white/15"
                  >
                    Go to employer dashboard
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/15">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/20">
                  <HardHat className="h-7 w-7" />
                </div>

                <h3 className="mt-6 text-2xl font-bold">Employer tools</h3>

                <ul className="mt-5 space-y-3 text-slate-300">
                  {employerTools.map((tool) => (
                    <li key={tool} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" />
                      <span>{tool}</span>
                    </li>
                  ))}
                </ul>
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
                <p className="eyebrow-dark">Employer pricing</p>

                <h2 className="section-title-dark mt-6">
                  Start free, then upgrade when your hiring pipeline grows.
                </h2>

                <p className="lead-text-dark mt-5">
                  Employers can test the platform with one reviewed opportunity. Paid
                  plans unlock more active listings, applicant review tools, readiness
                  snapshots, and priority visibility.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link href="/pricing" className="btn-primary">
                  View employer pricing
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link href="/employers/sign-up" className="btn-outline">
                  Create employer account
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
