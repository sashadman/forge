import type { Metadata } from 'next'
import Link from 'next/link'
import { Inbox, ShieldCheck } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import PageHero from '@/components/ui/PageHero'
import BackLink from '@/components/ui/BackLink'
import EmptyState from '@/components/ui/EmptyState'
import NextStepPanel from '@/components/ui/NextStepPanel'
import ApplicationReviewCard from '@/components/applications/ApplicationReviewCard'
import { getAdminApplicationsPageData } from '@/lib/admin/get-admin-applications-page-data'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Application Review — ${siteConfig.name}`,
  description: 'Admin review page for all platform applications.',
}

export default async function AdminApplicationsPage() {
  const { applications, stats } = await getAdminApplicationsPageData()

  return (
    <main className="page-shell">
      <SiteNavbar />

      <PageHero
        eyebrow="Admin application review"
        title="Review applications across the platform."
        description="Monitor submitted application packages, employer review status, readiness snapshots, and application timeline history."
        actions={<BackLink href="/admin" label="Back to admin" variant="light" />}
      />

      <section className="section-light pb-20">
        <div className="section-shell">
          <ApplicationStats stats={stats} />

          <div className="mt-8">
            <NextStepPanel
              title="Review applicant movement and keep opportunities healthy."
              description="Use application status updates to understand whether listings are producing real applicant activity. If applications are missing, review opportunity quality and visibility."
              primaryHref="/admin/opportunities"
              primaryLabel="Review opportunities"
              secondaryHref="/admin"
              secondaryLabel="Admin home"
              icon={<ShieldCheck className="h-6 w-6" />}
            />
          </div>

          {applications.length > 0 ? (
            <div className="mt-8 grid gap-6">
              {applications.map((application) => (
                <ApplicationReviewCard
                  key={application.id}
                  application={application}
                  viewer="admin"
                />
              ))}
            </div>
          ) : (
            <div className="mt-8">
              <EmptyState
                icon={<Inbox className="h-6 w-6" />}
                title="No applications yet"
                description="Applications will appear here after seekers apply to real opportunities. The next best step is to review opportunity visibility and source quality."
                primaryHref="/admin/opportunities"
                primaryLabel="Review opportunities"
                secondaryHref="/admin/data-expansion"
                secondaryLabel="Open data expansion"
              />
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

function ApplicationStats({
  stats,
}: {
  stats: {
    total: number
    submitted: number
    reviewed: number
    contacted: number
    interviewing: number
    offered: number
    closed: number
  }
}) {
  return (
    <div className="-mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-7">
      <StatCard label="Total" value={stats.total} />
      <StatCard label="Submitted" value={stats.submitted} />
      <StatCard label="Reviewed" value={stats.reviewed} />
      <StatCard label="Contacted" value={stats.contacted} />
      <StatCard label="Interviewing" value={stats.interviewing} />
      <StatCard label="Offered" value={stats.offered} />
      <StatCard label="Closed" value={stats.closed} />
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="content-panel">
      <p className="eyebrow">{label}</p>
      <h2 className="mt-3 text-3xl font-bold text-slate-950">{value}</h2>
    </div>
  )
}