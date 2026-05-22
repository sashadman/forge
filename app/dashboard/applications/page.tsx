import Link from 'next/link'
import { ArrowRight, ClipboardCheck } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import BackLink from '@/components/ui/BackLink'
import SubmittedApplicationsSection from '@/components/dashboard/SubmittedApplicationsSection'
import DashboardActionCenter from '@/components/dashboard/DashboardActionCenter'
import { getDashboardPageData } from '@/lib/dashboard/get-dashboard-page-data'

export default async function DashboardApplicationsPage() {
  const {
    savedProgramPipelineItems,
    savedOpportunityPipelineItems,
    submittedApplications,
  } = await getDashboardPageData()

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
              Application mission
            </p>

            <h1 className="mt-6 text-5xl font-black tracking-tight md:text-6xl">
              Manage applications and next actions.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Review submitted applications, follow-up tasks, saved listings,
              and next actions from one focused page.
            </p>

            <Link href="/opportunities" className="btn-light mt-8">
              Find more jobs & apprenticeships
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell space-y-8 pt-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                <ClipboardCheck className="h-6 w-6" />
              </div>

              <div>
                <p className="font-bold text-slate-950">Mission purpose</p>
                <p className="text-slate-600">
                  Keep applications and follow-ups from getting lost.
                </p>
              </div>
            </div>
          </div>

          <DashboardActionCenter
            programItems={savedProgramPipelineItems}
            opportunityItems={savedOpportunityPipelineItems}
          />

          <SubmittedApplicationsSection applications={submittedApplications} />
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}