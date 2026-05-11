import Link from 'next/link'

export default function HomeEmployerCTA() {
  return (
    <section id="employers" className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-3xl bg-slate-950 px-8 py-16 text-white md:px-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-400">
              For employers and programs
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Build your future workforce pipeline.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-300">
              Create a profile, list opportunities, and connect with people exploring
              apprenticeships and entry-level skilled trade careers.
            </p>

            <Link
              href="/employers"
              className="mt-8 inline-flex rounded-full bg-white px-7 py-4 font-semibold text-slate-950 hover:bg-slate-100"
            >
              Join as an employer
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}