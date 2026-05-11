import Link from 'next/link'
import { ArrowRight, Wrench, Zap, Wind, Sun } from 'lucide-react'

const previewTrades = [
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
]

export default function HomeHero() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
            Skilled trades career discovery
          </p>

          <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl">
            Find a real career path in the skilled trades.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Discover trade careers, compare training options, find apprenticeships,
            and connect with employers looking for future workers.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-600 px-7 py-4 font-semibold text-white hover:bg-orange-700"
            >
              Start career quiz
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/employers"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-7 py-4 font-semibold text-slate-800 hover:bg-slate-100"
            >
              I am an employer
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                <Wrench className="h-6 w-6" />
              </div>

              <div>
                <p className="font-bold">Career Match Preview</p>
                <p className="text-sm text-slate-500">Based on your interests</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {previewTrades.map((trade) => {
                const Icon = trade.icon

                return (
                  <div
                    key={trade.name}
                    className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="font-semibold">{trade.name}</p>
                      <p className="text-sm text-slate-500">{trade.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}