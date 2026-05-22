import { Map } from 'lucide-react'
import SavedTradesSection from '@/components/dashboard/SavedTradesSection'
import MissionPageFrame from '@/components/dashboard/mission/MissionPageFrame'
import { getDashboardPageData } from '@/lib/dashboard/get-dashboard-page-data'

export default async function DashboardCareerPathsPage() {
  const { savedTrades } = await getDashboardPageData()

  return (
    <MissionPageFrame
      eyebrow="Career path mission"
      title="Track your saved career paths."
      description="Keep your career direction focused before comparing training programs or applying to jobs and apprenticeships."
      primaryHref="/trades"
      primaryLabel="Compare more career paths"
      secondaryHref="/dashboard/training-programs"
      secondaryLabel="Next: training mission"
    >
      <div className="mb-8 rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
            <Map className="h-6 w-6" />
          </div>

          <div>
            <p className="font-bold text-slate-950">Mission purpose</p>
            <p className="text-slate-600">
              Pick a direction before spending time or money on preparation.
            </p>
          </div>
        </div>
      </div>

      <SavedTradesSection savedTrades={savedTrades} />
    </MissionPageFrame>
  )
}