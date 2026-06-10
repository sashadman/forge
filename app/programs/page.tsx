import type { Metadata } from 'next'
import Link from 'next/link'
import { BriefcaseBusiness, GraduationCap } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import NextStepPanel from '@/components/ui/NextStepPanel'
import ProgramsExplorer, {
  type Program,
} from '@/components/programs/ProgramsExplorer'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'
import BackLink from '@/components/ui/BackLink'
import ThemedPublicPage from '@/components/theme/ThemedPublicPage'
import ThemedPublicSection from '@/components/theme/ThemedPublicSection'

export const metadata: Metadata = {
  title: `Search Training Programs — ${siteConfig.name}`,
  description:
    'Search training programs, apprenticeships, community college pathways, workforce programs, and public-source listings by location, category, and verified status.',
}

type RpcSupabase = {
  rpc: (
    fn: string,
    args: Record<string, unknown>
  ) => Promise<{
    data: DirectoryProgramRecord[] | null
    error: unknown
  }>
  from: (table: string) => any
}

type DirectoryProgramRecord = {
  directory_id: string
  record_kind: 'program' | 'candidate'
  program_id: string | null
  candidate_id: string | null
  slug: string | null
  name: string
  provider_name: string
  program_type: string
  trade_slug: string
  location: string
  state: string
  duration: string | null
  cost: string | null
  description: string
  website_url: string | null
  source_url: string | null
  review_status: string
  data_origin: string | null
  source_candidate_id: string | null
  provider_profile_id: string | null
  published_at: string | null
  updated_at: string | null
  verification_rank: number
  total_count: number
}

type ProgramsPageProps = {
  searchParams?: {
    q?: string
    page?: string
    programType?: string
    state?: string
    verified?: string
  }
}

const PROGRAM_TYPES = [
  'all',
  'apprenticeship',
  'trade_school',
  'community_college',
  'workforce_program',
  'employer_training',
] as const

function cleanSearchQuery(value: string) {
  return value.replace(/[,%]/g, ' ').trim()
}

function getSafeProgramType(value: string) {
  return PROGRAM_TYPES.includes(value as (typeof PROGRAM_TYPES)[number])
    ? value
    : 'all'
}

function normalizeDirectoryProgram(program: DirectoryProgramRecord): Program {
  return {
    directory_id: program.directory_id,
    record_kind: program.record_kind,
    program_id: program.program_id,
    candidate_id: program.candidate_id,
    slug: program.slug,
    name: program.name,
    provider_name: program.provider_name,
    program_type: program.program_type,
    trade_slug: program.trade_slug,
    location: program.location,
    state: program.state,
    duration: program.duration,
    cost: program.cost,
    description: program.description,
    website_url: program.website_url,
    source_url: program.source_url,
    review_status: program.review_status,
    data_origin: program.data_origin,
    source_candidate_id: program.source_candidate_id,
    provider_profile_id: program.provider_profile_id,
    published_at: program.published_at,
    updated_at: program.updated_at,
    verification_rank: program.verification_rank,
  }
}

export default async function ProgramsPage({ searchParams }: ProgramsPageProps) {
  const supabase = createClient()
  const rpcSupabase = supabase as unknown as RpcSupabase

  const searchQuery = cleanSearchQuery(searchParams?.q?.trim() ?? '')
  const selectedProgramType = getSafeProgramType(
    searchParams?.programType ?? 'all'
  )
  const selectedState = searchParams?.state ?? 'all'
  const selectedVerifiedOnly = searchParams?.verified === 'true'
  const selectedVerification = selectedVerifiedOnly ? 'admin_reviewed' : 'all'

  const parsedPage = Number(searchParams?.page ?? '1')
  const pageSize = 50
  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: directoryData, error: directoryError } =
    await rpcSupabase.rpc('search_public_training_programs', {
      search_text: searchQuery,
      program_type_filter: selectedProgramType,
      state_filter: selectedState,
      verification_filter: selectedVerification,
      page_number: currentPage,
      page_size: pageSize,
    })

  if (directoryError) {
    console.error('Failed to load training program directory:', directoryError)
  }

  const normalizedPrograms = (directoryData ?? []).map(normalizeDirectoryProgram)
  const totalPrograms = directoryData?.[0]?.total_count ?? 0

  let savedProgramIds: string[] = []

  if (user) {
    const { data: savedPrograms, error: savedProgramsError } = await supabase
      .from('saved_programs')
      .select('program_id')
      .eq('user_id', user.id)

    if (savedProgramsError) {
      console.error(
        'Failed to load saved training program IDs:',
        savedProgramsError
      )
    }

    savedProgramIds =
      savedPrograms?.map((savedProgram) => savedProgram.program_id) ?? []
  }

  return (
    <ThemedPublicPage>
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-24">
          <BackLink
            href="/trades"
            label="Back to career paths"
            variant="light"
          />

          <div className="mt-10 max-w-4xl">
            <p className="eyebrow-dark">Training programs</p>

            <h1 className="page-title-dark mt-6">
              Compare training options before you apply.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Browse apprenticeships, pre-apprenticeships, workforce programs,
              training providers, and public-source listings. Verified records
              are highlighted, while general listings remain searchable for
              research and comparison.
            </p>
          </div>
        </div>
      </section>

      <ThemedPublicSection className="pb-20">
        <div className="section-shell">
          <div className="pt-8">
            <NextStepPanel
              title="Training should connect to a real career path."
              description="Use saved training programs to compare cost, duration, requirements, and how each pathway can move you toward real jobs or apprenticeships."
              primaryHref="/opportunities"
              primaryLabel="View jobs & apprenticeships"
              secondaryHref="/trades"
              secondaryLabel="Compare career paths"
              icon={<GraduationCap className="h-6 w-6" />}
            />
          </div>

          <div className="mt-8">
            <ProgramsExplorer
              programs={normalizedPrograms}
              savedProgramIds={savedProgramIds}
              searchQuery={searchQuery}
              currentPage={currentPage}
              totalPrograms={totalPrograms}
              pageSize={pageSize}
              selectedProgramType={selectedProgramType}
              selectedState={selectedState}
              selectedVerifiedOnly={selectedVerifiedOnly}
            />
          </div>

          <section className="mt-8 rounded-[2rem] border border-white/10 bg-slate-950 p-8 text-white shadow-xl">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-orange-300 ring-1 ring-white/15">
                <BriefcaseBusiness className="h-8 w-8" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-300">
                  Ready for work?
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-tight">
                  Move from training research to real openings.
                </h2>

                <p className="mt-4 max-w-4xl leading-7 text-slate-300">
                  Once you understand the training pathway, compare real jobs,
                  apprenticeships, and trainee roles to see what employers
                  expect.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href="/opportunities" className="btn-light">
                    View jobs & apprenticeships
                  </Link>

                  <Link
                    href="/dashboard/readiness"
                    className="btn-outline border-white/20 bg-white/10 text-white hover:bg-white/15"
                  >
                    Build readiness profile
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </ThemedPublicSection>

      <SiteFooter />
    </ThemedPublicPage>
  )
}