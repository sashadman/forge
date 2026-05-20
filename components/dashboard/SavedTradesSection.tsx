import Link from 'next/link'
import { TRADE_MAP, formatSalary } from '@/utils/trades'
import type { TradeCategory } from '@/types'
import DashboardSectionHeader from '@/components/dashboard/DashboardSectionHeader'
import DashboardEmptyState from '@/components/dashboard/DashboardEmptyState'
import DashboardArrowCircle from '@/components/dashboard/ArrowCircle'
import RemoveSavedTradeButton from '@/components/dashboard/RemoveSavedTradeButton'

type SavedTrade = {
  trade_slug: string
}

type SavedTradesSectionProps = {
  savedTrades: SavedTrade[] | null
}

export default function SavedTradesSection({
  savedTrades,
}: SavedTradesSectionProps) {
  return (
    <section className="content-panel">
      <DashboardSectionHeader
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
              <div key={trade.slug} className="card bg-slate-50">
                <Link href={`/trades/${trade.slug}`} className="group block">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-950 transition group-hover:text-orange-700">
                        {trade.name}
                      </h3>

                      <p className="mt-2 text-slate-600">{trade.tagline}</p>
                    </div>

                    <DashboardArrowCircle />
                  </div>
                </Link>

                <div className="mt-6 flex flex-wrap gap-2">
                  {trade.key_skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="badge-slate bg-white">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Median salary
                    </p>

                    <p className="mt-1 font-bold text-slate-950">
                      {formatSalary(trade.median_salary)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="badge-orange">Saved</span>
                    <RemoveSavedTradeButton tradeSlug={trade.slug} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <DashboardEmptyState
          title="No saved trades yet"
          description="Save trades while exploring career paths to build your personal shortlist."
          href="/trades"
          action="Explore trades"
        />
      )}
    </section>
  )
}