import Link from 'next/link'
import { Filter, PlusCircle, Search } from 'lucide-react'
import type {
  AdminOpportunityEmployerOption,
  AdminOpportunityFilters as AdminOpportunityFiltersType,
  AdminOpportunitySourceOption,
} from '@/lib/admin/get-admin-opportunities-page-data'
import { OPPORTUNITY_VERIFICATION_OPTIONS } from '@/lib/opportunities/opportunity-options'

type AdminOpportunityFiltersProps = {
  filters: AdminOpportunityFiltersType
  employers: AdminOpportunityEmployerOption[]
  sources: AdminOpportunitySourceOption[]
}

export default function AdminOpportunityFilters({
  filters,
  employers,
  sources,
}: AdminOpportunityFiltersProps) {
  return (
    <section className="content-panel">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="eyebrow">Opportunity review controls</p>

          <h2 className="section-title mt-3">Review, filter, and improve listings.</h2>

          <p className="muted-text mt-3 max-w-3xl">
            Use filters to find inactive listings, unverified records, stale
            source data, missing employer connections, or listings that need
            stronger detail before seekers rely on them.
          </p>
        </div>

        <Link href="/admin/opportunities/new" className="btn-primary shrink-0">
          <PlusCircle className="h-4 w-4" />
          Add opportunity
        </Link>
      </div>

      <form action="/admin/opportunities" className="mt-8 grid gap-5">
  <div>
  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
    Search listings
  </span>

  <div className="mt-2 flex flex-col gap-3 sm:flex-row">
    <div className="relative flex-1">
      <input
        name="q"
        defaultValue={filters.q}
        className="input-field pr-12"
        placeholder="Search title, employer, source, trade, city, status..."
      />

      <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
    </div>

    <button type="submit" className="btn-dark shrink-0 px-5 py-3">
      <Search className="h-4 w-4" />
      Search
    </button>
  </div>
</div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <SelectField
            label="Visibility"
            name="status"
            defaultValue={filters.status}
            options={[
              { value: 'all', label: 'All listings' },
              { value: 'active', label: 'Active only' },
              { value: 'inactive', label: 'Inactive only' },
            ]}
          />

          <SelectField
            label="Verification"
            name="verification"
            defaultValue={filters.verification}
            options={[
              { value: 'all', label: 'All verification statuses' },
              ...OPPORTUNITY_VERIFICATION_OPTIONS.map((option) => ({
                value: option.value,
                label: option.label,
              })),
            ]}
          />

          <SelectField
            label="Source"
            name="source"
            defaultValue={filters.source}
            options={[
              { value: 'all', label: 'All sources' },
              { value: 'manual', label: 'Manual / no source' },
              ...sources.map((source) => ({
                value: source.slug,
                label: source.name,
              })),
            ]}
          />

          <SelectField
            label="Employer"
            name="employer"
            defaultValue={filters.employer}
            options={[
              { value: 'all', label: 'All employers' },
              ...employers.map((employer) => ({
                value: employer.slug,
                label: employer.name,
              })),
            ]}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-slate-500">
            Filters are applied server-side so the URL can be shared or revisited.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/admin/opportunities" className="btn-outline px-5 py-3">
              Clear filters
            </Link>

            <button type="submit" className="btn-dark px-5 py-3">
              <Filter className="h-4 w-4" />
              Apply filters
            </button>
          </div>
        </div>
      </form>
    </section>
  )
}

function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string
  name: string
  defaultValue: string
  options: { value: string; label: string }[]
}) {
  return (
    <label>
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>

      <select name={name} defaultValue={defaultValue} className="input-field mt-2">
        {options.map((option) => (
          <option key={`${name}-${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}