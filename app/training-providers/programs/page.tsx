import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, GraduationCap, Plus } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import ThemedPublicPage from '@/components/theme/ThemedPublicPage'
import ThemedPublicSection from '@/components/theme/ThemedPublicSection'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Provider Programs — ${siteConfig.name}`,
  description: 'Manage training programs submitted by an approved provider.',
}

function formatProgramType(type: string) {
  return type
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
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

  const { data: programs, error: programsError } = await supabase
    .from('programs')
    .select(
      `
      id,
      slug,
      name,
      program_type,
      trade_slug,
      location,
      state,
      duration,
      cost,
      description,
      review_status,
      review_notes,
      is_active,
      created_at,
      updated_at
      `
    )
    .eq('provider_profile_id', providerProfile.id)
    .order('created_at', { ascending: false })

  if (programsError) {
    console.error('Failed to load provider programs:', programsError)
  }

  const providerPrograms = programs ?? []

  return (
    <ThemedPublicPage>
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <div className="max-w-4xl">
            <p className="eyebrow-dark">Provider programs</p>

            <h1 className="page-title-dark mt-6">
              Manage submitted training programs.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Add real training programs connected to {providerProfile.name}.
              Programs become public only after admin approval.
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
          </section>

          <div className="mt-8 grid gap-6">
            {providerPrograms.length > 0 ? (
              providerPrograms.map((program) => (
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
                      </div>

                      <h3 className="mt-4 text-2xl font-bold text-slate-950">
                        {program.name}
                      </h3>

                      <p className="mt-3 max-w-3xl line-clamp-3 text-slate-600">
                        {program.description}
                      </p>

                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        <InfoCard label="Career focus" value={program.trade_slug} />
                        <InfoCard
                          label="Location"
                          value={`${program.location}, ${program.state}`}
                        />
                        <InfoCard
                          label="Duration"
                          value={program.duration || 'Not provided'}
                        />
                      </div>

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
                      {program.is_active ? (
                        <Link href={`/programs/${program.slug}`} className="btn-dark">
                          View public page
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      ) : (
                        <Link href="/for-programs#program-data" className="btn-outline">
                          Review data model
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <section className="content-panel text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                  <GraduationCap className="h-8 w-8" />
                </div>

                <h2 className="section-title mt-6">
                  No provider programs submitted yet.
                </h2>

                <p className="muted-text mx-auto mt-4 max-w-2xl">
                  Submit the first real program for admin review. Keep it
                  accurate, specific, and connected to your provider profile.
                </p>

                <div className="mt-8 flex justify-center">
                  <Link href="/training-providers/programs/new" className="btn-primary">
                    Submit program
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </section>
            )}
          </div>
        </div>
      </ThemedPublicSection>

      <SiteFooter />
    </ThemedPublicPage>
  )
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="mini-card">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 font-semibold text-slate-950">{value}</p>
    </div>
  )
}