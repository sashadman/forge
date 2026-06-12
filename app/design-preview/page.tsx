import type { Metadata } from 'next'
import SiteNavbar from '@/components/layout/SiteNavbar'
import DashboardHero from '@/components/dashboard/DashboardHero'
import MissionSequence from '@/components/dashboard/MissionSequence'
import DashboardReadinessWidget from '@/components/dashboard/DashboardReadinessWidget'
import type {
  ReadinessItemRow,
  ReadinessScoreRow,
} from '@/app/actions/readiness'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Design Preview — ${siteConfig.name}`,
  description: 'Internal preview of the redesigned dashboard components.',
}

const previewItems = [
  buildReadinessItem('cover_letter_template', 'complete'),
  buildReadinessItem('experience_summary', 'complete'),
] satisfies ReadinessItemRow[]

const previewScore = {
  user_id: 'preview-user',
  total_items: 10,
  completed_items: 7,
  required_total: 4,
  required_completed: 3,
  score_pct: 74,
} satisfies ReadinessScoreRow

export default function DesignPreviewPage() {
  return (
    <main className="page-shell">
      <PreviewLabel label="SiteNavbar" />
      <SiteNavbar />

      <PreviewLabel label="DashboardHero" />
      <DashboardHero />

      <PreviewLabel label="MissionSequence" />
      <MissionSequence />

      <PreviewLabel label="DashboardReadinessWidget" />
      <section className="section-shell py-12">
        <DashboardReadinessWidget items={previewItems} score={previewScore} />
      </section>
    </main>
  )
}

function PreviewLabel({ label }: { label: string }) {
  return (
    <div className="border-y border-[var(--border)] bg-[var(--bg-void)] px-6 py-3">
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)]">
        ↳ {label}
      </p>
    </div>
  )
}

function buildReadinessItem(
  type: ReadinessItemRow['type'],
  status: ReadinessItemRow['status']
): ReadinessItemRow {
  const now = new Date().toISOString()

  return {
    id: `preview-${type}`,
    user_id: 'preview-user',
    type,
    status,
    file_path: null,
    file_name: null,
    file_size_kb: null,
    file_mime_type: null,
    text_content: null,
    notes: null,
    verified_by: null,
    verified_at: null,
    expires_at: null,
    created_at: now,
    updated_at: now,
  }
}
