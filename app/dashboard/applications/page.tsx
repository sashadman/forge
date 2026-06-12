import Link from 'next/link'
import { ArrowRight, ClipboardCheck } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
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

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <BackLink href="/dashboard" label="Back to mission hub" variant="light" />

          <div className="mt-10 max-w-4xl">
            <p className="eyebrow-dark">Application mission</p>
            <h1 className="page-title-dark mt-6">
              Manage applications and next actions.
            </h1>
            <p className="lead-text-dark mt-6 max-w-3xl">
              Review submitted applications, follow-up tasks, saved listings, and
              next actions from one focused page.
            </p>

            <Link href="/opportunities" className="btn-primary mt-8">
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
    </main>
  )
}