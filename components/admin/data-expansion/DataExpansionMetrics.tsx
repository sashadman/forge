import {
  AlertCircle,
  CheckCircle2,
  Database,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'

type DataExpansionMetricsProps = {
  stats: {
    totalSources: number
    officialSources: number
    activeSources: number
    sourcesDueForReview: number
    sourcedOpportunities: number
    activeSourcedOpportunities: number
    staleOrExpiredOpportunities: number
  }
}

export default function DataExpansionMetrics({
  stats,
}: DataExpansionMetricsProps) {
  return (
    <div className="-mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-7">
      <MetricCard
        label="Sources"
        value={stats.totalSources}
        icon={<Database className="h-7 w-7" />}
      />
      <MetricCard
        label="Official"
        value={stats.officialSources}
        icon={<ShieldCheck className="h-7 w-7" />}
      />
      <MetricCard
        label="Active sources"
        value={stats.activeSources}
        icon={<CheckCircle2 className="h-7 w-7" />}
      />
      <MetricCard
        label="Source reviews"
        value={stats.sourcesDueForReview}
        icon={<AlertCircle className="h-7 w-7" />}
      />
      <MetricCard
        label="Sourced listings"
        value={stats.sourcedOpportunities}
        icon={<TrendingUp className="h-7 w-7" />}
      />
      <MetricCard
        label="Active sourced"
        value={stats.activeSourcedOpportunities}
        icon={<CheckCircle2 className="h-7 w-7" />}
      />
      <MetricCard
        label="Stale/expired"
        value={stats.staleOrExpiredOpportunities}
        icon={<AlertCircle className="h-7 w-7" />}
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