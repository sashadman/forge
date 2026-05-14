import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, CheckCircle2, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'
import { TRADE_MAP, formatSalary } from '@/utils/trades'
import type { TradeCategory } from '@/types'
import ProfileForm from '@/components/dashboard/ProfileForm'

type QuizResultItem = {
  trade: TradeCategory
  score: number
  rank: number
}

function formatProgramType(type: string) {
  return type
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, role, location, experience_level, quiz_completed')
    .eq('id', user.id)
    .single()

  const { data: latestQuizResult } = await supabase
    .from('quiz_results')
    .select('results, completed_at')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { data: savedTrades } = await supabase
    .from('saved_trades')
    .select('trade_slug')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: savedPrograms } = await supabase
    .from('saved_programs')
    .select(
      `
      program_id,
      created_at,
      programs (
        slug,
        name,
        provider_name,
        program_type,
        trade_slug,
        location,
        state,
        duration,
        description
      )
    `
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const quizResults = (latestQuizResult?.results ?? []) as unknown as QuizResultItem[]

  return (
    <main className="page-shell">
      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-16">
          <p className="eyebrow-dark">Dashboard</p>

          <div className="mt-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="page-title-dark">
                Welcome to {siteConfig.name}
              </h1>

              <p className="lead-text-dark mt-4 max-w-2xl">
                Continue exploring skilled trades, review your quiz results, and build your career path.
              </p>
            </div>

            <Link href="/trades" className="btn-light">
              Explore trades
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <aside className="content-panel -mt-12 self-start">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
              <User className="h-7 w-7" />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-950">
              {profile?.full_name || 'Your profile'}
            </h2>

            <p className="mt-2 text-slate-600">{profile?.email || user.email}</p>

            <div className="mt-6">
              <ProfileForm
                userId={user.id}
                fullName={profile?.full_name || ''}
                location={profile?.location || ''}
                experienceLevel={profile?.experience_level || ''}
              />
            </div>
          </aside>

          <div className="-mt-12 space-y-8">
            <section className="content-panel">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <p className="eyebrow">Career match</p>

                  <h2 className="section-title mt-3">
                    Your latest quiz result
                  </h2>
                </div>

                <Link href="/quiz" className="btn-outline px-5 py-2 text-sm">
                  Retake quiz
                </Link>
              </div>

              {quizResults.length > 0 ? (
                <div className="mt-8 grid gap-5">
                  {quizResults.map((result) => {
                    const trade = TRADE_MAP[result.trade]

                    if (!trade) return null

                    return (
                      <div key={result.trade} className="card-soft">
                        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 font-bold text-white">
                                {result.rank}
                              </span>

                              <div>
                                <h3 className="text-2xl font-bold text-slate-950">
                                  {trade.name}
                                </h3>
                                <p className="text-slate-600">{trade.tagline}</p>
                              </div>
                            </div>

                            <p className="muted-text mt-5 max-w-3xl">
                              {trade.description}
                            </p>

                            <div className="mt-5 flex flex-wrap gap-2">
                              {trade.key_skills.slice(0, 4).map((skill) => (
                                <span key={skill} className="badge-slate bg-white">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="mini-card-white min-w-40">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Match score
                            </p>
                            <p className="mt-1 text-3xl font-bold text-orange-600">
                              {result.score}%
                            </p>

                            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Median salary
                            </p>
                            <p className="mt-1 font-bold text-slate-950">
                              {formatSalary(trade.median_salary)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-6">
                          <Link
                            href={`/trades/${trade.slug}`}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-orange-700 hover:text-orange-800"
                          >
                            View career profile
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <EmptyState
                  title="No saved quiz result yet"
                  description="Take the career quiz to get your first personalized trade matches."
                  href="/quiz"
                  action="Take career quiz"
                  variant="orange"
                />
              )}
            </section>

            <section className="content-panel">
              <SectionHeader
                eyebrow="Saved trades"
                title="Your bookmarked careers"
                href="/trades"
                action="Explore more"
              />

              {savedTrades && savedTrades.length > 0 ? (
                <div className="mt-8 grid gap-5 md:grid-cols-2">
                  {savedTrades.map((savedTrade) => {
                    const trade = TRADE_MAP[savedTrade.trade_slug as TradeCategory]

                    if (!trade) return null

                    return (
                      <Link
                        key={trade.slug}
                        href={`/trades/${trade.slug}`}
                        className="card card-hover group bg-slate-50"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-2xl font-bold text-slate-950 transition group-hover:text-orange-700">
                              {trade.name}
                            </h3>

                            <p className="mt-2 text-slate-600">{trade.tagline}</p>
                          </div>

                          <ArrowCircle />
                        </div>

                        <div className="mt-6 flex flex-wrap gap-2">
                          {trade.key_skills.slice(0, 3).map((skill) => (
                            <span key={skill} className="badge-slate bg-white">
                              {skill}
                            </span>
                          ))}
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Median salary
                            </p>

                            <p className="mt-1 font-bold text-slate-950">
                              {formatSalary(trade.median_salary)}
                            </p>
                          </div>

                          <span className="badge-orange">Saved</span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <EmptyState
                  title="No saved trades yet"
                  description="Save trades while exploring career paths to build your personal shortlist."
                  href="/trades"
                  action="Explore trades"
                />
              )}
            </section>

            <section className="content-panel">
              <SectionHeader
                eyebrow="Saved programs"
                title="Your training pathways"
                description="Keep track of apprenticeships, workforce programs, and training options you want to revisit."
                href="/programs"
                action="Explore programs"
              />

              {savedPrograms && savedPrograms.length > 0 ? (
                <div className="mt-8 grid gap-5 md:grid-cols-2">
                  {savedPrograms.map((savedProgram) => {
                    const program = savedProgram.programs

                    if (!program) return null

                    return (
                      <Link
                        key={savedProgram.program_id}
                        href={`/programs/${program.slug}`}
                        className="card card-hover group bg-slate-50"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="badge-orange">
                              {formatProgramType(program.program_type)}
                            </span>

                            <h3 className="mt-4 text-2xl font-bold text-slate-950 transition group-hover:text-orange-700">
                              {program.name}
                            </h3>

                            <p className="mt-2 font-semibold text-slate-600">
                              {program.provider_name}
                            </p>
                          </div>

                          <ArrowCircle />
                        </div>

                        <p className="muted-text mt-5 line-clamp-3">
                          {program.description}
                        </p>

                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                          <div className="mini-card-white">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Location
                            </p>

                            <p className="mt-1 font-bold text-slate-950">
                              {program.location}, {program.state}
                            </p>
                          </div>

                          <div className="mini-card-white">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Duration
                            </p>

                            <p className="mt-1 font-bold text-slate-950">
                              {program.duration || 'See provider'}
                            </p>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <EmptyState
                  title="No saved programs yet"
                  description="Save programs while browsing training pathways so you can compare them later."
                  href="/programs"
                  action="Explore programs"
                />
              )}
            </section>
          </div>
        </div>
      </section>
    </main>
  )
}

function SectionHeader({
  eyebrow,
  title,
  description,
  href,
  action,
}: {
  eyebrow: string
  title: string
  description?: string
  href: string
  action: string
}) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
      <div>
        <p className="eyebrow">{eyebrow}</p>

        <h2 className="section-title mt-3">{title}</h2>

        {description && <p className="muted-text mt-3 max-w-2xl">{description}</p>}
      </div>

      <Link href={href} className="btn-outline px-5 py-2 text-sm">
        {action}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}

function EmptyState({
  title,
  description,
  href,
  action,
  variant = 'dark',
}: {
  title: string
  description: string
  href: string
  action: string
  variant?: 'dark' | 'orange'
}) {
  return (
    <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8">
      <div className="flex items-start gap-4">
        <CheckCircle2 className="mt-1 h-6 w-6 text-orange-600" />

        <div>
          <h3 className="text-xl font-bold text-slate-950">{title}</h3>

          <p className="muted-text mt-2">{description}</p>

          <Link
            href={href}
            className={variant === 'orange' ? 'btn-primary mt-5' : 'btn-dark mt-5'}
          >
            {action}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

function ArrowCircle() {
  return (
    <div className="rounded-full bg-white p-3 ring-1 ring-slate-200 transition group-hover:ring-orange-200">
      <ArrowRight className="h-5 w-5 text-slate-700 group-hover:text-orange-700" />
    </div>
  )
}