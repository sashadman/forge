import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  DollarSign,
  GraduationCap,
  TrendingUp,
  Wrench,
  XCircle,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import BackLink from '@/components/ui/BackLink'
import NextStepPanel from '@/components/ui/NextStepPanel'
import { TRADES, TRADE_MAP, formatSalaryRange, formatSalary } from '@/utils/trades'
import type { TradeCategory } from '@/types'
import SaveTradeButton from '@/components/trades/SaveTradeButton'
import { siteConfig } from '@/config/site'

type CareerPathDetailPageProps = {
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

export function generateMetadata({
  params,
}: CareerPathDetailPageProps): Metadata {
  const trade = TRADE_MAP[params.slug as TradeCategory]

  if (!trade) {
    return {
      title: `Career Path Not Found — ${siteConfig.name}`,
    }
  }

  return {
    title: `${trade.name} Career Path — ${siteConfig.name}`,
    description: trade.description,
  }
}

export default function CareerPathDetailPage({
  params,
}: CareerPathDetailPageProps) {
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
          <BackLink
            href="/trades"
            label="Back to career paths"
            variant="light"
          />

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <p className="eyebrow-dark">Career path</p>

              <h1 className="page-title-dark mt-6">{trade.name}</h1>

              <p className="mt-5 text-2xl font-semibold text-orange-300">
                {trade.tagline}
              </p>

              <p className="lead-text-dark mt-6 max-w-3xl">
                {trade.description}
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href="/quiz" className="btn-primary px-7 py-4">
                  Check fit with quiz
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-5 shadow-2xl shadow-black/30 backdrop-blur">
              <div className="rounded-[1.5rem] bg-white p-6 text-slate-950">
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
                    icon={Wrench}
                    label="Work style"
                    value="Hands-on skilled work"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="pt-8">
            <NextStepPanel
              title="Turn this career path into a practical next step."
              description="Use this page to understand the work, then compare training programs or look for real jobs and apprenticeships connected to this direction."
              primaryHref="/programs"
              primaryLabel="Explore training programs"
              secondaryHref="/opportunities"
              secondaryLabel="View jobs & apprenticeships"
              icon={<GraduationCap className="h-6 w-6" />}
            />
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <section className="content-panel">
              <p className="eyebrow">Earning potential</p>

              <h2 className="section-title mt-3">
                {formatSalaryRange(trade.salary_range.min, trade.salary_range.max)}
              </h2>

              <p className="muted-text mt-4">
                Pay can vary by region, experience, certifications, union status,
                employer, and whether the worker becomes self-employed.
              </p>

              <div className="mt-8 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
                <p className="text-sm font-semibold text-slate-950">
                  Typical preparation timeline
                </p>

                <p className="mt-2 text-slate-600">
                  {trade.training_duration}
                </p>
              </div>

              <div className="mt-6">
                <SaveTradeButton tradeSlug={trade.slug} />
              </div>
            </section>

            <section className="content-panel">
              <p className="eyebrow">Day in the life</p>

              <h2 className="section-title mt-3">
                What the work can look like
              </h2>

              <p className="lead-text mt-5">{trade.day_in_life}</p>
            </section>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <InfoList
              title="Key skills"
              icon={Wrench}
              items={trade.key_skills}
            />

            <InfoList
              title="Credentials to research"
              icon={Award}
              items={trade.certifications}
            />

            <InfoList
              title="Common work settings"
              icon={CheckCircle2}
              items={trade.top_employers}
            />
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <section className="rounded-3xl border border-emerald-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-5 w-5" />
                </div>

                <h2 className="text-2xl font-bold text-slate-950">
                  Why this path can be a good fit
                </h2>
              </div>

              <ul className="mt-6 space-y-3">
                {trade.pros.map((item) => (
                  <li key={item} className="flex gap-3 text-slate-700">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
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
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

        </div>
      </section>
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
    <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
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
    <section className="content-panel">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
          <Icon className="h-5 w-5" />
        </div>

        <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
      </div>

      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-slate-700">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
