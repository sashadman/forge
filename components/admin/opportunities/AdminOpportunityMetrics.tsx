import { AlertCircle, BriefcaseBusiness, CheckCircle2, Database, EyeOff, Filter } from 'lucide-react'

type AdminOpportunityMetricsProps = {
  stats: {
    total: number
    active: number
    inactive: number
    sourced: number
    needsReview: number
    filtered: number
  }
}

export default function AdminOpportunityMetrics({
  stats,
}: AdminOpportunityMetricsProps) {
  return (
    <div className="-mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-6">
      <MetricCard
        label="Total"
        value={stats.total}
        icon={<BriefcaseBusiness className="h-7 w-7" />}
      />
      <MetricCard
        label="Active"
        value={stats.active}
        icon={<CheckCircle2 className="h-7 w-7" />}
      />
      <MetricCard
        label="Inactive"
        value={stats.inactive}
        icon={<EyeOff className="h-7 w-7" />}
      />
      <MetricCard
        label="Sourced"
        value={stats.sourced}
        icon={<Database className="h-7 w-7" />}
      />
      <MetricCard
        label="Needs review"
        value={stats.needsReview}
        icon={<AlertCircle className="h-7 w-7" />}
      />
      <MetricCard
        label="Filtered"
        value={stats.filtered}
        icon={<Filter className="h-7 w-7" />}
      />
    </div>
  )
}

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string
  value: number
  icon: React.ReactNode
}) {
  return (
    <div className="content-panel">
      <div className="text-orange-600">{icon}</div>

      <p className="eyebrow mt-5">{label}</p>

      <h2 className="mt-3 text-3xl font-bold text-slate-950">{value}</h2>
    </div>
  )
}