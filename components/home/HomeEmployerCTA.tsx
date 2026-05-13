import Link from 'next/link'
import { ArrowRight, Building2, GraduationCap, Users } from 'lucide-react'

const ecosystemItems = [
  {
    title: 'Career seekers',
    description: 'Discover trades, save paths, and prepare for next steps.',
    icon: Users,
  },
  {
    title: 'Training programs',
    description: 'Help learners move from interest to structured preparation.',
    icon: GraduationCap,
  },
  {
    title: 'Employers',
    description: 'Build a stronger pipeline of motivated future workers.',
    icon: Building2,
  },
]

export default function HomeEmployerCTA() {
  return (
    <section id="employers" className="bg-slate-50 pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-[2.25rem] bg-slate-950 px-8 py-16 text-white shadow-2xl shadow-slate-900/20 md:px-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.24),transparent_32rem)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.16),transparent_28rem)]" />

          <div className="relative grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div className="max-w-3xl">
              <p className="inline-flex rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-orange-300">
                Marketplace ecosystem
              </p>

              <h2 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
                Build the workforce pipeline, not just another job board.
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-300">
                The platform is being designed to connect career seekers, training
                pathways, and employers into one practical skilled-trades ecosystem.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/trades"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-600 px-7 py-4 font-semibold text-white hover:bg-orange-700"
                >
                  Explore the platform
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/auth/sign-up"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-4 font-semibold text-white hover:bg-white/10"
                >
                  Create account
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              {ecosystemItems.map((item) => {
                const Icon = item.icon

                return (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-300 ring-1 ring-orange-400/20">
                        <Icon className="h-6 w-6" />
                      </div>

                      <div>
                        <h3 className="font-bold text-white">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                          {item.description}
                        </p>
                      </div>
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