import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import TradeCard from '@/components/trades/TradeCard'
import { FEATURED_TRADES } from '@/utils/trades'

export default function FeaturedTrades() {
  return (
    <section className="section-padding bg-forge-ash">
      <div className="section-container">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <p className="section-label mb-2">Explore trades</p>
            <h2 className="section-title">
              Find the career{' '}
              <br className="hidden sm:block" />
              built for you
            </h2>
          </div>
          <div>
            <p className="text-forge-steel text-sm max-w-xs">
              Every trade here has more open jobs than qualified workers — and pays without requiring a 4-year degree.
            </p>
          </div>
        </div>

        {/* Trade grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {FEATURED_TRADES.map(trade => (
            <TradeCard key={trade.id} trade={trade} variant="featured" />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/trades" className="btn-dark inline-flex">
            View all trades
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  )
}