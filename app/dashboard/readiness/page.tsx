import type { Metadata } from 'next'
import ReadinessPanel from '@/components/dashboard/readiness/ReadinessPanel'
import MissionPageFrame from '@/components/dashboard/mission/MissionPageFrame'
import MissionNextStep from '@/components/dashboard/mission/MissionNextStep'
import {
  getCurrentUserReadinessItems,
  getCurrentUserReadinessScore,
} from '@/app/actions/readiness'

export const metadata: Metadata = {
  title: 'Readiness Profile',
  description:
    'Complete your readiness profile so you can take action on training programs, jobs, and apprenticeships.',
}

export default async function ReadinessPage() {
  const [items, score] = await Promise.all([
    getCurrentUserReadinessItems(),
    getCurrentUserReadinessScore(),
  ])

  return (
    <MissionPageFrame
      eyebrow="Readiness mission"
      title="Build the profile you need before applying."
      description="Complete your readiness items so you can move from saved training programs and jobs into real applications with fewer blockers."
      primaryHref="/dashboard/career-paths"
      primaryLabel="Next: career paths"
      secondaryHref="/opportunities"
      secondaryLabel="View jobs & apprenticeships"
    >
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm">
          <p className="font-bold text-slate-950">Readiness mission active</p>

          <p className="mt-2 text-slate-600">
            Required items improve your readiness score and help prepare a
            stronger application package. Your detailed score appears below.
          </p>
        </div>

        <ReadinessPanel initialItems={items} initialScore={score} />

        <MissionNextStep
          title="Ready enough to choose direction?"
          description="After improving readiness, review your saved career paths so your next training and job decisions stay focused."
          primaryHref="/dashboard/career-paths"
          primaryLabel="Go to career paths"
        />
      </div>
    </MissionPageFrame>
  )
}