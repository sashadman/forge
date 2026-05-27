'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  ArrowRight,
  GraduationCap,
  MapPin,
  Search,
  SlidersHorizontal,
} from 'lucide-react'
import SaveProgramButton from '@/components/programs/SaveProgramButton'

type Program = {
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

type ProgramsExplorerProps = {
  programs: Program[]
  savedProgramIds: string[]
}

const CALIFORNIA_REGIONS = [
  {
    value: 'san-diego-imperial',
    label: 'San Diego / Imperial',
    cities: [
      'San Diego',
      'Chula Vista',
      'El Cajon',
      'San Marcos',
      'Oceanside',
      'Imperial',
      'El Centro',
      'Rancho San Diego',
    ],
  },
  {
    value: 'los-angeles',
    label: 'Los Angeles area',
    cities: ['Los Angeles', 'Whittier', 'Pasadena', 'Compton', 'Long Beach'],
  },
  {
    value: 'orange-county',
    label: 'Orange County',
    cities: ['Santa Ana', 'Mission Viejo', 'Huntington Beach', 'Fullerton', 'Anaheim'],
  },
  {
    value: 'inland-empire',
    label: 'Inland Empire',
    cities: ['Riverside', 'San Bernardino', 'Rancho Cucamonga', 'Walnut'],
  },
  {
    value: 'central-valley',
    label: 'Central Valley',
    cities: ['Bakersfield', 'Fresno', 'Modesto'],
  },
  {
    value: 'sacramento-northern',
    label: 'Sacramento / Northern California',
    cities: ['Sacramento'],
  },
  {
    value: 'bay-area',
    label: 'Bay Area',
    cities: ['San Mateo', 'Cupertino', 'Oakland', 'San Francisco'],
  },
  {
    value: 'central-coast',
    label: 'Central Coast',
    cities: ['San Luis Obispo', 'Santa Maria'],
  },
]

function formatProgramType(type: string) {
  return type
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

function getProgramRegion(program: Program) {
  return CALIFORNIA_REGIONS.find((region) =>
    region.cities.includes(program.location)
  )
}

function hasActiveFilters({
  searchTerm,
  programType,
  careerFocus,
  region,
}: {
  searchTerm: string
  programType: string
  careerFocus: string
  region: string
}) {
  return (
    searchTerm.trim().length > 0 ||
    programType !== 'all' ||
    careerFocus !== 'all' ||
    region !== 'all'
  )
}

export default function ProgramsExplorer({
  programs,
  savedProgramIds,
}: ProgramsExplorerProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [programType, setProgramType] = useState('all')
  const [careerFocus, setCareerFocus] = useState('all')
  const [region, setRegion] = useState('all')

  const savedProgramIdSet = useMemo(() => {
    return new Set(savedProgramIds)
  }, [savedProgramIds])

  const programTypes = useMemo(() => {
    return Array.from(
      new Set(programs.map((program) => program.program_type))
    ).sort()
  }, [programs])

  const careerFocusOptions = useMemo(() => {
    return Array.from(
      new Set(programs.map((program) => program.trade_slug))
    ).sort()
  }, [programs])

  const activeFilters = hasActiveFilters({
    searchTerm,
    programType,
    careerFocus,
    region,
  })

  const filteredPrograms = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return programs.filter((program) => {
      const programRegion = getProgramRegion(program)

      const matchesSearch =
        !query ||
        [
          program.name,
          program.provider_name,
          program.program_type,
          program.trade_slug,
          program.location,
          program.state,
          programRegion?.label || '',
          program.duration || '',
          program.cost || '',
          program.description,
        ]
          .join(' ')
          .toLowerCase()
          .includes(query)

      const matchesType =
        programType === 'all' || program.program_type === programType

      const matchesCareerFocus =
        careerFocus === 'all' || program.trade_slug === careerFocus

      const matchesRegion =
        region === 'all' || programRegion?.value === region

      return matchesSearch && matchesType && matchesCareerFocus && matchesRegion
    })
  }, [programs, searchTerm, programType, careerFocus, region])

  function clearFilters() {
    setSearchTerm('')
    setProgramType('all')
    setCareerFocus('all')
    setRegion('all')
  }

  return (
    <div className="space-y-8">
      <section className="content-panel">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="eyebrow">Training program directory</p>

            <h2 className="section-title mt-3">
              Search active training programs
            </h2>

            <p className="muted-text mt-3 max-w-2xl">
              Search by provider, career path, city, region, program type,
              duration, or cost.
            </p>
          </div>

          <p className="badge-slate">
            {activeFilters
              ? `${filteredPrograms.length} matching programs`
              : `${programs.length} California programs`}
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_auto]">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-100">
            <Search className="h-5 w-5 text-slate-400" />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search provider, career path, city, region..."
              className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
            />
          </div>

          <select
            value={programType}
            onChange={(event) => setProgramType(event.target.value)}
            className="select-field"
          >
            <option value="all">All program types</option>
            {programTypes.map((type) => (
              <option key={type} value={type}>
                {formatProgramType(type)}
              </option>
            ))}
          </select>

          <select
            value={careerFocus}
            onChange={(event) => setCareerFocus(event.target.value)}
            className="select-field"
          >
            <option value="all">All career paths</option>
            {careerFocusOptions.map((careerPath) => (
              <option key={careerPath} value={careerPath}>
                {careerPath}
              </option>
            ))}
          </select>

          <select
            value={region}
            onChange={(event) => setRegion(event.target.value)}
            className="select-field"
          >
            <option value="all">All California regions</option>
            {CALIFORNIA_REGIONS.map((regionOption) => (
              <option key={regionOption.value} value={regionOption.value}>
                {regionOption.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={clearFilters}
            disabled={!activeFilters}
            className="btn-outline rounded-2xl px-4 py-3 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Clear
          </button>
        </div>
      </section>

      {programs.length === 0 ? (
        <div className="card border-dashed p-10 text-center">
          <h3 className="text-2xl font-bold">
            No active training programs yet
          </h3>

          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Training programs will appear here after real public directory
            records are added and activated. We avoid fake or filler listings.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/trades" className="btn-dark">
              Compare career paths
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link href="/opportunities" className="btn-outline">
              View jobs & apprenticeships
            </Link>
          </div>
        </div>
      ) : filteredPrograms.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredPrograms.map((program) => {
            const programRegion = getProgramRegion(program)

            return (
              <article key={program.id} className="card">
                <Link href={`/programs/${program.slug}`} className="group block">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span className="badge-orange">
                          {formatProgramType(program.program_type)}
                        </span>

                        {programRegion && (
                          <span className="badge-slate">
                            {programRegion.label}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 transition group-hover:text-orange-700">
                        {program.name}
                      </h3>

                      <p className="mt-2 font-semibold text-slate-600">
                        {program.provider_name}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white transition group-hover:bg-orange-600">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </Link>

                <p className="mt-5 line-clamp-3 leading-7 text-slate-600">
                  {program.description}
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="mini-card">
                    <div className="flex items-center gap-2 text-slate-500">
                      <MapPin className="h-4 w-4" />

                      <p className="text-xs font-semibold uppercase tracking-wide">
                        Location
                      </p>
                    </div>

                    <p className="mt-2 font-semibold text-slate-950">
                      {program.location}, {program.state}
                    </p>
                  </div>

                  <div className="mini-card">
                    <div className="flex items-center gap-2 text-slate-500">
                      <GraduationCap className="h-4 w-4" />

                      <p className="text-xs font-semibold uppercase tracking-wide">
                        Duration
                      </p>
                    </div>

                    <p className="mt-2 font-semibold text-slate-950">
                      {program.duration || 'See provider'}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <Link
                    href={`/programs/${program.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-orange-700 hover:text-orange-800"
                  >
                    View training program
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <div className="sm:min-w-48">
                    <SaveProgramButton
                      programId={program.id}
                      initiallySaved={savedProgramIdSet.has(program.id)}
                    />
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="card border-dashed p-10 text-center">
          <h3 className="text-2xl font-bold">
            No matching training programs found
          </h3>

          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            No active training program records match your current filters. Try
            changing the career path, program type, region, or clearing the
            filters.
          </p>

          <button type="button" onClick={clearFilters} className="btn-dark mt-6">
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}