import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import BackLink from '@/components/ui/BackLink'
import DashboardProfilePanel from '@/components/dashboard/DashboardProfilePanel'
import { getDashboardPageData } from '@/lib/dashboard/get-dashboard-page-data'

export default async function DashboardProfilePage() {
  const { user, profile, readinessItems, readinessScore } =
    await getDashboardPageData()

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
              Profile mission
            </p>

            <h1 className="mt-6 text-5xl font-black tracking-tight md:text-6xl">
              Complete your seeker profile.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
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

      <SiteFooter />
    </main>
  )
}