import Link from 'next/link'
import { ArrowRight, BriefcaseBusiness } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import BackLink from '@/components/ui/BackLink'
import SavedOpportunitiesSection from '@/components/dashboard/SavedOpportunitiesSection'
import { getDashboardPageData } from '@/lib/dashboard/get-dashboard-page-data'

export default async function DashboardJobsPage() {
  const { user, savedOpportunityPipelineItems } = await getDashboardPageData()

  return (
    <main className="page-shell">
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <BackLink href="/dashboard" label="Back to mission hub" variant="light" />

          <div className="mt-10 max-w-4xl">
            <p className="eyebrow-dark">Jobs mission</p>
            <h1 className="page-title-dark mt-6">
              Track jobs and apprenticeships.
            </h1>
            <p className="lead-text-dark mt-6 max-w-3xl">
              Keep saved listings organized from interest to research, applying,
              interviewing, and closed.
            </p>

            <Link href="/opportunities" className="btn-primary mt-8">
              View jobs & apprenticeships
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
                <BriefcaseBusiness className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-slate-950">Mission purpose</p>
                <p className="text-slate-600">
                  Move from browsing to focused application tracking.
                </p>
              </div>
            </div>
          </div>

          <SavedOpportunitiesSection
            userId={user.id}
            items={savedOpportunityPipelineItems}
          />
        </div>
      </section>
    </main>
  )
}