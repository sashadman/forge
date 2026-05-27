import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Building2, Clock, Mail, MapPin } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import { createClient } from '@/lib/supabase/server'
import ProviderClaimReviewForm from '@/components/training-providers/ProviderClaimReviewForm'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Provider Claims — ${siteConfig.name}`,
  description: 'Review training provider access and program claim requests.',
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

  const { data: claims, error } = await supabase
    .from('provider_claims')
    .select(
      `
      id,
      contact_name,
      contact_email,
      organization_name,
      website_url,
      phone,
      city,
      state,
      role_title,
      claim_type,
      program_names,
      evidence_summary,
      requested_access,
      status,
      admin_notes,
      created_at,
      reviewed_at
      `
    )
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to load provider claims:', error)
  }

  const pendingCount =
    claims?.filter((claim) => claim.status === 'pending').length ?? 0

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
              Check provider identity, program evidence, and requested access
              before approving any future provider capability.
            </p>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="-mt-12 grid gap-5 md:grid-cols-3">
            <StatusPanel label="Total requests" value={`${claims?.length ?? 0}`} />
            <StatusPanel label="Pending review" value={`${pendingCount}`} />
            <StatusPanel label="Review model" value="Manual" />
          </div>

          <div className="mt-8 grid gap-6">
            {claims && claims.length > 0 ? (
              claims.map((claim) => (
                <article key={claim.id} className="content-panel">
                  <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
                    <div className="max-w-3xl">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="eyebrow">{claim.status}</p>

                        <span className="badge-slate">
                          {claim.claim_type.replaceAll('_', ' ')}
                        </span>
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