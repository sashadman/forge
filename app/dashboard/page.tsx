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

  const quizResults = (latestQuizResult?.results ?? []) as unknown as QuizResultItem[]

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
            Dashboard
          </p>

          <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Welcome to {siteConfig.name}
              </h1>

              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                Continue exploring skilled trades, review your quiz results, and build your career path.
              </p>
            </div>

            <Link
              href="/trades"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 font-semibold text-white hover:bg-slate-800"
            >
              Explore trades
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[0.75fr_1.25fr]">
          <aside className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
              <User className="h-7 w-7" />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-950">
              {profile?.full_name || 'Your profile'}
            </h2>

            <p className="mt-2 text-slate-600">
              {profile?.email || user.email}
            </p>

          <div className="mt-6">
  <ProfileForm
    userId={user.id}
    fullName={profile?.full_name || ''}
    location={profile?.location || ''}
    experienceLevel={profile?.experience_level || ''}
  />
</div> 
          </aside>

          <div className="space-y-8">
            <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
                    Career match
                  </p>

                  <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                    Your latest quiz result
                  </h2>
                </div>

                <Link
                  href="/quiz"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Retake quiz
                </Link>
              </div>

              {quizResults.length > 0 ? (
                <div className="mt-8 grid gap-5">
                  {quizResults.map((result) => {
                    const trade = TRADE_MAP[result.trade]

                    if (!trade) return null

                    return (
                      <div
                        key={result.trade}
                        className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
                      >
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

                            <p className="mt-5 max-w-3xl leading-7 text-slate-600">
                              {trade.description}
                            </p>

                            <div className="mt-5 flex flex-wrap gap-2">
                              {trade.key_skills.slice(0, 4).map((skill) => (
                                <span
                                  key={skill}
                                  className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="min-w-40 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
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
                <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="mt-1 h-6 w-6 text-orange-600" />

                    <div>
                      <h3 className="text-xl font-bold text-slate-950">
                        No saved quiz result yet
                      </h3>

                      <p className="mt-2 leading-7 text-slate-600">
                        Take the career quiz to get your first personalized trade matches.
                      </p>

                      <Link
                        href="/quiz"
                        className="mt-5 inline-flex items-center gap-2 rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-700"
                      >
                        Take career quiz
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </section>
    </main>
  )
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 font-semibold text-slate-950">{value}</p>
    </div>
  )
}