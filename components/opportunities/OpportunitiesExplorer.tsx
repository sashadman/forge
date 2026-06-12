'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react'
import SaveOpportunityButton from '@/components/opportunities/SaveOpportunityButton'
import {
  getOpportunityApplyLabel,
  getOpportunityTrustLabel,
  isExternalOpportunity,
} from '@/lib/opportunities/opportunity-trust'

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
  application_url: string | null
  external_url: string | null
  source_name: string | null
  source_attribution: string | null
  verification_status: string | null
  employers: EmployerRelation | EmployerRelation[] | null
}

type OpportunitiesExplorerProps = {
  opportunities: Opportunity[]
  savedOpportunityIds: string[]
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
  savedOpportunityIds,
}: OpportunitiesExplorerProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [opportunityType, setOpportunityType] = useState('all')
  const [careerFocus, setCareerFocus] = useState('all')
  const [location, setLocation] = useState('all')
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  const savedOpportunityIdSet = useMemo(() => {
    return new Set(savedOpportunityIds)
  }, [savedOpportunityIds])

  const opportunityTypes = useMemo(() => {
    return Array.from(
      new Set(opportunities.map((opportunity) => opportunity.opportunity_type))
    ).sort()
  }, [opportunities])

  const careerFocusOptions = useMemo(() => {
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

      const matchesCareerFocus =
        careerFocus === 'all' || opportunity.trade_slug === careerFocus

      const opportunityLocation = `${opportunity.location}, ${opportunity.state}`
      const matchesLocation =
        location === 'all' || opportunityLocation === location

      const matchesVerified = !verifiedOnly || Boolean(employer?.is_verified)

      return (
        matchesSearch &&
        matchesType &&
        matchesCareerFocus &&
        matchesLocation &&
        matchesVerified
      )
    })
  }, [
    opportunities,
    searchTerm,
    opportunityType,
    careerFocus,
    location,
    verifiedOnly,
  ])

  function clearFilters() {
    setSearchTerm('')
    setOpportunityType('all')
    setCareerFocus('all')
    setLocation('all')
    setVerifiedOnly(false)
  }

  return (
    <div className="space-y-8">
      <section className="content-panel">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="eyebrow">Jobs & apprenticeships directory</p>

            <h2 className="section-title mt-3">
              Search active skilled-trades openings
            </h2>

            <p className="muted-text mt-3 max-w-2xl">
              Use search here because this page is for action-ready listings.
              Filter by employer, career path, listing type, location, schedule,
              or pay.
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
              placeholder="Search employer, career path, city, role..."
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
            Verified employer only
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
      </section>

      {filteredOpportunities.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredOpportunities.map((opportunity) => {
            const employer = getEmployer(opportunity)
            const externalOpportunity = isExternalOpportunity(opportunity)
            const trustLabel = getOpportunityTrustLabel({
              verification_status: opportunity.verification_status,
              employerIsVerified: employer?.is_verified,
            })
            const applyLabel = getOpportunityApplyLabel(opportunity)
            const applyUrl =
              opportunity.application_url || opportunity.external_url

            return (
              <article key={opportunity.id} className="card">
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

                        <span className="trust-badge">
                          {externalOpportunity ? (
                            <ExternalLink className="h-3.5 w-3.5 text-orange-600" />
                          ) : (
                            <ShieldCheck className="h-3.5 w-3.5 text-orange-600" />
                          )}
                          {trustLabel}
                        </span>

                        {employer?.is_verified && !externalOpportunity && (
                          <span className="trust-badge">
                            <ShieldCheck className="h-3.5 w-3.5 text-orange-600" />
                            Direct employer listing
                          </span>
                        )}
                      </div>

                      <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 transition group-hover:text-orange-700">
                        {opportunity.title}
                      </h3>

                      <p className="mt-2 font-semibold text-slate-600">
                        {employer?.name || 'Employer listing'}
                      </p>

                      {externalOpportunity && (
                        <p className="mt-2 text-sm font-semibold text-slate-500">
                          Source:{' '}
                          {opportunity.source_name ||
                            employer?.name ||
                            'Trusted external hiring source'}
                        </p>
                      )}
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
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Link
                      href={`/opportunities/${opportunity.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-orange-700 hover:text-orange-800"
                    >
                      View listing
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                    {externalOpportunity && applyUrl && (
                      <a
                        href={applyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-950"
                      >
                        {applyLabel}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>

                  <div className="sm:min-w-52">
                    <SaveOpportunityButton
                      opportunityId={opportunity.id}
                      initiallySaved={savedOpportunityIdSet.has(opportunity.id)}
                    />
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      ) : opportunities.length > 0 ? (
        <div className="card border-dashed p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
            <Search className="h-8 w-8" />
          </div>

          <h3 className="mt-6 text-3xl font-bold tracking-tight">
            No matching jobs or apprenticeships found
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            No active records match your current filters. Try a different career
            path, location, listing type, or clear the verified-employer filter.
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
              No active jobs or apprenticeships yet
            </h3>

            <p className="lead-text mt-4">
              We are keeping this section honest. Listings will appear here only
              when real jobs, apprenticeships, trainee roles, or workforce
              opportunities are added.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/programs" className="btn-dark">
                Compare training programs
                <CheckCircle2 className="h-4 w-4" />
              </Link>

              <Link href="/trades" className="btn-outline">
                Compare career paths
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
