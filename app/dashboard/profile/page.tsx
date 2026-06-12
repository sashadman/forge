import SiteNavbar from '@/components/layout/SiteNavbar'
import BackLink from '@/components/ui/BackLink'
import DashboardProfilePanel from '@/components/dashboard/DashboardProfilePanel'
import { getDashboardPageData } from '@/lib/dashboard/get-dashboard-page-data'

export default async function DashboardProfilePage() {
  const {
    user,
    profile,
    readinessItems,
    readinessScore,
  } = await getDashboardPageData()

  return (
    <main className="page-shell">
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <BackLink href="/dashboard" label="Back to mission hub" variant="light" />

          <div className="mt-10 max-w-4xl">
            <p className="eyebrow-dark">Profile mission</p>
            <h1 className="page-title-dark mt-6">Complete your seeker profile.</h1>
            <p className="lead-text-dark mt-6 max-w-3xl">
              Keep your basic profile information current so your career journey,
              readiness work, and applications have a strong foundation.
            </p>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell max-w-4xl pt-8">
          <DashboardProfilePanel
            userId={user.id}
            userEmail={user.email}
            fullName={profile?.full_name || ''}
            profileEmail={profile?.email}
            location={profile?.location || ''}
            experienceLevel={profile?.experience_level || ''}
            readinessItems={readinessItems}
            readinessScore={readinessScore}
          />
        </div>
      </section>
    </main>
  )
}