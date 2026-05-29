import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Clock, FileText, GraduationCap, UserRound } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import ProviderProgramUpdateRequestReviewForm from '@/components/admin/ProviderProgramUpdateRequestReviewForm'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Program Update Requests — ${siteConfig.name}`,
  description:
    'Review provider-submitted update requests for connected training programs.',
}

type ProgramUpdateRequest = {
  id: string
  request_type: string
  requested_changes: Record<string, unknown>
  change_summary: string
  status: string
  admin_notes: string | null
  created_at: string
  reviewed_at: string | null
  programs:
    | {
        id: string
        name: string
        provider_name: string
        slug: string
      }
    | null
  training_provider_profiles:
    | {
        id: string
        name: string
      }
    | null
}

type LooseQueryResult = Promise<{
  data: unknown
  error: { message: string } | null
}>

type LooseTable = {
  select: (columns: string) => {
    order: (
      column: string,
      options?: { ascending?: boolean }
    ) => LooseQueryResult
  }
}

type LooseSupabaseClient = {
  from: (table: string) => LooseTable
}

function asLooseSupabase(client: unknown) {
  return client as LooseSupabaseClient
}

function formatLabel(value: string) {
  return value
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

function formatChangeValue(value: unknown) {
  if (value === null || value === undefined || value === '') return null

  if (Array.isArray(value)) {
    return value.length > 0 ? value.join('\n') : null
  }

  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2)
  }

  return String(value)
}

export default async function AdminProgramUpdateRequestsPage() {
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

  const { data, error } = await asLooseSupabase(supabase)
    .from('provider_program_update_requests')
    .select(
      `
      id,
      request_type,
      requested_changes,
      change_summary,
      status,
      admin_notes,
      created_at,
      reviewed_at,
      programs (
        id,
        name,
        provider_name,
        slug
      ),
      training_provider_profiles (
        id,
        name
      )
      `
    )
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to load program update requests:', error)
  }

  const requests = (data ?? []) as ProgramUpdateRequest[]
  const pendingCount = requests.filter(
    (request) => request.status === 'pending'
  ).length

  return (
    <main className="page-shell">
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <div className="max-w-4xl">
            <p className="eyebrow-dark">Admin review</p>

            <h1 className="page-title-dark mt-6">
              Review provider program update requests.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Providers can request corrections, but public program records stay
              protected until an admin reviews the request.
            </p>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="-mt-12 grid gap-5 md:grid-cols-3">
            <StatusPanel label="Total requests" value={`${requests.length}`} />
            <StatusPanel label="Pending review" value={`${pendingCount}`} />
            <StatusPanel label="Review model" value="Manual" />
          </div>

          <div className="mt-8 grid gap-6">
            {requests.length > 0 ? (
              requests.map((request) => (
                <article key={request.id} className="content-panel">
                  <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
                    <div className="max-w-3xl">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="eyebrow">{request.status}</p>

                        <span className="badge-slate">
                          {formatLabel(request.request_type)}
                        </span>
                      </div>

                      <h2 className="section-title mt-4">
                        {request.programs?.name ?? 'Unknown program'}
                      </h2>

                      <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                        <InfoLine
                          icon={<GraduationCap className="h-4 w-4" />}
                          value={
                            request.programs?.provider_name ??
                            'Provider not available'
                          }
                        />

                        <InfoLine
                          icon={<UserRound className="h-4 w-4" />}
                          value={
                            request.training_provider_profiles?.name ??
                            'Workspace not available'
                          }
                        />

                        <InfoLine
                          icon={<FileText className="h-4 w-4" />}
                          value={formatLabel(request.request_type)}
                        />

                        <InfoLine
                          icon={<Clock className="h-4 w-4" />}
                          value={new Date(
                            request.created_at
                          ).toLocaleDateString()}
                        />
                      </div>

                      <div className="mt-6 mini-card">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                          Provider summary
                        </p>

                        <p className="mt-2 whitespace-pre-line leading-7 text-slate-700">
                          {request.change_summary}
                        </p>
                      </div>

                      <div className="mt-6 mini-card">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                          Requested changes
                        </p>

                        <div className="mt-4 grid gap-4">
                          {Object.entries(request.requested_changes).map(
                            ([key, value]) => {
                              const formattedValue = formatChangeValue(value)

                              if (!formattedValue) return null

                              return (
                                <div key={key}>
                                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                    {formatLabel(key)}
                                  </p>

                                  <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-700">
                                    {formattedValue}
                                  </p>
                                </div>
                              )
                            }
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="w-full lg:max-w-sm">
                      <ProviderProgramUpdateRequestReviewForm
                        requestId={request.id}
                        currentStatus={request.status}
                        currentAdminNotes={request.admin_notes ?? ''}
                      />
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <section className="content-panel text-center">
                <h2 className="section-title">No program update requests yet</h2>

                <p className="muted-text mx-auto mt-4 max-w-2xl">
                  Provider update requests will appear here after approved
                  providers request corrections to connected program listings.
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