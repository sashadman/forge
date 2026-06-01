'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { OpportunityType } from '@/lib/supabase/app-types'

type EmployerOpportunitySubmissionInput = {
  employerId: string
  employerSlug: string
  title: string
  opportunityType: OpportunityType
  tradeSlug: string
  location: string
  state: string
  payRange?: string
  schedule?: string
  description: string
  requirements?: string
  benefits?: string
  applicationUrl?: string
  status?: 'draft' | 'submitted'
}

type EmployerForSubmission = {
  id: string
  slug: string
  name: string
  owner_id: string
  is_active: boolean
}

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function cleanOptionalText(value?: string) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

function cleanOptionalUrl(value?: string) {
  const trimmed = value?.trim()

  if (!trimmed) return null

  try {
    const url = new URL(
      trimmed.startsWith('http://') || trimmed.startsWith('https://')
        ? trimmed
        : `https://${trimmed}`
    )

    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error()
    }

    return url.toString()
  } catch {
    throw new Error('Application URL must be a valid URL.')
  }
}

function splitLines(value?: string) {
  const lines =
    value
      ?.split('\n')
      .map((line) => line.trim())
      .filter(Boolean) ?? []

  return lines.length > 0 ? lines : null
}

async function requireUserId() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must sign in first.')
  }

  return user.id
}

async function requireEmployerOwner({
  employerId,
  userId,
}: {
  employerId: string
  userId: string
}) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('employers')
    .select('id, slug, name, owner_id, is_active')
    .eq('id', employerId)
    .maybeSingle()

  if (error || !data) {
    throw new Error('Employer profile could not be found.')
  }

  const employer = data as EmployerForSubmission

  if (!employer.is_active) {
    throw new Error('This employer profile is not active.')
  }

  if (employer.owner_id !== userId) {
    throw new Error('You can only submit opportunities for your own employer profile.')
  }

  return employer
}

export async function createEmployerOpportunitySubmission(
  input: EmployerOpportunitySubmissionInput
) {
  const supabase = createClient()
  const userId = await requireUserId()

  const employer = await requireEmployerOwner({
    employerId: input.employerId,
    userId,
  })

  const title = input.title.trim()
  const location = input.location.trim()
  const state = input.state.trim().toUpperCase()
  const description = input.description.trim()
  const status = input.status === 'draft' ? 'draft' : 'submitted'

  if (!title) {
    throw new Error('Opportunity title is required.')
  }

  if (!location) {
    throw new Error('City is required.')
  }

  if (state.length !== 2) {
    throw new Error('Please choose a valid two-letter state.')
  }

  if (description.length < 80) {
    throw new Error('Description should be at least 80 characters for review quality.')
  }

  const baseSlug = createSlug(title)

  if (!baseSlug) {
    throw new Error('Opportunity title must contain letters or numbers.')
  }

  const slug = createSlug(`${employer.slug || input.employerSlug}-${baseSlug}`)

  const { data, error } = await supabase
    .from('employer_opportunity_submissions')
    .insert({
      employer_id: employer.id,
      submitted_by: userId,
      title,
      slug,
      opportunity_type: input.opportunityType,
      trade_slug: input.tradeSlug,
      location,
      state,
      pay_range: cleanOptionalText(input.payRange),
      schedule: cleanOptionalText(input.schedule),
      description,
      requirements: splitLines(input.requirements),
      benefits: splitLines(input.benefits),
      application_url: cleanOptionalUrl(input.applicationUrl),
      external_url: cleanOptionalUrl(input.applicationUrl),
      contact_email: null,
      contact_phone: null,
      status,
    })
    .select('id, status')
    .single()

  if (error) {
    throw new Error(`Could not submit opportunity for review: ${error.message}`)
  }

  revalidatePath('/employers/dashboard')
  revalidatePath('/admin/opportunities')

  return data
}
