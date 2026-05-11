import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  DollarSign,
  Hammer,
  TrendingUp,
  XCircle,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import { TRADES, TRADE_MAP, formatSalaryRange, formatSalary } from '@/utils/trades'
import type { TradeCategory } from '@/types'

type TradeDetailPageProps = {
  params: {
    slug: string
  }
}

export function generateStaticParams() {
  return TRADES.map((trade) => ({
    slug: trade.slug,
  }))
}

export function generateMetadata({ params }: TradeDetailPageProps): Metadata {
  const trade = TRADE_MAP[params.slug as TradeCategory]

  if (!trade) {
    return {
      title: 'Trade Not Found — Forge',
    }
  }

  return {
    title: `${trade.name} Career Path — Forge`,
    description: trade.description,
  }
}

export default function TradeDetailPage({ params }: TradeDetailPageProps) {
  const trade = TRADE_MAP[params.slug as TradeCategory]

  if (!trade) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <SiteNavbar />

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <Link
            href="/trades"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-orange-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all trades
          </Link>

          <div className="mt-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
                Skilled trade career path
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
                {trade.name}
              </h1>

              <p className="mt-4 text-2xl font-semibold text-slate-700">
                {trade.tagline}
              </p>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
                {trade.description}
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/quiz"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-600 px-7 py-4 font-semibold text-white hover:bg-orange-700"
                >
                  See if this trade fits you
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/trades"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 px-7 py-4 font-semibold text-slate-800 hover:bg-slate-100"
                >
                  Compare other trades
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <StatCard
                  icon={DollarSign}
                  label="Median salary"
                  value={formatSalary(trade.median_salary)}
                />

                <StatCard
                  icon={TrendingUp}
                  label="Job growth"
                  value={`+${trade.job_growth_rate}%`}
                />

                <StatCard
                  icon={Clock}
                  label="Training time"
                  value={trade.training_duration}
                />

                <StatCard
                  icon={Hammer}
                  label="Career type"
                  value="Hands-on skilled work"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
              Salary range
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-950">
              {formatSalaryRange(trade.salary_range.min, trade.salary_range.max)}
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Pay can vary by region, experience, certifications, union status, employer,
              and whether the worker becomes self-employed.
            </p>

            <div className="mt-8 rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-950">
                Training path
              </p>
              <p className="mt-2 text-slate-600">
                {trade.training_duration}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
              Day in the life
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-950">
              What the work can look like
            </h2>

            <p className="mt-4 leading-8 text-slate-600">
              {trade.day_in_life}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-3">
          <InfoList
            title="Key skills"
            icon={Hammer}
            items={trade.key_skills}
          />

          <InfoList
            title="Certifications"
            icon={Award}
            items={trade.certifications}
          />

          <InfoList
            title="Common employers"
            icon={CheckCircle2}
            items={trade.top_employers}
          />
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-emerald-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold text-slate-950">
                Why this trade can be a good fit
              </h2>
            </div>

            <ul className="mt-6 space-y-3">
              {trade.pros.map((item) => (
                <li key={item} className="flex gap-3 text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <XCircle className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold text-slate-950">
                Things to consider
              </h2>
            </div>

            <ul className="mt-6 space-y-3">
              {trade.cons.map((item) => (
                <li key={item} className="flex gap-3 text-slate-700">
                  <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-3xl bg-slate-950 px-8 py-14 text-white md:px-14">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-orange-400">
                Next step
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight">
                Turn interest into a real career plan.
              </h2>

              <p className="mt-4 leading-7 text-slate-300">
                Compare this trade with other paths, take the quiz, and later connect with
                programs and employers that match your goals.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/quiz"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-slate-950 hover:bg-slate-100"
                >
                  Take the career quiz
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/trades"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10"
                >
                  Compare trades
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}

type IconType = React.ComponentType<{ className?: string }>

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: IconType
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 font-bold text-slate-950">
        {value}
      </p>
    </div>
  )
}

function InfoList({
  title,
  icon: Icon,
  items,
}: {
  title: string
  icon: IconType
  items: string[]
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
      </div>

      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-slate-700">
            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-600" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}