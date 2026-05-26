import ProfileForm from '@/components/dashboard/ProfileForm'
import MissionPageFrame from '@/components/dashboard/mission/MissionPageFrame'
import MissionNextStep from '@/components/dashboard/mission/MissionNextStep'
import ProfileCompletionMeter from '@/components/dashboard/profile/ProfileCompletionMeter'
import ProfileMissionSummary from '@/components/dashboard/profile/ProfileMissionSummary'
import { getDashboardPageData } from '@/lib/dashboard/get-dashboard-page-data'

export default async function DashboardProfilePage() {
  const { user, profile, quizResults } = await getDashboardPageData()

  const fullName = profile?.full_name || ''
  const location = profile?.location || ''
  const experienceLevel = profile?.experience_level || ''
  const quizCompleted = Boolean(profile?.quiz_completed || quizResults.length > 0)

  return (
    <MissionPageFrame
      eyebrow="Profile mission"
      title="Complete your seeker profile."
      description="Set up the basic identity fields that support your readiness work, saved career path decisions, and future applications."
      primaryHref="/dashboard/readiness"
      primaryLabel="Next: readiness mission"
      secondaryHref="/quiz"
      secondaryLabel="Take career quiz"
    >
      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-8">
          <ProfileCompletionMeter
            fullName={fullName}
            location={location}
            experienceLevel={experienceLevel}
            quizCompleted={quizCompleted}
          />

          <ProfileMissionSummary
            fullName={fullName}
            email={profile?.email || user.email}
            location={location}
            experienceLevel={experienceLevel}
          />
        </div>

        <div className="space-y-8">
          <section className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-700">
              Edit profile
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              Update your basic profile.
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              This profile mission uses only the fields currently supported by
              your database: name, location, and experience level.
            </p>

            <div className="mt-6">
              <ProfileForm
                userId={user.id}
                fullName={fullName}
                location={location}
                experienceLevel={experienceLevel}
              />
            </div>
          </section>

          <MissionNextStep
            title="Profile complete? Build readiness next."
            description="Once your basic profile is in place, move into readiness so your future applications have stronger supporting information."
            primaryHref="/dashboard/readiness"
            primaryLabel="Go to readiness mission"
            secondaryHref="/quiz"
            secondaryLabel="Take career quiz"
          />
        </div>
      </div>
    </MissionPageFrame>
  )
}