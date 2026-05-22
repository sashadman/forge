import DashboardProfilePanel from '@/components/dashboard/DashboardProfilePanel'
import MissionPageFrame from '@/components/dashboard/mission/MissionPageFrame'
import { getDashboardPageData } from '@/lib/dashboard/get-dashboard-page-data'

export default async function DashboardProfilePage() {
  const { user, profile, readinessItems, readinessScore } =
    await getDashboardPageData()

  return (
    <MissionPageFrame
      eyebrow="Profile mission"
      title="Complete your seeker profile."
      description="Keep your basic profile information current so your career journey, readiness work, and applications have a strong foundation."
      primaryHref="/dashboard/readiness"
      primaryLabel="Next: readiness mission"
    >
      <div className="mx-auto max-w-4xl">
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
    </MissionPageFrame>
  )
}