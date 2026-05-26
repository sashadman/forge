import type { Metadata } from 'next'
import ReadinessPanel from '@/components/dashboard/readiness/ReadinessPanel'
import ReadinessMissionGuide from '@/components/dashboard/readiness/ReadinessMissionGuide'
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
      <div className="mx-auto max-w-6xl space-y-8">
        <ReadinessMissionGuide />

        <ReadinessPanel initialItems={items} initialScore={score} />

        <MissionNextStep
          title="Ready enough to choose direction?"
          description="After improving readiness, review your saved career paths so your next training and job decisions stay focused."
          primaryHref="/dashboard/career-paths"
          primaryLabel="Go to career paths"
          secondaryHref="/opportunities"
          secondaryLabel="View jobs & apprenticeships"
        />
      </div>
    </MissionPageFrame>
  )
}