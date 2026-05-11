import Link from 'next/link'
import { Building2, Users, ClipboardCheck } from 'lucide-react'

const items = [
  {
    title: 'Create your profile',
    description: 'Show career seekers who you are and what opportunities you offer.',
    icon: Building2,
  },
  {
    title: 'Receive interested leads',
    description: 'Connect with people exploring apprenticeships and entry-level trade roles.',
    icon: Users,
  },
  {
    title: 'Build your pipeline',
    description: 'Track interest and grow a stronger local workforce pipeline over time.',
    icon: ClipboardCheck,
  },
]

export default function ForEmployers() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
              For employers and programs
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Reach people who are serious about skilled trades.
            </h2>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              The platform helps employers, schools, and apprenticeship programs become visible
              to future workers.
            </p>

            <Link
              href="/employers"
              className="mt-8 inline-flex rounded-full bg-slate-950 px-6 py-3 font-semibold text-white hover:bg-slate-800"
            >
              Join as an employer
            </Link>
          </div>

          <div className="grid gap-5">
            {items.map((item) => {
              const Icon = item.icon

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 p-6 shadow-sm"
                >
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-950">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
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
    </section>
  )
}