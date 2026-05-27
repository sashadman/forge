'use client'

import { useMemo, useState } from 'react'
import { ArrowRight, Building2, MapPin, Search, SlidersHorizontal } from 'lucide-react'

type CommunityCollege = {
  id: string
  slug: string
  name: string
  district_name: string | null
  city: string
  state: string
  region: string
  county: string | null
  website_url: string
  notes: string | null
}

type CommunityCollegeExplorerProps = {
  colleges: CommunityCollege[]
}

export default function CommunityCollegeExplorer({
  colleges,
}: CommunityCollegeExplorerProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [region, setRegion] = useState('all')

  const regions = useMemo(() => {
    return Array.from(new Set(colleges.map((college) => college.region))).sort()
  }, [colleges])

  const activeFilters = searchTerm.trim().length > 0 || region !== 'all'

  const filteredColleges = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return colleges.filter((college) => {
      const matchesSearch =
        !query ||
        [
          college.name,
          college.district_name || '',
          college.city,
          college.state,
          college.region,
          college.county || '',
        ]
          .join(' ')
          .toLowerCase()
          .includes(query)

      const matchesRegion = region === 'all' || college.region === region

      return matchesSearch && matchesRegion
    })
  }, [colleges, searchTerm, region])

  function clearFilters() {
    setSearchTerm('')
    setRegion('all')
  }

  return (
    <div className="space-y-8">
      <section className="content-panel">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="eyebrow">College directory</p>

            <h2 className="section-title mt-3">
              Search California community colleges
            </h2>

            <p className="muted-text mt-3 max-w-2xl">
              Search by college, district, city, county, or region. Program
              listings remain separate and should be verified before publishing.
            </p>
          </div>

          <p className="badge-slate">
            {activeFilters
              ? `${filteredColleges.length} matching colleges`
              : `${colleges.length} colleges in directory`}
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr_auto]">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-100">
            <Search className="h-5 w-5 text-slate-400" />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search college, district, city, county..."
              className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
            />
          </div>

          <select
            value={region}
            onChange={(event) => setRegion(event.target.value)}
            className="select-field"
          >
            <option value="all">All California regions</option>
            {regions.map((regionOption) => (
              <option key={regionOption} value={regionOption}>
                {regionOption}
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

      {filteredColleges.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredColleges.map((college) => (
            <article key={college.id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="badge-orange">{college.region}</span>

                  <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
                    {college.name}
                  </h3>

                  {college.district_name && (
                    <p className="mt-2 font-semibold text-slate-600">
                      {college.district_name}
                    </p>
                  )}
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white">
                  <Building2 className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="mini-card">
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin className="h-4 w-4" />
                    <p className="text-xs font-semibold uppercase tracking-wide">
                      Location
                    </p>
                  </div>

                  <p className="mt-2 font-semibold text-slate-950">
                    {college.city}, {college.state}
                  </p>
                </div>

                <div className="mini-card">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    County
                  </p>

                  <p className="mt-2 font-semibold text-slate-950">
                    {college.county || 'Statewide / online'}
                  </p>
                </div>
              </div>

              {college.notes && (
                <p className="mt-5 leading-7 text-slate-600">{college.notes}</p>
              )}

              <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <a
                  href={college.website_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-orange-700 hover:text-orange-800"
                >
                  Visit college website
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <section className="card border-dashed p-10 text-center">
          <h3 className="text-2xl font-bold">
            No matching colleges found
          </h3>

          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Try a different college name, city, county, or region.
          </p>

          <button type="button" onClick={clearFilters} className="btn-dark mt-6">
            Clear filters
          </button>
        </section>
      )}
    </div>
  )
}