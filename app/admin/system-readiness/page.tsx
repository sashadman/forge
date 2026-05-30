import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  ShieldCheck,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'
import {
  getReadinessIcon,
  readinessSections,
  type ReadinessStatus,
} from '@/lib/admin/system-readiness'

export const metadata: Metadata = {
  title: `System Readiness — ${siteConfig.name}`,
  description:
    'Internal production-readiness checklist for platform security, deployment, and data operations.',
}

function getStatusConfig(status: ReadinessStatus) {
  if (status === 'ready') {
    return {
      label: 'Ready',
      className: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
      icon: CheckCircle2,
    }
  }

  if (status === 'needs_review') {
    return {
      label: 'Review',
      className: 'bg-orange-50 text-orange-700 ring-orange-100',
      icon: AlertTriangle,
    }
  }

  return {
    label: 'Manual',
    className: 'bg-slate-100 text-slate-700 ring-slate-200',
    icon: ClipboardCheck,
  }
}

export default async function AdminSystemReadinessPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  const totalItems = readinessSections.reduce(
    (total, section) => total + section.items.length,
    0
  )

  const readyItems = readinessSections.reduce(
    (total, section) =>
      total + section.items.filter((item) => item.status === 'ready').length,
    0
  )

  const reviewItems = readinessSections.reduce(
    (total, section) =>
      total +
      section.items.filter((item) => item.status === 'needs_review').length,
    0
  )

  const manualItems = readinessSections.reduce(
    (total, section) =>
      total +
      section.items.filter((item) => item.status === 'manual_check').length,
    0
  )

  return (
    <main className="page-shell">
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <div className="max-w-4xl">
            <p className="eyebrow-dark">Production readiness</p>

            <h1 className="page-title-dark mt-6">
              Review platform readiness before serious deployment.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Use this page as an internal checklist for security, role
              separation, RLS, provider workflows, admin operations, and
              deployment hygiene.
            </p>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="-mt-12 grid gap-5 md:grid-cols-4">
            <StatusPanel label="Checklist items" value={`${totalItems}`} />
            <StatusPanel label="Ready" value={`${readyItems}`} />
            <StatusPanel label="Need review" value={`${reviewItems}`} />
            <StatusPanel label="Manual checks" value={`${manualItems}`} />
          </div>

          <section className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-xl">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-300">
                  Readiness standard
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-tight">
                  Do not deploy serious workflows without passing the manual
                  checks.
                </h2>

                <p className="mt-4 max-w-3xl leading-7 text-slate-300">
                  Type-check and build are necessary, but not enough. Before
                  production use, verify role routing, RLS behavior, environment
                  variables, Supabase migrations, and admin-only controls.
                </p>
              </div>

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-orange-300 ring-1 ring-white/15">
                <ShieldCheck className="h-8 w-8" />
              </div>
            </div>
          </section>

          <div className="mt-8 grid gap-6">
            {readinessSections.map((section) => {
              const SectionIcon = getReadinessIcon(section.iconName)

              return (
                <section key={section.title} className="content-panel">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-3xl">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                        <SectionIcon className="h-6 w-6" />
                      </div>

                      <p className="eyebrow mt-5">Readiness area</p>

                      <h2 className="section-title mt-3">{section.title}</h2>

                      <p className="muted-text mt-3">{section.description}</p>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-4 md:grid-cols-2">
                    {section.items.map((item) => {
                      const statusConfig = getStatusConfig(item.status)
                      const StatusIcon = statusConfig.icon

                      return (
                        <div
                          key={item.title}
                          className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                        >
                          <div className="flex flex-wrap items-center gap-3">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusConfig.className}`}
                            >
                              <StatusIcon className="h-4 w-4" />
                              {statusConfig.label}
                            </span>
                          </div>

                          <h3 className="mt-4 text-xl font-bold text-slate-950">
                            {item.title}
                          </h3>

                          <p className="mt-3 text-sm leading-6 text-slate-600">
                            {item.description}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}

function StatusPanel({ label, value }: { label: string; value: string }) {
  return (
    <div className="content-panel">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
    </div>
  )
}