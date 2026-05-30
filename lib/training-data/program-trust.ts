export type ProgramTrustInput = {
  data_origin?: string | null
  source_url?: string | null
  source_candidate_id?: string | null
  provider_profile_id?: string | null
  review_status?: string | null
  is_active?: boolean | null
  published_at?: string | null
  updated_at?: string | null
}

export function formatProgramOrigin(value: string | null | undefined) {
  if (value === 'candidate_promoted') return 'Promoted from reviewed source'
  if (value === 'official_source_import') return 'Imported from official source'
  if (value === 'provider_submitted') return 'Provider submitted'
  if (value === 'admin_created') return 'Admin created'
  return 'Directory record'
}

export function getProgramTrustLabel(program: ProgramTrustInput) {
  if (program.data_origin === 'candidate_promoted') {
    return 'Reviewed public-source record'
  }

  if (program.data_origin === 'official_source_import') {
    return 'Official-source import'
  }

  if (program.provider_profile_id) {
    return 'Connected provider record'
  }

  if (program.review_status === 'approved') {
    return 'Admin-reviewed record'
  }

  if (program.review_status === 'admin_created') {
    return 'Admin-created record'
  }

  return 'Directory record'
}

export function getProgramTrustDescription(program: ProgramTrustInput) {
  if (program.data_origin === 'candidate_promoted') {
    return 'This listing was promoted from an imported public training source after admin review.'
  }

  if (program.data_origin === 'official_source_import') {
    return 'This listing was imported from an official or trusted public source.'
  }

  if (program.provider_profile_id) {
    return 'This listing is connected to a verified provider workspace. Public changes still require admin review.'
  }

  if (program.review_status === 'approved') {
    return 'This listing was reviewed and approved by an admin before becoming public.'
  }

  if (program.review_status === 'admin_created') {
    return 'This listing was created by an admin from known public or provider information.'
  }

  return 'Confirm details directly with the provider before making enrollment decisions.'
}

export function getFreshnessLabel(updatedAt: string | null | undefined) {
  if (!updatedAt) return 'Freshness unknown'

  const updatedDate = new Date(updatedAt)
  const now = new Date()

  if (Number.isNaN(updatedDate.getTime())) {
    return 'Freshness unknown'
  }

  const daysOld = Math.floor(
    (now.getTime() - updatedDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (daysOld <= 30) return 'Updated recently'
  if (daysOld <= 120) return 'Updated this season'
  if (daysOld <= 365) return 'Updated this year'

  return 'Review recommended'
}

export function formatDisplayDate(value: string | null | undefined) {
  if (!value) return 'Not available'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return 'Not available'

  return date.toLocaleDateString()
}