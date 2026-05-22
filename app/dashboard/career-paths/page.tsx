import Link from 'next/link'
import { ArrowRight, Map } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import BackLink from '@/components/ui/BackLink'
import SavedTradesSection from '@/components/dashboard/SavedTradesSection'
import { getDashboardPageData } from '@/lib/dashboard/get-dashboard-page-data'

export default async function DashboardCareerPathsPage() {
  const { savedTrades } = await getDashboardPageData()

  return (
    <main className="page-shell">
      <SiteNavbar />

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-fuchsia-500/10 to-cyan-500/10" />
        <div className="absolute left-1/3 top-0 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="section-shell relative py-20">
          <BackLink href="/dashboard" label="Back to mission hub" variant="light" />

          <div className="mt-10 max-w-4xl">
            <p className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.25em] text-orange-200">
              Career path mission
            </p>

            <h1 className="mt-6 text-5xl font-black tracking-tight md:text-6xl">
              Track your saved career paths.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Use this page to keep your career direction focused before
              comparing training programs or applying to jobs and apprenticeships.
            </p>

            <Link href="/trades" className="btn-light mt-8">
              Compare more career paths
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell pt-8">
          <div className="mb-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                <Map className="h-6 w-6" />
              </div>

              <div>
                <p className="font-bold text-slate-950">Mission purpose</p>
                <p className="text-slate-600">
                  Pick a direction before spending time or money on preparation.
                </p>
              </div>
            </div>
          </div>

          <SavedTradesSection savedTrades={savedTrades} />
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}