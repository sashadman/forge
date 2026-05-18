import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
 AlertCircle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Plus,
  ShieldCheck,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Manage Employers — ${siteConfig.name}`,
  description: 'Admin list of employer records and verification status.',
}

export default async function AdminEmployersPage() {
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
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  const { data: employers } = await supabase
    .from('employers')
    .select(
      `
      id,
      name,
      slug,
      description,
      industry,
      location,
      state,
      website_url,
      contact_email,
      linkedin_url,
      instagram_url,
      facebook_url,
      x_url,
      youtube_url,
      tiktok_url,
      other_social_url,
      is_verified,
      is_active,
      created_at
    `
    )
    .order('created_at', { ascending: false })

  const totalEmployers = employers?.length ?? 0
  const verifiedCount =
    employers?.filter((employer) => employer.is_verified).length ?? 0
  const needsVerificationCount =
    employers?.filter((employer) => !employer.is_verified).length ?? 0
  const inactiveCount =
    employers?.filter((employer) => !employer.is_active).length ?? 0

  return (
    <main className="page-shell">
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-4xl">
              <p className="eyebrow-dark">Admin verification</p>

              <h1 className="page-title-dark mt-6">
                Employer verification workflow.
              </h1>

              <p className="lead-text-dark mt-6 max-w-3xl">
                Review employer records, verification status, public visibility,
                contact details, and profile quality before showing trust badges.
              </p>
            </div>

            <Link href="/admin/employers/new" className="btn-primary">
              Add employer
              <Plus className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="-mt-12 grid gap-6 md:grid-cols-4">
            <StatusPanel label="Total employers" value={`${totalEmployers}`} />
            <StatusPanel label="Verified" value={`${verifiedCount}`} />
            <StatusPanel
              label="Needs verification"
              value={`${needsVerificationCount}`}
            />
            <StatusPanel label="Inactive" value={`${inactiveCount}`} />
          </div>

          <div className="content-panel mt-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <p className="eyebrow">Employer directory</p>

                <h2 className="section-title mt-3">
                  {totalEmployers} employer records
                </h2>

                <p className="muted-text mt-3 max-w-2xl">
                  Verification should be based on real employer information,
                  official links, profile quality, and admin review. Do not mark
                  an employer verified unless the profile is credible.
                </p>
              </div>

              <Link href="/admin" className="btn-outline px-5 py-2 text-sm">
                Back to admin
              </Link>
            </div>

            {employers && employers.length > 0 ? (
              <div className="mt-8 grid gap-5">
                {employers.map((employer) => {
                  const hasSocialLink = Boolean(
                    employer.linkedin_url ||
                      employer.instagram_url ||
                      employer.facebook_url ||
                      employer.x_url ||
                      employer.youtube_url ||
                      employer.tiktok_url ||
                      employer.other_social_url
                  )

                  const qualityItems = [
                    Boolean(employer.name),
                    employer.description.trim().length >= 80,
                    Boolean(employer.industry),
                    Boolean(employer.location && employer.state),
                    Boolean(employer.website_url),
                    Boolean(employer.contact_email),
                    hasSocialLink,
                  ]

                  const completedQualityItems = qualityItems.filter(Boolean).length
                  const qualityScore = Math.round(
                    (completedQualityItems / qualityItems.length) * 100
                  )

                  return (
                    <div key={employer.id} className="card bg-slate-50">
                      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                        <div>
                          <div className="flex flex-wrap gap-2">
                            <span
                              className={
                                employer.is_verified
                                  ? 'badge-orange'
                                  : 'badge-slate'
                              }
                            >
                              {employer.is_verified
                                ? 'Verified'
                                : 'Needs verification'}
                            </span>

                            <span className="badge-slate">
                              {employer.is_active ? 'Active' : 'Inactive'}
                            </span>

                            <span className="badge-slate">
                              {qualityScore}% profile quality
                            </span>
                          </div>

                          <h3 className="mt-4 text-2xl font-bold text-slate-950">
                            {employer.name}
                          </h3>

                          <p className="mt-2 font-semibold text-slate-600">
                            {employer.industry || 'Industry not listed'}
                          </p>

                          <p className="muted-text mt-4 line-clamp-2">
                            {employer.description}
                          </p>

                          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <MiniCheck
                              label="Website"
                              complete={Boolean(employer.website_url)}
                            />
                            <MiniCheck
                              label="Contact"
                              complete={Boolean(employer.contact_email)}
                            />
                            <MiniCheck
                              label="Social"
                              complete={hasSocialLink}
                            />
                            <MiniCheck
                              label="Location"
                              complete={Boolean(
                                employer.location && employer.state
                              )}
                            />
                          </div>

                          <p className="mt-4 text-sm font-semibold text-slate-500">
                            {employer.location}, {employer.state}
                          </p>
                        </div>

                        <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
                          {employer.is_active && (
                            <Link
                              href={`/employers/${employer.slug}`}
                              className="btn-dark px-5 py-3 text-sm"
                            >
                              Public profile
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          )}

                          <Link
                            href={`/admin/employers/${employer.id}/edit`}
                            className="btn-outline px-5 py-3 text-sm"
                          >
                            Verify / edit
                            <ArrowRight className="h-4 w-4" />
                          </Link>

                          <span className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600">
                            {employer.is_verified ? (
                              <ShieldCheck className="h-4 w-4 text-orange-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-slate-500" />
                            )}
                            {employer.is_verified
                              ? 'Admin reviewed'
                              : 'Review needed'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8">
                <h3 className="text-xl font-bold text-slate-950">
                  No employers yet
                </h3>

                <p className="muted-text mt-2">
                  Add only real employers after checking their information.
                </p>

                <Link href="/admin/employers/new" className="btn-primary mt-5">
                  Add employer
                  <Plus className="h-4 w-4" />
                </Link>
              </div>
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
      <p className="eyebrow">{label}</p>
      <h2 className="mt-3 text-3xl font-bold text-slate-950">{value}</h2>
    </div>
  )
}

function MiniCheck({
  label,
  complete,
}: {
  label: string
  complete: boolean
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      <div className="flex items-center gap-2">
        {complete ? (
          <CheckCircle2 className="h-4 w-4 text-orange-600" />
        ) : (
          <AlertCircle className="h-4 w-4 text-slate-400" />
        )}

        <p className="text-sm font-semibold text-slate-700">{label}</p>
      </div>
    </div>
  )
}