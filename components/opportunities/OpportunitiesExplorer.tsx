'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react'
import SaveOpportunityButton from '@/components/opportunities/SaveOpportunityButton'

type EmployerRelation = {
  name: string
  slug: string
  is_verified: boolean
}

type Opportunity = {
  id: string
  title: string
  slug: string
  opportunity_type: string
  trade_slug: string
  location: string
  state: string
  pay_range: string | null
  schedule: string | null
  description: string
  employers: EmployerRelation | EmployerRelation[] | null
}

type OpportunitiesExplorerProps = {
  opportunities: Opportunity[]
}

function formatOpportunityType(type: string) {
  return type
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

function getEmployer(opportunity: Opportunity) {
  return Array.isArray(opportunity.employers)
    ? opportunity.employers[0]
    : opportunity.employers
}

export default function OpportunitiesExplorer({
  opportunities,
}: OpportunitiesExplorerProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [opportunityType, setOpportunityType] = useState('all')
  const [tradeFocus, setTradeFocus] = useState('all')
  const [location, setLocation] = useState('all')
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  const opportunityTypes = useMemo(() => {
    return Array.from(
      new Set(opportunities.map((opportunity) => opportunity.opportunity_type))
    ).sort()
  }, [opportunities])

  const tradeFocusOptions = useMemo(() => {
    return Array.from(
      new Set(opportunities.map((opportunity) => opportunity.trade_slug))
    ).sort()
  }, [opportunities])

  const locationOptions = useMemo(() => {
    return Array.from(
      new Set(
        opportunities.map(
          (opportunity) => `${opportunity.location}, ${opportunity.state}`
        )
      )
    ).sort()
  }, [opportunities])

  const filteredOpportunities = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return opportunities.filter((opportunity) => {
      const employer = getEmployer(opportunity)

      const matchesSearch =
        !query ||
        [
          opportunity.title,
          opportunity.opportunity_type,
          opportunity.trade_slug,
          opportunity.location,
          opportunity.state,
          opportunity.pay_range || '',
          opportunity.schedule || '',
          opportunity.description,
          employer?.name || '',
        ]
          .join(' ')
          .toLowerCase()
          .includes(query)

      const matchesType =
        opportunityType === 'all' ||
        opportunity.opportunity_type === opportunityType

      const matchesTrade =
        tradeFocus === 'all' || opportunity.trade_slug === tradeFocus

      const opportunityLocation = `${opportunity.location}, ${opportunity.state}`
      const matchesLocation =
        location === 'all' || opportunityLocation === location

      const matchesVerified = !verifiedOnly || Boolean(employer?.is_verified)

      return (
        matchesSearch &&
        matchesType &&
        matchesTrade &&
        matchesLocation &&
        matchesVerified
      )
    })
  }, [
    opportunities,
    searchTerm,
    opportunityType,
    tradeFocus,
    location,
    verifiedOnly,
  ])

  function clearFilters() {
    setSearchTerm('')
    setOpportunityType('all')
    setTradeFocus('all')
    setLocation('all')
    setVerifiedOnly(false)
  }

  return (
    <div className="space-y-10">
      <div className="content-panel -mt-16">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="eyebrow">Opportunity directory</p>

            <h2 className="section-title mt-3">
              Active skilled-trades listings
            </h2>

            <p className="muted-text mt-3 max-w-2xl">
              Search real opportunity records by employer, trade, listing type,
              location, schedule, or pay information.
            </p>
          </div>

          <p className="badge-slate">
            {filteredOpportunities.length} of {opportunities.length} listings
          </p>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_auto_auto]">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-100">
            <Search className="h-5 w-5 text-slate-400" />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search employer, trade, city, listing..."
              className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
            />
          </div>

          <select
            value={opportunityType}
            onChange={(event) => setOpportunityType(event.target.value)}
            className="select-field"
          >
            <option value="all">All listing types</option>
            {opportunityTypes.map((type) => (
              <option key={type} value={type}>
                {formatOpportunityType(type)}
              </option>
            ))}
          </select>

          <select
            value={tradeFocus}
            onChange={(event) => setTradeFocus(event.target.value)}
            className="select-field"
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
            className="select-field"
          >
            <option value="all">All locations</option>
            {locationOptions.map((opportunityLocation) => (
              <option key={opportunityLocation} value={opportunityLocation}>
                {opportunityLocation}
              </option>
            ))}
          </select>

          <label className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(event) => setVerifiedOnly(event.target.checked)}
              className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
            />
            Verified only
          </label>

          <button
            type="button"
            onClick={clearFilters}
            className="btn-outline rounded-2xl px-4 py-3"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Clear
          </button>
        </div>
      </div>

      {filteredOpportunities.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredOpportunities.map((opportunity) => {
            const employer = getEmployer(opportunity)

            return (
              <div key={opportunity.id} className="card">
                <Link
                  href={`/opportunities/${opportunity.slug}`}
                  className="group block"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span className="badge-orange">
                          {formatOpportunityType(opportunity.opportunity_type)}
                        </span>

                        {employer?.is_verified && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-700">
                            <ShieldCheck className="h-3.5 w-3.5 text-orange-600" />
                            Verified employer
                          </span>
                        )}
                      </div>

                      <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 transition group-hover:text-orange-700">
                        {opportunity.title}
                      </h3>

                      <p className="mt-2 font-semibold text-slate-600">
                        {employer?.name || 'Employer listing'}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white transition group-hover:bg-orange-600">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </Link>

                <p className="mt-5 line-clamp-3 leading-7 text-slate-600">
                  {opportunity.description}
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
                      {opportunity.location}, {opportunity.state}
                    </p>
                  </div>

                  <div className="mini-card">
                    <div className="flex items-center gap-2 text-slate-500">
                      <BriefcaseBusiness className="h-4 w-4" />
                      <p className="text-xs font-semibold uppercase tracking-wide">
                        Schedule
                      </p>
                    </div>

                    <p className="mt-2 font-semibold text-slate-950">
                      {opportunity.schedule || 'See listing'}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <Link
                    href={`/opportunities/${opportunity.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-orange-700 hover:text-orange-800"
                  >
                    View listing
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <div className="sm:min-w-52">
                    <SaveOpportunityButton opportunityId={opportunity.id} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : opportunities.length > 0 ? (
        <div className="card border-dashed p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
            <Search className="h-8 w-8" />
          </div>

          <h3 className="mt-6 text-3xl font-bold tracking-tight">
            No matching opportunities found
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            No active opportunity records match your current filters. Try
            changing the search, selecting a different trade, or clearing the
            verified-employer filter.
          </p>

          <button type="button" onClick={clearFilters} className="btn-dark mt-6">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="card border-dashed p-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
              <ClipboardList className="h-8 w-8" />
            </div>

            <h3 className="mt-6 text-3xl font-bold tracking-tight">
              No active opportunities yet
            </h3>

            <p className="lead-text mt-4">
              We are keeping this section honest. Opportunities will appear here
              only when real employer listings, apprenticeships, trainee roles,
              or workforce opportunities are added.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/programs" className="btn-dark">
                Explore training programs
                <CheckCircle2 className="h-4 w-4" />
              </Link>

              <Link href="/for-employers" className="btn-outline">
                For employers
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}