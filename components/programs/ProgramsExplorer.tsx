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

type Program = {
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
}

function formatProgramType(type: string) {
  return type
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

export default function ProgramsExplorer({ programs }: ProgramsExplorerProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [programType, setProgramType] = useState('all')
  const [tradeFocus, setTradeFocus] = useState('all')
  const [location, setLocation] = useState('all')

  const programTypes = useMemo(() => {
    return Array.from(new Set(programs.map((program) => program.program_type))).sort()
  }, [programs])

  const tradeFocusOptions = useMemo(() => {
    return Array.from(new Set(programs.map((program) => program.trade_slug))).sort()
  }, [programs])

  const locationOptions = useMemo(() => {
    return Array.from(
      new Set(programs.map((program) => `${program.location}, ${program.state}`))
    ).sort()
  }, [programs])

  const filteredPrograms = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return programs.filter((program) => {
      const matchesSearch =
        !query ||
        [
          program.name,
          program.provider_name,
          program.program_type,
          program.trade_slug,
          program.location,
          program.state,
          program.duration || '',
          program.cost || '',
          program.description,
        ]
          .join(' ')
          .toLowerCase()
          .includes(query)

      const matchesType =
        programType === 'all' || program.program_type === programType

      const matchesTrade =
        tradeFocus === 'all' || program.trade_slug === tradeFocus

      const programLocation = `${program.location}, ${program.state}`
      const matchesLocation =
        location === 'all' || programLocation === location

      return matchesSearch && matchesType && matchesTrade && matchesLocation
    })
  }, [programs, searchTerm, programType, tradeFocus, location])

  function clearFilters() {
    setSearchTerm('')
    setProgramType('all')
    setTradeFocus('all')
    setLocation('all')
  }

  return (
    <div>
      <div className="-mt-16 rounded-[2rem] border border-white/70 bg-white p-6 shadow-2xl shadow-slate-900/10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
              Program directory
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Listed San Diego-area pathways
            </h2>
          </div>

          <p className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            {filteredPrograms.length} of {programs.length} listings
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_auto]">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-100">
            <Search className="h-5 w-5 text-slate-400" />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search provider, trade, city, program..."
              className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
            />
          </div>

          <select
            value={programType}
            onChange={(event) => setProgramType(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
          >
            <option value="all">All program types</option>
            {programTypes.map((type) => (
              <option key={type} value={type}>
                {formatProgramType(type)}
              </option>
            ))}
          </select>

          <select
            value={tradeFocus}
            onChange={(event) => setTradeFocus(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
          >
            <option value="all">All trades</option>
            {tradeFocusOptions.map((trade) => (
              <option key={trade} value={trade}>
                {trade}
              </option>
            ))}
          </select>

          <select
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
          >
            <option value="all">All locations</option>
            {locationOptions.map((programLocation) => (
              <option key={programLocation} value={programLocation}>
                {programLocation}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Clear
          </button>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {filteredPrograms.length > 0 ? (
          filteredPrograms.map((program) => (
            <Link
              key={program.slug}
              href={`/programs/${program.slug}`}
              className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-slate-900/10"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-700">
                    {formatProgramType(program.program_type)}
                  </span>

                  <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
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

              <p className="mt-5 line-clamp-3 leading-7 text-slate-600">
                {program.description}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
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

                <div className="rounded-2xl bg-slate-50 p-4">
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
            </Link>
          ))
        ) : (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center lg:col-span-2">
            <h3 className="text-2xl font-bold">No programs found</h3>

            <p className="mt-3 text-slate-600">
              Try changing your search or clearing the filters.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 rounded-full bg-slate-950 px-6 py-3 font-semibold text-white hover:bg-slate-800"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}