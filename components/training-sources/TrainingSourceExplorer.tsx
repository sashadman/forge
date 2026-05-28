'use client'

import { useMemo, useState } from 'react'
import {
  ArrowRight,
  DatabaseZap,
  Globe2,
  Search,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react'

type TrainingSource = {
  id: string
  source_name: string
  source_slug: string
  source_type: string
  source_authority: string
  trust_level: string
  base_url: string
  source_state: string | null
  source_country: string
  institution_name: string | null
  provider_name: string | null
  program_index_url: string | null
  crawler_strategy: string
  crawl_status: string
  is_active: boolean
  admin_notes: string | null
}

type TrainingSourceExplorerProps = {
  sources: TrainingSource[]
}

function formatLabel(value: string | null) {
  if (!value) return 'National'

  return value
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

function hasActiveFilters({
  searchTerm,
  sourceType,
  authority,
  state,
}: {
  searchTerm: string
  sourceType: string
  authority: string
  state: string
}) {
  return (
    searchTerm.trim().length > 0 ||
    sourceType !== 'all' ||
    authority !== 'all' ||
    state !== 'all'
  )
}

export default function TrainingSourceExplorer({
  sources,
}: TrainingSourceExplorerProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sourceType, setSourceType] = useState('all')
  const [authority, setAuthority] = useState('all')
  const [state, setState] = useState('all')

  const sourceTypes = useMemo(() => {
    return Array.from(new Set(sources.map((source) => source.source_type))).sort()
  }, [sources])

  const authorities = useMemo(() => {
    return Array.from(
      new Set(sources.map((source) => source.source_authority))
    ).sort()
  }, [sources])

  const states = useMemo(() => {
    return Array.from(
      new Set(
        sources.map((source) => source.source_state || 'National')
      )
    ).sort()
  }, [sources])

  const activeFilters = hasActiveFilters({
    searchTerm,
    sourceType,
    authority,
    state,
  })

  const filteredSources = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return sources.filter((source) => {
      const sourceState = source.source_state || 'National'

      const matchesSearch =
        !query ||
        [
          source.source_name,
          source.source_type,
          source.source_authority,
          source.trust_level,
          source.base_url,
          sourceState,
          source.source_country,
          source.institution_name || '',
          source.provider_name || '',
          source.admin_notes || '',
        ]
          .join(' ')
          .toLowerCase()
          .includes(query)

      const matchesType =
        sourceType === 'all' || source.source_type === sourceType

      const matchesAuthority =
        authority === 'all' || source.source_authority === authority

      const matchesState = state === 'all' || sourceState === state

      return matchesSearch && matchesType && matchesAuthority && matchesState
    })
  }, [sources, searchTerm, sourceType, authority, state])

  function clearFilters() {
    setSearchTerm('')
    setSourceType('all')
    setAuthority('all')
    setState('all')
  }

  return (
    <div className="space-y-8">
      <section className="content-panel">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="eyebrow">Source registry</p>

            <h2 className="section-title mt-3">
              Search official training sources
            </h2>

            <p className="muted-text mt-3 max-w-2xl">
              Search by source, state, authority, provider, institution, or
              source type. These sources feed the candidate review pipeline.
            </p>
          </div>

          <p className="badge-slate">
            {activeFilters
              ? `${filteredSources.length} matching sources`
              : `${sources.length} active sources`}
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.6fr_auto]">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-100">
            <Search className="h-5 w-5 text-slate-400" />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search source, state, provider, authority..."
              className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
            />
          </div>

          <select
            value={sourceType}
            onChange={(event) => setSourceType(event.target.value)}
            className="select-field"
          >
            <option value="all">All source types</option>
            {sourceTypes.map((type) => (
              <option key={type} value={type}>
                {formatLabel(type)}
              </option>
            ))}
          </select>

          <select
            value={authority}
            onChange={(event) => setAuthority(event.target.value)}
            className="select-field"
          >
            <option value="all">All authorities</option>
            {authorities.map((authorityOption) => (
              <option key={authorityOption} value={authorityOption}>
                {formatLabel(authorityOption)}
              </option>
            ))}
          </select>

          <select
            value={state}
            onChange={(event) => setState(event.target.value)}
            className="select-field"
          >
            <option value="all">All states</option>
            {states.map((stateOption) => (
              <option key={stateOption} value={stateOption}>
                {stateOption}
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

      {filteredSources.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredSources.map((source) => (
            <article key={source.id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="badge-orange">
                      {formatLabel(source.source_type)}
                    </span>

                    <span className="badge-slate">
                      {formatLabel(source.source_authority)}
                    </span>

                    <span className="badge-slate">
                      {source.source_state || 'National'}
                    </span>
                  </div>

                  <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
                    {source.source_name}
                  </h3>

                  {(source.provider_name || source.institution_name) && (
                    <p className="mt-2 font-semibold text-slate-600">
                      {source.provider_name || source.institution_name}
                    </p>
                  )}
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white">
                  <DatabaseZap className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="mini-card">
                  <div className="flex items-center gap-2 text-slate-500">
                    <ShieldCheck className="h-4 w-4" />

                    <p className="text-xs font-semibold uppercase tracking-wide">
                      Trust level
                    </p>
                  </div>

                  <p className="mt-2 font-semibold text-slate-950">
                    {formatLabel(source.trust_level)}
                  </p>
                </div>

                <div className="mini-card">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Globe2 className="h-4 w-4" />

                    <p className="text-xs font-semibold uppercase tracking-wide">
                      Coverage
                    </p>
                  </div>

                  <p className="mt-2 font-semibold text-slate-950">
                    {source.source_state || 'National'}, {source.source_country}
                  </p>
                </div>
              </div>

              {source.admin_notes && (
                <p className="mt-5 line-clamp-3 leading-7 text-slate-600">
                  {source.admin_notes}
                </p>
              )}

              <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <a
                  href={source.program_index_url || source.base_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-orange-700 hover:text-orange-800"
                >
                  View official source
                  <ArrowRight className="h-4 w-4" />
                </a>

                <span className="text-sm font-semibold text-slate-500">
                  {formatLabel(source.crawl_status)}
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <section className="card border-dashed p-10 text-center">
          <h3 className="text-2xl font-bold">No matching sources found</h3>

          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Try a different source name, authority, source type, or state.
          </p>

          <button type="button" onClick={clearFilters} className="btn-dark mt-6">
            Clear filters
          </button>
        </section>
      )}
    </div>
  )
}