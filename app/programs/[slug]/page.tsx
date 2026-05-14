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
import SaveTradeButton from '@/components/trades/SaveTradeButton'

type TradeDetailPageProps = {
  params: {
    slug: string
  }
}

type IconType = React.ComponentType<{ className?: string }>

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
    <main className="page-shell">
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <Link
            href="/trades"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all trades
          </Link>

          <div className="mt-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <p className="eyebrow-dark">Skilled trade career path</p>

              <h1 className="page-title-dark mt-6">{trade.name}</h1>

              <p className="mt-5 text-2xl font-semibold text-orange-300">
                {trade.tagline}
              </p>

              <p className="lead-text-dark mt-6 max-w-3xl">
                {trade.description}
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                <Link href="/quiz" className="btn-primary px-7 py-4">
                  See if this trade fits you
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link href="/trades" className="btn-outline-dark px-7 py-4">
                  Compare other trades
                </Link>

                <SaveTradeButton tradeSlug={trade.slug} />
              </div>
            </div>

            <div className="card-dark">
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

      <section className="section-light section-padding">
        <div className="section-shell grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="content-panel">
            <p className="eyebrow">Salary range</p>

            <h2 className="section-title mt-3">
              {formatSalaryRange(trade.salary_range.min, trade.salary_range.max)}
            </h2>

            <p className="muted-text mt-4">
              Pay can vary by region, experience, certifications, union status, employer,
              and whether the worker becomes self-employed.
            </p>

            <div className="mini-card mt-8">
              <p className="text-sm font-semibold text-slate-950">
                Training path
              </p>
              <p className="mt-2 text-slate-600">{trade.training_duration}</p>
            </div>
          </section>

          <section className="content-panel">
            <p className="eyebrow">Day in the life</p>

            <h2 className="section-title mt-3">
              What the work can look like
            </h2>

            <p className="lead-text mt-4">{trade.day_in_life}</p>
          </section>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell grid gap-8 lg:grid-cols-3">
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

      <section className="section-light pb-20">
        <div className="section-shell grid gap-8 lg:grid-cols-2">
          <div className="card p-8">
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

          <div className="card p-8">
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

      <section className="section-light pb-24">
        <div className="section-shell">
          <div className="dark-panel px-8 py-14 md:px-14">
            <div className="dark-panel-content max-w-3xl">
              <p className="eyebrow-dark">Next step</p>

              <h2 className="section-title-dark mt-4">
                Turn interest into a real career plan.
              </h2>

              <p className="lead-text-dark mt-4">
                Compare this trade with other paths, take the quiz, and later connect with
                programs and employers that match your goals.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href="/quiz" className="btn-light">
                  Take the career quiz
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link href="/trades" className="btn-outline-dark">
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
    <div className="rounded-2xl bg-white/95 p-5 text-slate-950 ring-1 ring-white/20">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 font-bold text-slate-950">{value}</p>
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
    <div className="card p-8">
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