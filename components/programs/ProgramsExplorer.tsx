'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import {
  ArrowRight,
  ExternalLink,
  GraduationCap,
  MapPin,
  Search,
  SlidersHorizontal,
} from 'lucide-react'
import SaveProgramButton from '@/components/programs/SaveProgramButton'

export type Program = {
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
}

type ProgramsExplorerProps = {
  programs: Program[]
  savedProgramIds: string[]
  searchQuery: string
  currentPage: number
  totalPrograms: number
  pageSize: number
  selectedProgramType: string
  selectedState: string
  selectedVerifiedOnly: boolean
}

const PROGRAM_TYPE_OPTIONS = [
  { value: 'all', label: 'All program types' },
  { value: 'apprenticeship', label: 'Apprenticeships' },
  { value: 'trade_school', label: 'Trade schools' },
  { value: 'community_college', label: 'Community colleges' },
  { value: 'workforce_program', label: 'Workforce programs' },
  { value: 'employer_training', label: 'Employer training' },
]

const STATE_OPTIONS = [
  'all',
  'National',
  'AL',
  'AK',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DE',
  'FL',
  'GA',
  'HI',
  'IA',
  'ID',
  'IL',
  'IN',
  'KS',
  'KY',
  'LA',
  'MA',
  'MD',
  'ME',
  'MI',
  'MN',
  'MO',
  'MS',
  'MT',
  'NC',
  'ND',
  'NE',
  'NH',
  'NJ',
  'NM',
  'NV',
  'NY',
  'OH',
  'OK',
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VA',
  'VT',
  'WA',
  'WI',
  'WV',
  'WY',
]

function formatProgramType(type: string) {
  return type
    .split('_')
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(' ')
}

function formatTradeSlug(value: string) {
  return value
    .split('-')
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(' ')
}

function formatStateOption(stateOption: string) {
  if (stateOption === 'all') return 'All states'
  if (stateOption === 'National') return 'National / online'
  return stateOption
}

function hasActiveFilters({
  searchTerm,
  programType,
  state,
  verifiedOnly,
}: {
  searchTerm: string
  programType: string
  state: string
  verifiedOnly: boolean
}) {
  return (
    searchTerm.trim().length > 0 ||
    programType !== 'all' ||
    state !== 'all' ||
    verifiedOnly
  )
}

function buildProgramsHref({
  q,
  page,
  programType,
  state,
  verifiedOnly,
}: {
  q: string
  page: number
  programType: string
  state: string
  verifiedOnly: boolean
}) {
  const params = new URLSearchParams()

  if (q.trim()) params.set('q', q.trim())
  if (page > 1) params.set('page', String(page))
  if (programType !== 'all') params.set('programType', programType)
  if (state !== 'all') params.set('state', state)
  if (verifiedOnly) params.set('verified', 'true')

  const queryString = params.toString()

  return queryString ? `/programs?${queryString}` : '/programs'
}

function getProgramHref(program: Program) {
  if (program.record_kind === 'program' && program.slug) {
    return `/programs/${program.slug}`
  }

  return program.website_url || program.source_url || null
}

function getTrustBadge(program: Program) {
  if (program.record_kind === 'program') {
    return 'Verified by the platform'
  }

  return 'Confirm with provider'
}

function getFreshnessText(program: Program) {
  const dateValue = program.updated_at || program.published_at

  if (!dateValue) return 'Confirm details with provider'

  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) return 'Confirm details with provider'

  return `Updated ${date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })}`
}

