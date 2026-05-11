import Link from 'next/link'
import { ArrowRight, Zap, Wind, Sun, Droplets } from 'lucide-react'

const featuredTrades = [
  {
    name: 'Electrician',
    icon: Zap,
    description: 'Install, maintain, and repair electrical systems.',
  },
  {
    name: 'HVAC Technician',
    icon: Wind,
    description: 'Work with heating, cooling, and ventilation systems.',
  },
  {
    name: 'Solar Technician',
    icon: Sun,
    description: 'Install and maintain solar energy systems.',
  },
  {
    name: 'Plumber',
    icon: Droplets,
    description: 'Build and repair water, drainage, and piping systems.',
  },
]

export default function HomeFeaturedTrades() {
  return (
    <section id="trades" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
              Explore trades
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Start with high-demand career paths.
            </h2>
          </div>

          <Link
            href="/trades"
            className="inline-flex items-center gap-2 font-semibold text-orange-700"
          >
            View all trades
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featuredTrades.map((trade) => {
            const Icon = trade.icon

            return (
              <div
                key={trade.name}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-orange-700 shadow-sm">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mt-6 text-xl font-bold">{trade.name}</h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {trade.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}