import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  ArrowRight,
  Building2,
  Clock,
  ExternalLink,
  GraduationCap,
  MapPin,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import ProviderProgramReviewForm from '@/components/admin/ProviderProgramReviewForm'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Provider Program Review — ${siteConfig.name}`,
  description:
    'Review provider-submitted training programs before publishing them publicly.',
}

type ProviderProgramRow = {
  id: string
  slug: string
  name: string
  provider_name: string
  program_type: string
  trade_slug: string
  location: string
  state: string
  duration: string | null
  cost: string | null
  description: string
  requirements: string[] | null
  outcomes: string[] | null
  website_url: string | null
  is_active: boolean
  provider_profile_id: string | null
  submitted_by: string | null
  review_status: string
  review_notes: string | null
  reviewed_at: string | null
  published_at: string | null
  created_at: string
  updated_at: string
  training_provider_profiles:
    | {
        id: string
        name: string
        city: string
        state: string
        verification_status: string
      }
    | null
}

function formatLabel(value: string) {
  return value
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

function statusBadgeClass(status: string) {
  if (status === 'approved') {
    return 'bg-emerald-50 text-emerald-700 ring-emerald-100'
  }

  if (status === 'rejected') {
    return 'bg-red-50 text-red-700 ring-red-100'
  }

  if (status === 'needs_more_info') {
    return 'bg-orange-50 text-orange-700 ring-orange-100'
  }

  return 'bg-slate-100 text-slate-700 ring-slate-200'
}

export default async function AdminProviderProgramsPage() {
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

  const { data, error } = await supabase
    .from('programs')
    .select(
      `
      id,
      slug,
      name,
      provider_name,
      program_type,
      trade_slug,
      location,
      state,
      duration,
      cost,
      description,
      requirements,
      outcomes,
      website_url,
      is_active,
      provider_profile_id,
      submitted_by,
      review_status,
      review_notes,
      reviewed_at,
      published_at,
      created_at,
      updated_at,
      training_provider_profiles (
        id,
        name,
        city,
        state,
        verification_status
      )
      `
    )
    .not('provider_profile_id', 'is', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to load provider programs:', error)
  }

  const providerPrograms = (data ?? []) as unknown as ProviderProgramRow[]

  const pendingCount = providerPrograms.filter(
    (program) => program.review_status === 'pending'
  ).length

  const approvedCount = providerPrograms.filter(
    (program) => program.review_status === 'approved'
  ).length

  const needsInfoCount = providerPrograms.filter(
    (program) => program.review_status === 'needs_more_info'
  ).length

  return (
    <main className="page-shell">
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <div className="max-w-4xl">
            <p className="eyebrow-dark">Admin provider programs</p>

            <h1 className="page-title-dark mt-6">
              Review provider-submitted programs.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Provider-submitted programs stay private until an admin reviews
              them. Approving a program publishes it to the public directory.
            </p>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="-mt-12 grid gap-5 md:grid-cols-4">
            <StatusPanel
              label="Provider programs"
              value={`${providerPrograms.length}`}
            />
            <StatusPanel label="Pending review" value={`${pendingCount}`} />
            <StatusPanel label="Approved" value={`${approvedCount}`} />
            <StatusPanel label="Needs info" value={`${needsInfoCount}`} />
          </div>

          <div className="mt-8 grid gap-6">
            {providerPrograms.length > 0 ? (
              providerPrograms.map((program) => (
                <article key={program.id} className="content-panel">
                  <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-start">
                    <div className="max-w-4xl">
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusBadgeClass(
                            program.review_status
                          )}`}
                        >
                          {formatLabel(program.review_status)}
                        </span>

                        <span className="badge-slate">
                          {formatLabel(program.program_type)}
                        </span>

                        <span className="badge-slate">{program.trade_slug}</span>

                        {program.is_active && (
                          <span className="badge-orange">Public</span>
                        )}
                      </div>

                      <h2 className="section-title mt-4">{program.name}</h2>

                      <p className="mt-2 text-lg font-semibold text-slate-700">
                        {program.provider_name}
                      </p>

                      <div className="mt-5 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
                        <InfoLine
                          icon={<Building2 className="h-4 w-4" />}
                          value={
                            program.training_provider_profiles?.name ??
                            'Provider workspace unavailable'
                          }
                        />

                        <InfoLine
                          icon={<MapPin className="h-4 w-4" />}
                          value={`${program.location}, ${program.state}`}
                        />

                        <InfoLine
                          icon={<GraduationCap className="h-4 w-4" />}
                          value={program.duration || 'Duration not provided'}
                        />

                        <InfoLine
                          icon={<Clock className="h-4 w-4" />}
                          value={new Date(program.created_at).toLocaleDateString()}
                        />
                      </div>

                      <div className="mt-6 mini-card">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                          Program description
                        </p>

                        <p className="mt-2 whitespace-pre-line leading-7 text-slate-700">
                          {program.description}
                        </p>
                      </div>

                      <div className="mt-5 grid gap-5 md:grid-cols-2">
                        <ListPanel
                          title="Requirements"
                          items={program.requirements ?? []}
                        />

                        <ListPanel
                          title="Outcomes"
                          items={program.outcomes ?? []}
                        />
                      </div>

                      {program.review_notes && (
                        <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 p-4">
                          <p className="text-sm font-bold text-orange-900">
                            Current review notes
                          </p>

                          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-orange-800">
                            {program.review_notes}
                          </p>
                        </div>
                      )}

                      <div className="mt-6 flex flex-wrap gap-3">
                        {program.website_url && (
                          <a
                            href={program.website_url}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-outline"
                          >
                            Provider URL
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}

                        {program.is_active && (
                          <Link href={`/programs/${program.slug}`} className="btn-dark">
                            View public page
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        )}
                      </div>
                    </div>

                    <div className="w-full xl:max-w-sm">
                      <ProviderProgramReviewForm
                        programId={program.id}
                        currentReviewStatus={program.review_status}
                        currentReviewNotes={program.review_notes ?? ''}
                      />
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <section className="content-panel text-center">
                <h2 className="section-title">
                  No provider-submitted programs yet
                </h2>

                <p className="muted-text mx-auto mt-4 max-w-2xl">
                  Programs submitted by approved provider workspaces will appear
                  here for admin review before they become public.
                </p>
              </section>
            )}
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

function InfoLine({
  icon,
  value,
}: {
  icon: React.ReactNode
  value: string
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-orange-600">{icon}</span>
      <span>{value}</span>
    </div>
  )
}

function ListPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mini-card">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {title}
      </p>

      {items.length > 0 ? (
        <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
          {items.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-slate-500">Not provided.</p>
      )}
    </div>
  )
}