import DashboardProfilePanel from '@/components/dashboard/DashboardProfilePanel'
import MissionPageFrame from '@/components/dashboard/mission/MissionPageFrame'
import MissionNextStep from '@/components/dashboard/mission/MissionNextStep'
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
      <div className="mx-auto max-w-4xl space-y-8">
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

        <MissionNextStep
          title="Profile complete? Build readiness next."
          description="Once your basic profile is in place, move into readiness so your future applications have stronger supporting information."
          primaryHref="/dashboard/readiness"
          primaryLabel="Go to readiness mission"
        />
      </div>
    </MissionPageFrame>
  )
}