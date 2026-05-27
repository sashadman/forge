import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { GraduationCap, MapPin } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import { createClient } from '@/lib/supabase/server'
import AdminProviderProgramReviewForm from '@/components/training-providers/AdminProviderProgramReviewForm'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Provider Program Review — ${siteConfig.name}`,
  description: 'Review provider-submitted training programs before publishing.',
}

function formatProgramType(type: string) {
  return type
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
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

  const { data: programs, error } = await supabase
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
      review_status,
      review_notes,
      is_active,
      created_at,
      training_provider_profiles (
        name,
        verification_status
      )
      `
    )
    .not('provider_profile_id', 'is', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to load provider-submitted programs:', error)
  }

  const providerPrograms = programs ?? []
  const pendingCount = providerPrograms.filter(
    (program) => program.review_status === 'pending'
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
              Review provider-submitted programs.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Approve only real, useful, and complete training program records.
              Approved programs become visible in the public directory.
            </p>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="-mt-12 grid gap-5 md:grid-cols-3">
            <StatusPanel label="Provider programs" value={`${providerPrograms.length}`} />
            <StatusPanel label="Pending review" value={`${pendingCount}`} />
            <StatusPanel label="Publishing model" value="Admin review" />
          </div>

          <div className="mt-8 grid gap-6">
            {providerPrograms.length > 0 ? (
              providerPrograms.map((program) => (
                <article key={program.id} className="content-panel">
                  <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
                    <div className="max-w-3xl">
                      <div className="flex flex-wrap gap-2">
                        <span className="eyebrow">{program.review_status}</span>
                        <span className="badge-slate">
                          {formatProgramType(program.program_type)}
                        </span>
                        {program.is_active && <span className="badge-slate">Public</span>}
                      </div>

                      <h2 className="section-title mt-4">{program.name}</h2>

                      <p className="mt-2 font-semibold text-slate-600">
                        {program.provider_name}
                      </p>

                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        <InfoLine
                          icon={<GraduationCap className="h-4 w-4" />}
                          value={program.trade_slug}
                        />

                        <InfoLine
                          icon={<MapPin className="h-4 w-4" />}
                          value={`${program.location}, ${program.state}`}
                        />

                        <InfoLine
                          icon={<GraduationCap className="h-4 w-4" />}
                          value={program.duration || 'Duration not provided'}
                        />
                      </div>

                      <p className="mt-6 leading-7 text-slate-700">
                        {program.description}
                      </p>

                      {program.requirements && program.requirements.length > 0 && (
                        <ReviewList title="Requirements" items={program.requirements} />
                      )}

                      {program.outcomes && program.outcomes.length > 0 && (
                        <ReviewList title="Outcomes" items={program.outcomes} />
                      )}

                      {program.website_url && (
                        <a
                          href={program.website_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-6 inline-flex text-sm font-semibold text-orange-700 hover:text-orange-800"
                        >
                          {program.website_url}
                        </a>
                      )}
                    </div>

                    <div className="w-full lg:max-w-sm">
                      <AdminProviderProgramReviewForm
                        programId={program.id}
                        currentStatus={program.review_status}
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
                  Programs submitted by verified training providers will appear
                  here for admin review.
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
    <div className="mini-card flex items-center gap-2">
      <span className="text-orange-600">{icon}</span>
      <span className="font-semibold text-slate-700">{value}</span>
    </div>
  )
}

function ReviewList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-6 mini-card">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {title}
      </p>

      <ul className="mt-3 space-y-2 text-slate-700">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  )
}