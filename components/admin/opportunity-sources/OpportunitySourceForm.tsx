'use client'

import { useState, useTransition } from 'react'
import { PlusCircle } from 'lucide-react'
import {
  OPPORTUNITY_SOURCE_TYPE_OPTIONS,
  SOURCE_RELIABILITY_OPTIONS,
} from '@/lib/opportunities/opportunity-source-config'
import type {
  OpportunitySourceType,
  SourceReliabilityLevel,
} from '@/lib/supabase/app-types'
import { createOpportunitySource } from '@/app/actions/opportunity-sources'

export default function OpportunitySourceForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [sourceType, setSourceType] =
    useState<OpportunitySourceType>('manual_research')
  const [reliabilityLevel, setReliabilityLevel] =
    useState<SourceReliabilityLevel>('needs_review')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    setError('')
    setSuccess('')

    const name = String(formData.get('name') ?? '')
    const websiteUrl = String(formData.get('websiteUrl') ?? '')
    const searchUrl = String(formData.get('searchUrl') ?? '')
    const region = String(formData.get('region') ?? '')
    const state = String(formData.get('state') ?? '')
    const tradeFocus = String(formData.get('tradeFocus') ?? '')
    const description = String(formData.get('description') ?? '')
    const notes = String(formData.get('notes') ?? '')

    startTransition(async () => {
      try {
        await createOpportunitySource({
          name,
          sourceType,
          reliabilityLevel,
          websiteUrl,
          searchUrl,
          region,
          state,
          tradeFocus,
          description,
          notes,
        })

        setSuccess('Opportunity source created.')
        setIsOpen(false)
      } catch (error) {
        console.error('Failed to create opportunity source:', error)
        setError(
          error instanceof Error
            ? error.message
            : 'Could not create opportunity source.'
        )
      }
    })
  }

  return (
    <section className="content-panel">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <p className="eyebrow">Source directory</p>

          <h2 className="section-title mt-3">Add a trusted opportunity source</h2>

          <p className="muted-text mt-3 max-w-3xl">
            Add public directories, workforce boards, apprenticeship sources,
            union training centers, employer career pages, and government
            resources that can support broad opportunity discovery.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="btn-primary shrink-0 px-5 py-3"
        >
          <PlusCircle className="h-4 w-4" />
          {isOpen ? 'Close form' : 'Add source'}
        </button>
      </div>

      {isOpen && (
        <form action={handleSubmit} className="mt-8 grid gap-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <Field label="Source name" name="name" required />
            <Field label="Website URL" name="websiteUrl" required />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <SelectField
              label="Source type"
              value={sourceType}
              onChange={(value) => setSourceType(value as OpportunitySourceType)}
              options={OPPORTUNITY_SOURCE_TYPE_OPTIONS}
            />

            <SelectField
              label="Reliability"
              value={reliabilityLevel}
              onChange={(value) =>
                setReliabilityLevel(value as SourceReliabilityLevel)
              }
              options={SOURCE_RELIABILITY_OPTIONS}
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <Field label="Search URL" name="searchUrl" />
            <Field label="Region" name="region" placeholder="San Diego, California, National" />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <Field label="State" name="state" placeholder="CA" />
            <Field
              label="Trade focus"
              name="tradeFocus"
              placeholder="electrician, HVAC, plumbing"
            />
          </div>

          <TextAreaField
            label="Description"
            name="description"
            placeholder="What kind of listings or opportunities does this source provide?"
          />

          <TextAreaField
            label="Admin notes"
            name="notes"
            placeholder="Internal notes about quality, limitations, update frequency, or review needs."
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              New sources are active by default and scheduled for review in 30 days.
            </p>

            <button
              type="submit"
              disabled={isPending}
              className="btn-dark px-6 py-3"
            >
              {isPending ? 'Creating...' : 'Create source'}
            </button>
          </div>
        </form>
      )}

      {success && (
        <p className="mt-5 rounded-2xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 ring-1 ring-green-100">
          {success}
        </p>
      )}

      {error && (
        <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-100">
          {error}
        </p>
      )}
    </section>
  )
}

function Field({
  label,
  name,
  required = false,
  placeholder,
}: {
  label: string
  name: string
  required?: boolean
  placeholder?: string
}) {
  return (
    <label>
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>

      <input
        name={name}
        required={required}
        placeholder={placeholder}
        className="input-field mt-2"
      />
    </label>
  )
}

function TextAreaField({
  label,
  name,
  placeholder,
}: {
  label: string
  name: string
  placeholder?: string
}) {
  return (
    <label>
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>

      <textarea
        name={name}
        rows={4}
        placeholder={placeholder}
        className="input-field mt-2"
      />
    </label>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string; description: string }[]
}) {
  return (
    <label>
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="input-field mt-2"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {options.find((option) => option.value === value)?.description}
      </p>
    </label>
  )
}