export default function ProgramsExplorer({
  programs,
  savedProgramIds,
  searchQuery,
  currentPage,
  totalPrograms,
  pageSize,
  selectedProgramType,
  selectedState,
  selectedVerifiedOnly,
}: ProgramsExplorerProps) {
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState(searchQuery)
  const [programType, setProgramType] = useState(selectedProgramType)
  const [state, setState] = useState(selectedState)
  const [verifiedOnly, setVerifiedOnly] = useState(selectedVerifiedOnly)

  const savedProgramIdSet = useMemo(
    () => new Set(savedProgramIds),
    [savedProgramIds]
  )

  const activeFilters = hasActiveFilters({
    searchTerm: searchQuery,
    programType: selectedProgramType,
    state: selectedState,
    verifiedOnly: selectedVerifiedOnly,
  })

  const hasPreviousPage = currentPage > 1
  const hasNextPage = totalPrograms > currentPage * pageSize
  const totalPages = Math.max(1, Math.ceil(totalPrograms / pageSize))

  function updateProgramSearch() {
    router.push(
      buildProgramsHref({
        q: searchTerm,
        page: 1,
        programType,
        state,
        verifiedOnly,
      })
    )
  }

  function clearFilters() {
    setSearchTerm('')
    setProgramType('all')
    setState('all')
    setVerifiedOnly(false)
    router.push('/programs')
  }

  const previousPageHref = buildProgramsHref({
    q: searchQuery,
    page: currentPage - 1,
    programType: selectedProgramType,
    state: selectedState,
    verifiedOnly: selectedVerifiedOnly,
  })

  const nextPageHref = buildProgramsHref({
    q: searchQuery,
    page: currentPage + 1,
    programType: selectedProgramType,
    state: selectedState,
    verifiedOnly: selectedVerifiedOnly,
  })

  return (
    <div className="space-y-8">
      <section className="content-panel">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="eyebrow">Training program directory</p>

            <h2 className="section-title mt-3">Search training programs</h2>

            <p className="muted-text mt-3 max-w-2xl">
              Search training providers, public program listings, and
              Ara Skills reviewed training options by keyword, category, and
              location.
            </p>
          </div>

          <p className="badge-slate whitespace-nowrap">
            {totalPrograms.toLocaleString()} training programs
          </p>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            updateProgramSearch()
          }}
          className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.6fr_auto_auto_auto]"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-100">
            <Search className="h-5 w-5 text-slate-400" />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search provider, program, city, state, trade..."
              className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
            />
          </div>

          <select
            value={programType}
            onChange={(event) => setProgramType(event.target.value)}
            className="select-field"
          >
            {PROGRAM_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={state}
            onChange={(event) => setState(event.target.value)}
            className="select-field"
          >
            {STATE_OPTIONS.map((stateOption) => (
              <option key={stateOption} value={stateOption}>
                {formatStateOption(stateOption)}
              </option>
            ))}
          </select>
<label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50">
  <input
    type="checkbox"
    checked={verifiedOnly}
    onChange={(event) => setVerifiedOnly(event.target.checked)}
    className="sr-only"
  />

  <span
    className={
      verifiedOnly
        ? 'flex h-5 w-5 items-center justify-center rounded-md bg-orange-500 text-xs font-bold text-white'
        : 'flex h-5 w-5 items-center justify-center rounded-md border border-slate-300 bg-white text-xs font-bold text-slate-400'
    }
    aria-hidden="true"
  >
    {verifiedOnly ? '✓' : '×'}
  </span>

  <span>Verified only</span>
</label>
        

          <button type="submit" className="btn-dark rounded-2xl px-4 py-3">
            Search
          </button>

          <button
            type="button"
            onClick={clearFilters}
            disabled={!activeFilters}
            className="btn-outline rounded-2xl px-4 py-3 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Clear
          </button>
        </form>

        <p className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
          Programs marked{' '}
          <span className="font-semibold text-slate-900">
            Verified by Ara Skills
          </span>{' '}
          have been reviewed by the platform. General listings are provided for
          research and discovery from public or submitted sources. Always
          confirm program details, cost, eligibility, accreditation, and
          availability directly with the provider before enrolling or making
          payment decisions.
        </p>
      </section>

      {programs.length === 0 ? (
        <div className="card border-dashed p-10 text-center">
          <h3 className="text-2xl font-bold">
            No matching training programs found
          </h3>

          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Try a different provider, location, program type, or turn off
            Verified only.
          </p>

          <button type="button" onClick={clearFilters} className="btn-dark mt-6">
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            {programs.map((program) => {
              const programHref = getProgramHref(program)
              const trustBadge = getTrustBadge(program)
              const freshnessText = getFreshnessText(program)
              const canSave =
                program.record_kind === 'program' && Boolean(program.program_id)
              const isSaved =
                canSave && program.program_id
                  ? savedProgramIdSet.has(program.program_id)
                  : false

              const badges = (
                <div className="flex flex-wrap gap-2">
                  <span className="badge-primary">
                    {formatProgramType(program.program_type)}
                  </span>

                  <span className="badge-slate">{program.state}</span>

                  <span className="badge-slate">
                    {formatTradeSlug(program.trade_slug)}
                  </span>

                  <span className="badge-slate">{trustBadge}</span>
                </div>
              )

              const cardIcon = (
                <GraduationCap className="h-8 w-8 shrink-0 text-orange-500" />
              )

              const cardMeta = (
                <>
                  <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-400" />

                      <span>
                        {program.location}, {program.state}
                      </span>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-900">
                        Duration:
                      </span>{' '}
                      {program.duration || 'See provider'}
                    </div>

                    <div>
                      <span className="font-semibold text-slate-900">
                        Cost:
                      </span>{' '}
                      {program.cost || 'See provider'}
                    </div>

                    <div>
                      <span className="font-semibold text-slate-900">
                        Status:
                      </span>{' '}
                      {program.record_kind === 'program'
                        ? 'Verified by Ara Skills'
                        : 'Confirm with provider'}
                    </div>
                  </div>

                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {freshnessText}
                  </p>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    {program.record_kind === 'program' && program.slug ? (
                      <Link
                        href={`/programs/${program.slug}`}
                        className="btn-dark flex-1"
                      >
                        View program
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : null}

                    {programHref && program.record_kind === 'candidate' ? (
                      <Link
                        href={programHref}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-dark flex-1"
                      >
                        View source
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    ) : null}

                    {program.website_url ? (
                      <Link
                        href={program.website_url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-outline flex-1"
                      >
                        Provider site
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    ) : null}

                    {canSave && program.program_id ? (
                      <SaveProgramButton
                        programId={program.program_id}
                        initiallySaved={isSaved}
                      />
                    ) : null}
                  </div>
                </>
              )

              return (
                <article key={program.directory_id} className="card">
                  {programHref ? (
                    <Link
                      href={programHref}
                      target={
                        program.record_kind === 'candidate'
                          ? '_blank'
                          : undefined
                      }
                      rel={
                        program.record_kind === 'candidate'
                          ? 'noreferrer'
                          : undefined
                      }
                      className="group block"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          {badges}

                          <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 group-hover:text-orange-700">
                            {program.name}
                          </h3>

                          <p className="mt-2 font-semibold text-slate-700">
                            {program.provider_name}
                          </p>
                        </div>

                        {cardIcon}
                      </div>

                      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                        {program.description}
                      </p>
                    </Link>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          {badges}

                          <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
                            {program.name}
                          </h3>

                          <p className="mt-2 font-semibold text-slate-700">
                            {program.provider_name}
                          </p>
                        </div>

                        {cardIcon}
                      </div>

                      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                        {program.description}
                      </p>
                    </div>
                  )}

                  {cardMeta}
                </article>
              )
            })}
          </div>

          <div className="card flex flex-col items-center justify-between gap-4 p-5 sm:flex-row">
            <p className="text-sm font-semibold text-slate-600">
              Page {currentPage} of {totalPages.toLocaleString()} ·{' '}
              {totalPrograms.toLocaleString()} total programs
            </p>

            <div className="flex gap-3">
              {hasPreviousPage ? (
                <Link href={previousPageHref} className="btn-outline">
                  Previous
                </Link>
              ) : (
                <span className="btn-outline pointer-events-none opacity-50">
                  Previous
                </span>
              )}

              {hasNextPage ? (
                <Link href={nextPageHref} className="btn-dark">
                  Next
                </Link>
              ) : (
                <span className="btn-dark pointer-events-none opacity-50">
                  Next
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}