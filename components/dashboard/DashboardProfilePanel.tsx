import Link from 'next/link'
import { ArrowRight, User } from 'lucide-react'
import ProfileForm from '@/components/dashboard/ProfileForm'
import ReadinessItem from '@/components/dashboard/ReadinessItem'

type ReadinessItemData = {
  label: string
  helpText: string
  complete: boolean
}

type DashboardProfilePanelProps = {
  userId: string
  userEmail?: string | null
  fullName: string
  profileEmail?: string | null
  location: string
  experienceLevel: string
  readinessItems: ReadinessItemData[]
  readinessScore: number
}

export default function DashboardProfilePanel({
  userId,
  userEmail,
  fullName,
  profileEmail,
  location,
  experienceLevel,
  readinessItems,
  readinessScore,
}: DashboardProfilePanelProps) {
  return (
    <aside className="content-panel -mt-12 self-start">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
        <User className="h-7 w-7" />
      </div>

      <h2 className="mt-6 text-2xl font-bold text-slate-950">
        {fullName || 'Your profile'}
      </h2>

      <p className="mt-2 text-slate-600">{profileEmail || userEmail}</p>

      <div className="mt-6">
        <ProfileForm
          userId={userId}
          fullName={fullName}
          location={location}
          experienceLevel={experienceLevel}
        />
      </div>

      <div className="mt-8 border-t border-slate-200 pt-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Career readiness</p>

            <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
              {readinessScore}% complete
            </h3>
          </div>

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-lg font-bold text-orange-700">
            {readinessScore}%
          </div>
        </div>

        <p className="muted-text mt-4">
          Build a stronger career profile by saving paths, completing the quiz,
          and tracking real jobs or apprenticeships.
        </p>

        <div className="mt-6 space-y-3">
          {readinessItems.map((item) => (
            <ReadinessItem
              key={item.label}
              label={item.label}
              helpText={item.helpText}
              complete={item.complete}
            />
          ))}
        </div>

        <Link href="/quiz" className="btn-outline mt-6 w-full">
          Improve career profile
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </aside>
  )
}