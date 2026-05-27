import { normalizeHostname } from './source-classification'

export type RawProgramCandidateImport = {
  source_url: string
  title: string
  provider_name: string
  institution_name?: string | null
  program_type?: string | null
  trade_slug?: string | null
  location?: string | null
  state?: string | null
  country?: string | null
  duration?: string | null
  cost?: string | null
  description?: string | null
  requirements?: string[] | null
  outcomes?: string[] | null
  cip_code?: string | null
  occupation_code?: string | null
  apprenticeship_occupation?: string | null
  external_id?: string | null
  raw_payload?: Record<string, unknown>
}

export type ProgramCandidateImportFile = {
  source_slug: string
  records: RawProgramCandidateImport[]
}

const PROGRAM_TYPES = [
  'apprenticeship',
  'trade_school',
  'community_college',
  'workforce_program',
  'employer_training',
]

function cleanString(value: string | null | undefined) {
  return value?.trim() ?? ''
}

function cleanOptionalString(value: string | null | undefined) {
  const cleaned = cleanString(value)
  return cleaned.length > 0 ? cleaned : null
}

function normalizeProgramType(value: string | null | undefined) {
  const cleaned = cleanString(value)

  if (PROGRAM_TYPES.includes(cleaned)) {
    return cleaned
  }

  return 'workforce_program'
}

function normalizeTradeSlug(value: string | null | undefined) {
  const cleaned = cleanString(value)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return cleaned || 'other'
}

function normalizeUrl(value: string) {
  const cleaned = cleanString(value)

  if (!cleaned) {
    throw new Error('Candidate source_url is required.')
  }

  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
    return cleaned
  }

  return `https://${cleaned}`
}

function cleanStringArray(value: string[] | null | undefined) {
  if (!value) return null

  const cleaned = value.map((item) => item.trim()).filter(Boolean)

  return cleaned.length > 0 ? cleaned : null
}

export function normalizeCandidateRecord(record: RawProgramCandidateImport) {
  const sourceUrl = normalizeUrl(record.source_url)
  const sourceDomain = normalizeHostname(sourceUrl)

  if (!sourceDomain) {
    throw new Error(`Invalid candidate URL: ${record.source_url}`)
  }

  const title = cleanString(record.title)
  const providerName = cleanString(record.provider_name)

  if (!title) {
    throw new Error(`Candidate title is required for ${sourceUrl}`)
  }

  if (!providerName) {
    throw new Error(`Candidate provider_name is required for ${sourceUrl}`)
  }

  return {
    external_id: cleanOptionalString(record.external_id),
    source_url: sourceUrl,
    source_domain: sourceDomain,
    title,
    provider_name: providerName,
    institution_name: cleanOptionalString(record.institution_name),
    program_type: normalizeProgramType(record.program_type),
    trade_slug: normalizeTradeSlug(record.trade_slug),
    location: cleanOptionalString(record.location),
    state: cleanOptionalString(record.state)?.toUpperCase() ?? null,
    country: cleanOptionalString(record.country) ?? 'US',
    duration: cleanOptionalString(record.duration),
    cost: cleanOptionalString(record.cost),
    description: cleanOptionalString(record.description),
    requirements: cleanStringArray(record.requirements),
    outcomes: cleanStringArray(record.outcomes),
    cip_code: cleanOptionalString(record.cip_code),
    occupation_code: cleanOptionalString(record.occupation_code),
    apprenticeship_occupation: cleanOptionalString(
      record.apprenticeship_occupation
    ),
    raw_payload: record.raw_payload ?? record,
  }
}

export function sourceAllowsCandidateUrl({
  candidateDomain,
  allowedDomains,
}: {
  candidateDomain: string
  allowedDomains: string[]
}) {
  return allowedDomains.some(
    (domain) =>
      candidateDomain === domain ||
      candidateDomain.endsWith(`.${domain.replace(/^www\./, '')}`)
  )
}