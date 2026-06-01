'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type {
  OpportunityType,
  OpportunityVerificationStatus,
} from '@/lib/supabase/app-types'

type SubmissionForReview = {
  id: string
  employer_id: string
  title: string
  slug: string | null
  opportunity_type: string
  trade_slug: string
  location: string
  state: string
  pay_range: string | null
  schedule: string | null
  description: string
  requirements: string[] | null
  benefits: string[] | null
  application_url: string | null
  external_url: string | null
  status: string
  approved_opportunity_id: string | null
}

type EmployerForSubmission = {
  id: string
  name: string
  slug: string
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

function cleanOptionalText(value: string | null | undefined) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

function getSafeOpportunityType(value: string): OpportunityType {
  const allowed = [
    'job',
    'apprenticeship',
    'trainee',
    'internship',
    'pre_apprenticeship',
  ]

  if (allowed.includes(value)) {
    return value as OpportunityType
  }

  return 'job'
}

async function requireAdminUserId() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must sign in first.')
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (error || profile?.role !== 'admin') {
    throw new Error('Admin access required.')
  }

  return user.id
}

async function loadSubmission(submissionId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('employer_opportunity_submissions')
    .select(
      `
      id,
      employer_id,
      title,
      slug,
      opportunity_type,
      trade_slug,
      location,
      state,
      pay_range,
      schedule,
      description,
      requirements,
      benefits,
      application_url,
      external_url,
      status,
      approved_opportunity_id
      `
    )
    .eq('id', submissionId)
    .single()

  if (error || !data) {
    throw new Error('Submission could not be found.')
  }

  return data as SubmissionForReview
}

async function loadEmployer(employerId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('employers')
    .select('id, name, slug, is_active')
    .eq('id', employerId)
    .single()

  if (error || !data) {
    throw new Error('Employer could not be found.')
  }

  const employer = data as EmployerForSubmission

  if (!employer.is_active) {
    throw new Error('Employer profile is inactive.')
  }

  return employer
}

async function ensureUniqueOpportunitySlug(baseSlug: string) {
  const supabase = createClient()
  const fallback = baseSlug || `opportunity-${Date.now()}`
  let slug = fallback
  let suffix = 1

  while (true) {
    const { data, error } = await supabase
      .from('opportunities')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()

    if (error) {
      throw new Error(`Could not verify opportunity slug: ${error.message}`)
    }

    if (!data) return slug

    suffix += 1
    slug = `${fallback}-${suffix}`
  }
}

export async function approveEmployerOpportunitySubmission({
  submissionId,
}: {
  submissionId: string
}) {
  const supabase = createClient()
  const adminUserId = await requireAdminUserId()
  const submission = await loadSubmission(submissionId)

  if (submission.status === 'approved' && submission.approved_opportunity_id) {
    return {
      opportunityId: submission.approved_opportunity_id,
      status: submission.status,
    }
  }

  if (submission.status !== 'submitted') {
    throw new Error('Only submitted opportunities can be approved.')
  }

  const employer = await loadEmployer(submission.employer_id)

  const baseSlug =
    submission.slug || createSlug(`${employer.slug}-${submission.title}`)

  const slug = await ensureUniqueOpportunitySlug(baseSlug)
  const now = new Date().toISOString()
  const applicationUrl =
    cleanOptionalText(submission.application_url) ||
    cleanOptionalText(submission.external_url)

  const verificationStatus: OpportunityVerificationStatus = 'employer_verified'

  const { data: opportunity, error: createError } = await supabase
    .from('opportunities')
    .insert({
      employer_id: submission.employer_id,
      title: submission.title,
      slug,
      opportunity_type: getSafeOpportunityType(submission.opportunity_type),
      trade_slug: submission.trade_slug,
      location: submission.location,
      state: submission.state,
      pay_range: submission.pay_range,
      schedule: submission.schedule,
      description: submission.description,
      requirements: submission.requirements,
      benefits: submission.benefits,
      application_url: applicationUrl,
      external_url: submission.external_url || applicationUrl,
      source_name: employer.name,
      source_attribution: `Employer submitted opportunity reviewed by admin. Submission ID: ${submission.id}`,
      verification_status: verificationStatus,
      last_verified_at: now,
      reviewed_at: now,
      reviewed_by: adminUserId,
      is_active: true,
    })
    .select('id, slug')
    .single()

  if (createError || !opportunity) {
    throw new Error(
      `Could not publish opportunity: ${createError?.message ?? 'Unknown error'}`
    )
  }

  const { error: updateError } = await supabase
    .from('employer_opportunity_submissions')
    .update({
      status: 'approved',
      reviewed_by: adminUserId,
      reviewed_at: now,
      approved_opportunity_id: opportunity.id,
      admin_notes: 'Approved and published as a public opportunity.',
    })
    .eq('id', submission.id)

  if (updateError) {
    throw new Error(
      `Opportunity was created, but submission status could not be updated: ${updateError.message}`
    )
  }

  revalidatePath('/admin/employer-opportunity-submissions')
  revalidatePath('/admin/opportunities')
  revalidatePath('/employers/dashboard')
  revalidatePath('/opportunities')
  revalidatePath(`/opportunities/${opportunity.slug}`)

  return {
    opportunityId: opportunity.id,
    slug: opportunity.slug,
    status: 'approved',
  }
}

export async function rejectEmployerOpportunitySubmission({
  submissionId,
  adminNotes,
}: {
  submissionId: string
  adminNotes: string
}) {
  const supabase = createClient()
  const adminUserId = await requireAdminUserId()
  const submission = await loadSubmission(submissionId)

  if (submission.status !== 'submitted') {
    throw new Error('Only submitted opportunities can be rejected.')
  }

  const notes = adminNotes.trim()

  if (notes.length < 12) {
    throw new Error('Please add a useful rejection note for the employer.')
  }

  const { error } = await supabase
    .from('employer_opportunity_submissions')
    .update({
      status: 'rejected',
      admin_notes: notes,
      reviewed_by: adminUserId,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', submission.id)

  if (error) {
    throw new Error(`Could not reject submission: ${error.message}`)
  }

  revalidatePath('/admin/employer-opportunity-submissions')
  revalidatePath('/employers/dashboard')

  return {
    status: 'rejected',
  }
}
