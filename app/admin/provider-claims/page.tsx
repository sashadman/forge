import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Building2, Clock, GraduationCap, Mail, MapPin } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import { createClient } from '@/lib/supabase/server'
import ProviderClaimReviewForm from '@/components/training-providers/ProviderClaimReviewForm'
import CreateProviderProfileFromClaimButton from '@/components/training-providers/CreateProviderProfileFromClaimButton'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Provider Claims — ${siteConfig.name}`,
  description: 'Review training provider access and program claim requests.',
}

type ProviderClaimRow = {
  id: string
  submitted_by: string | null
  contact_name: string
  contact_email: string
  organization_name: string
  website_url: string | null
  phone: string | null
  city: string
  state: string
  role_title: string | null
  claim_type: string
  program_names: string | null
  evidence_summary: string
  requested_access: string | null
  status: string
  admin_notes: string | null
  created_at: string
  reviewed_at: string | null
  program_id?: string | null
  programs?: {
    id: string
    slug: string
    name: string
    provider_name: string
    location: string
    state: string
  } | null
}

function formatClaimType(value: string) {
  return value
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

export default async function AdminProviderClaimsPage() {
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
    .from('provider_claims')
    .select(
      `
      id,
      submitted_by,
      contact_name,
      contact_email,
      organization_name,
      website_url,
      phone,
      city,
      state,
      role_title,
      claim_type,
      program_id,
      program_names,
      evidence_summary,
      requested_access,
      status,
      admin_notes,
      created_at,
      reviewed_at,
      programs (
        id,
        slug,
        name,
        provider_name,
        location,
        state
      )
      `
    )
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to load provider claims:', error)
  }

  const providerClaims = ((data ?? []) as unknown as ProviderClaimRow[])
  const pendingCount = providerClaims.filter(
    (claim) => claim.status === 'pending'
  ).length

  const linkedProgramCount = providerClaims.filter(
    (claim) => Boolean(claim.program_id)
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
              Review training provider requests.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Check provider identity, linked program context, evidence, and
              requested access before approving any provider capability.
            </p>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="-mt-12 grid gap-5 md:grid-cols-3">
            <StatusPanel label="Total requests" value={`${providerClaims.length}`} />
            <StatusPanel label="Pending review" value={`${pendingCount}`} />
            <StatusPanel label="Linked programs" value={`${linkedProgramCount}`} />
          </div>

          <div className="mt-8 grid gap-6">
            {providerClaims.length > 0 ? (
              providerClaims.map((claim) => (
                <article key={claim.id} className="content-panel">
                  <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
                    <div className="max-w-3xl">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="eyebrow">{claim.status}</p>

                        <span className="badge-slate">
                          {formatClaimType(claim.claim_type)}
                        </span>

                        {claim.program_id && (
                          <span className="badge-orange">Linked program</span>
                        )}
                      </div>

                      <h2 className="section-title mt-4">
                        {claim.organization_name}
                      </h2>

                      <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                        <InfoLine
                          icon={<Mail className="h-4 w-4" />}
                          value={`${claim.contact_name} · ${claim.contact_email}`}
                        />

                        <InfoLine
                          icon={<MapPin className="h-4 w-4" />}
                          value={`${claim.city}, ${claim.state}`}
                        />

                        <InfoLine
                          icon={<Building2 className="h-4 w-4" />}
                          value={claim.role_title || 'Role not provided'}
                        />

                        <InfoLine
                          icon={<Clock className="h-4 w-4" />}
                          value={new Date(claim.created_at).toLocaleDateString()}
                        />
                      </div>

                      {claim.website_url && (
                        <a
                          href={claim.website_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex text-sm font-semibold text-orange-700 hover:text-orange-800"
                        >
                          {claim.website_url}
                        </a>
                      )}

                      {claim.programs && (
                        <div className="mt-6 rounded-3xl border border-orange-200 bg-orange-50 p-5">
                          <div className="flex items-center gap-2 text-orange-700">
                            <GraduationCap className="h-5 w-5" />
                            <p className="text-xs font-bold uppercase tracking-[0.25em]">
                              Linked public program
                            </p>
                          </div>

                          <h3 className="mt-3 text-xl font-bold text-slate-950">
                            {claim.programs.name}
                          </h3>

                          <p className="mt-2 text-sm font-semibold text-slate-700">
                            {claim.programs.provider_name}
                          </p>

                          <p className="mt-1 text-sm text-slate-600">
                            {claim.programs.location}, {claim.programs.state}
                          </p>
                        </div>
                      )}

                      {claim.program_names && (
                        <div className="mt-6 mini-card">
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                            Program names
                          </p>

                          <p className="mt-2 whitespace-pre-line leading-7 text-slate-700">
                            {claim.program_names}
                          </p>
                        </div>
                      )}

                      <div className="mt-6 mini-card">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                          Evidence summary
                        </p>

                        <p className="mt-2 whitespace-pre-line leading-7 text-slate-700">
                          {claim.evidence_summary}
                        </p>
                      </div>

                      {claim.requested_access && (
                        <div className="mt-6 mini-card">
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                            Requested access
                          </p>

                          <p className="mt-2 whitespace-pre-line leading-7 text-slate-700">
                            {claim.requested_access}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="w-full lg:max-w-sm">
                      <ProviderClaimReviewForm
                        claimId={claim.id}
                        currentStatus={claim.status}
                        currentAdminNotes={claim.admin_notes ?? ''}
                      />

                      <CreateProviderProfileFromClaimButton
                        claimId={claim.id}
                        claimStatus={claim.status}
                        submittedBy={claim.submitted_by}
                      />
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <section className="content-panel text-center">
                <h2 className="section-title">No provider requests yet</h2>

                <p className="muted-text mx-auto mt-4 max-w-2xl">
                  Provider requests will appear here after training providers
                  submit claims or program access requests.
                </p>
              </section>
            )}
          </div>
        </div>
      </section>
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