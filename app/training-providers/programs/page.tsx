import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, GraduationCap, Plus, ShieldCheck } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import ThemedPublicPage from '@/components/theme/ThemedPublicPage'
import ThemedPublicSection from '@/components/theme/ThemedPublicSection'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Provider Programs — ${siteConfig.name}`,
  description:
    'View public program listings and submitted programs connected to an approved training provider workspace.',
}

type ProviderProgram = {
  id: string
  slug: string
  name: string
  program_type: string
  trade_slug: string
  location: string
  state: string
  duration: string | null
  cost: string | null
  description: string
  review_status: string
  review_notes: string | null
  is_active: boolean
  data_origin?: string | null
  source_url?: string | null
  created_at: string
  updated_at: string
}

function formatProgramType(type: string) {
  return type
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

function getSafeString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0 ? value : null
}

export default async function TrainingProviderProgramsPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  const { data: memberships, error: membershipError } = await supabase
    .from('training_provider_memberships')
    .select(
      `
      provider_profile_id,
      role,
      status,
      training_provider_profiles (
        id,
        name,
        city,
        state,
        verification_status
      )
      `
    )
    .eq('user_id', user.id)
    .eq('status', 'active')
    .limit(1)

  if (membershipError) {
    console.error('Failed to load provider membership:', membershipError)
  }

  const membership = memberships?.[0]
  const providerProfile = Array.isArray(membership?.training_provider_profiles)
    ? membership?.training_provider_profiles[0]
    : membership?.training_provider_profiles

  if (!providerProfile) {
    redirect('/training-providers/dashboard')
  }

  const { data, error: programsError } = await supabase
    .from('programs')
    .select('*')
    .eq('provider_profile_id', providerProfile.id)
    .order('created_at', { ascending: false })

  if (programsError) {
    console.error('Failed to load provider programs:', programsError)
  }

  const providerPrograms = ((data ?? []) as unknown as ProviderProgram[]).map(
    (program) => ({
      ...program,
      data_origin: getSafeString(program.data_origin),
      source_url: getSafeString(program.source_url),
    })
  )

  const publicProgramCount = providerPrograms.filter(
    (program) => program.is_active
  ).length

  const pendingProgramCount = providerPrograms.filter(
    (program) => program.review_status === 'pending'
  ).length

  return (
    <ThemedPublicPage>
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <div className="max-w-4xl">
            <p className="eyebrow-dark">Provider programs</p>

            <h1 className="page-title-dark mt-6">
              View programs connected to your provider workspace.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Claimed public listings and submitted program drafts appear here.
              Public listings remain protected by admin review and verification.
            </p>
          </div>
        </div>
      </section>

      <ThemedPublicSection className="pb-20">
        <div className="section-shell">
          <section className="-mt-12 content-panel">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div>
                <p className="eyebrow">Program workspace</p>

                <h2 className="section-title mt-3">{providerProfile.name}</h2>

                <p className="muted-text mt-3">
                  {providerProfile.city}, {providerProfile.state} ·{' '}
                  {providerProfile.verification_status}
                </p>
              </div>

              <Link href="/training-providers/programs/new" className="btn-primary">
                <Plus className="h-4 w-4" />
                Submit program
              </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <StatusCard
                label="Connected programs"
                value={`${providerPrograms.length}`}
              />
              <StatusCard
                label="Public listings"
                value={`${publicProgramCount}`}
              />
              <StatusCard
                label="Pending review"
                value={`${pendingProgramCount}`}
              />
            </div>
          </section>

          <div className="mt-8 grid gap-6">
            {providerPrograms.length > 0 ? (
              providerPrograms.map((program) => {
                const isClaimedPublicRecord =
                  program.data_origin === 'candidate_promoted' ||
                  program.data_origin === 'official_source_import'

                return (
                  <article key={program.id} className="card">
                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                      <div>
                        <div className="flex flex-wrap gap-2">
                          <span className="badge-orange">
                            {formatProgramType(program.program_type)}
                          </span>

                          <span className="badge-slate">
                            {program.review_status}
                          </span>

                          {program.is_active && (
                            <span className="badge-slate">Public</span>
                          )}

                          {isClaimedPublicRecord && (
                            <span className="badge-slate">
                              Claimed public listing
                            </span>
                          )}
                        </div>

                        <h3
                          className="mt-4 text-2xl font-bold"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {program.name}
                        </h3>

                        <p
                          className="mt-3 max-w-3xl line-clamp-3"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {program.description}
                        </p>

                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                          <InfoCard
                            label="Career focus"
                            value={program.trade_slug}
                          />
                          <InfoCard
                            label="Location"
                            value={`${program.location}, ${program.state}`}
                          />
                          <InfoCard
                            label="Duration"
                            value={program.duration || 'Not provided'}
                          />
                        </div>

                        {isClaimedPublicRecord && (
                          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                            <div className="flex items-start gap-3">
                              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                              <div>
                                <p className="text-sm font-bold text-emerald-900">
                                  Connected claimed listing
                                </p>

                                <p className="mt-1 text-sm leading-6 text-emerald-800">
                                  This public listing is now connected to your
                                  provider workspace. Public edits still require
                                  admin review.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {program.review_notes && (
                          <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 p-4">
                            <p className="text-sm font-bold text-orange-900">
                              Admin review notes
                            </p>

                            <p className="mt-2 text-sm leading-6 text-orange-800">
                              {program.review_notes}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex shrink-0 flex-col gap-3">
                        {program.is_active && (
                          <Link href={`/programs/${program.slug}`} className="btn-dark">
                            View public page
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        )}  
                          <Link href={`/training-providers/programs/${program.id}/request-update`}
                              className="btn-outline"
                              >
                          Request update
                          </Link>
                          
                        {program.source_url && (
                          <a
                            href={program.source_url}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-outline"
                          >
                            View source
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                )
              })
            ) : (
              <section className="content-panel text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                  <GraduationCap className="h-8 w-8" />
                </div>

                <h2 className="section-title mt-6">
                  No programs connected yet.
                </h2>

                <p className="muted-text mx-auto mt-4 max-w-2xl">
                  Connected public listings will appear here after an admin
                  approves a program claim and creates your provider workspace.
                  You can also submit new real programs for admin review.
                </p>

              </section>
            )}
          </div>
        </div>
      </ThemedPublicSection>
    </ThemedPublicPage>
  )
}

function StatusCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="mini-card">
      <p
        className="text-xs font-bold uppercase tracking-wide"
        style={{ color: 'var(--text-muted)' }}
      >
        {label}
      </p>

      <p
        className="mt-2 text-2xl font-bold"
        style={{ color: 'var(--text-primary)' }}
      >
        {value}
      </p>
    </div>
  )
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="mini-card">
      <p
        className="text-xs font-bold uppercase tracking-wide"
        style={{ color: 'var(--text-muted)' }}
      >
        {label}
      </p>

      <p
        className="mt-2 font-semibold"
        style={{ color: 'var(--text-primary)' }}
      >
        {value}
      </p>
    </div>
  )
}
