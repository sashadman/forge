import Link from 'next/link'
import { ArrowRight, Droplets, Sun, Wind, Zap } from 'lucide-react'

const featuredTrades = [
  {
    name: 'Electrician',
    icon: Zap,
    description:
      'Install, maintain, and troubleshoot electrical systems across homes, businesses, and infrastructure.',
    accent: 'from-orange-500 to-amber-400',
  },
  {
    name: 'HVAC Technician',
    icon: Wind,
    description:
      'Work with heating, cooling, and ventilation systems that keep buildings comfortable and efficient.',
    accent: 'from-sky-500 to-cyan-400',
  },
  {
    name: 'Solar Technician',
    icon: Sun,
    description:
      'Help expand clean energy by installing and maintaining solar systems in a growing market.',
    accent: 'from-yellow-500 to-orange-400',
  },
  {
    name: 'Plumber',
    icon: Droplets,
    description:
      'Build and repair piping, drainage, and water systems that keep homes and cities functioning.',
    accent: 'from-blue-500 to-sky-400',
  },
]

export default function HomeFeaturedTrades() {
  return (
    <section id="trades" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-orange-700">
              Explore trades
            </p>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Start with high-demand career paths.
            </h2>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              These are some of the strongest entry points into the skilled trades economy.
              Explore the work, compare pathways, and begin building your shortlist.
            </p>
          </div>

          <Link
            href="/trades"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-900 shadow-sm hover:bg-slate-100"
          >
            View all trades
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featuredTrades.map((trade) => {
            const Icon = trade.icon

            return (
              <div
                key={trade.name}
                className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10"
              >
                <div className={`h-2 w-full bg-gradient-to-r ${trade.accent}`} />

                <div className="p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-900 transition group-hover:bg-orange-100 group-hover:text-orange-700">
                    <Icon className="h-7 w-7" />
                  </div>

                  <h3 className="mt-6 text-2xl font-bold tracking-tight text-slate-950">
                    {trade.name}
                  </h3>

                  <p className="mt-4 leading-7 text-slate-600">
                    {trade.description}
                  </p>

                  <div className="mt-8 flex items-center justify-between">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                      In demand
                    </span>

                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-orange-700">
                      Learn more
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}