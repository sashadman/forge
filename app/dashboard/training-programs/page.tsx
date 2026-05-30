import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import ThemedPublicPage from '@/components/theme/ThemedPublicPage'
import ThemedPublicSection from '@/components/theme/ThemedPublicSection'
import SavedProgramPlanner, {
  type SavedProgramPlan,
} from '@/components/dashboard/SavedProgramPlanner'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Saved Training Programs — ${siteConfig.name}`,
  description:
    'Track saved training programs, planning status, notes, priority, and next steps.',
}

type SavedProgramRow = {
  id: string
  pipeline_status?: string | null
  priority?: string | null
  target_start_date?: string | null
  last_contacted_at?: string | null
  notes?: string | null
  created_at: string
  updated_at?: string | null
  programs:
    | {
        id: string
        slug: string
        name: string
        provider_name: string
        program_type: string
        trade_slug: string
        location: string
        state: string
        duration: string | null
        cost: string | null
        description: string
      }
    | null
}

type LooseQueryResult = Promise<{
  data: unknown
  error: { message: string } | null
}>

type LooseTable = {
  select: (columns: string) => {
    eq: (column: string, value: string) => {
      order: (
        column: string,
        options?: { ascending?: boolean }
      ) => LooseQueryResult
    }
  }
}

type LooseSupabaseClient = {
  from: (table: string) => LooseTable
}

function asLooseSupabase(client: unknown) {
  return client as LooseSupabaseClient
}

function normalizeSavedProgram(row: SavedProgramRow): SavedProgramPlan {
  return {
    id: row.id,
    pipelineStatus: row.pipeline_status ?? 'saved',
    priority: row.priority ?? 'medium',
    targetStartDate: row.target_start_date ?? null,
    lastContactedAt: row.last_contacted_at ?? null,
    notes: row.notes ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? null,
    program: row.programs
      ? {
          id: row.programs.id,
          slug: row.programs.slug,
          name: row.programs.name,
          providerName: row.programs.provider_name,
          programType: row.programs.program_type,
          tradeSlug: row.programs.trade_slug,
          location: row.programs.location,
          state: row.programs.state,
          duration: row.programs.duration,
          cost: row.programs.cost,
          description: row.programs.description,
        }
      : null,
  }
}

export default async function DashboardTrainingProgramsPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  const { data, error } = await asLooseSupabase(supabase)
    .from('saved_programs')
    .select(
      `
      id,
      pipeline_status,
      priority,
      target_start_date,
      last_contacted_at,
      notes,
      created_at,
      updated_at,
      programs (
        id,
        slug,
        name,
        provider_name,
        program_type,
        trade_slug,
        location,
        state,
        duration,
        cost,
        description
      )
      `
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to load saved training programs:', error)
  }

  const savedPrograms = ((data ?? []) as SavedProgramRow[]).map(
    normalizeSavedProgram
  )

  return (
    <ThemedPublicPage>
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <div className="max-w-4xl">
            <p className="eyebrow-dark">Saved training programs</p>

            <h1 className="page-title-dark mt-6">
              Turn saved programs into an action plan.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Track which programs you are researching, contacting, applying to,
              or actively considering for enrollment.
            </p>
          </div>
        </div>
      </section>

      <ThemedPublicSection className="pb-20">
        <div className="section-shell">
          <div className="-mt-12">
            <SavedProgramPlanner savedPrograms={savedPrograms} />
          </div>
        </div>
      </ThemedPublicSection>

      <SiteFooter />
    </ThemedPublicPage>
  )
}