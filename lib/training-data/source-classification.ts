export type SourceAuthority =
  | 'edu'
  | 'federal_gov'
  | 'state_gov'
  | 'local_gov'
  | 'provider_verified'
  | 'manual_review'

export type TrustLevel =
  | 'auto_trusted'
  | 'trusted_source_review'
  | 'review_required'
  | 'blocked'

export type SourceType =
  | 'community_college'
  | 'technical_college'
  | 'college_scorecard'
  | 'ipeds'
  | 'registered_apprenticeship'
  | 'state_etpl'
  | 'state_workforce'
  | 'workforce_board'
  | 'provider_submitted'
  | 'other_verified'

export type CrawlerStrategy =
  | 'manual'
  | 'official_api'
  | 'official_csv'
  | 'official_page_crawl'
  | 'sitemap'
  | 'provider_submission'

export type SourceClassification = {
  sourceAuthority: SourceAuthority
  trustLevel: TrustLevel
  crawlerStrategy: CrawlerStrategy
  allowedDomains: string[]
}

const FEDERAL_GOV_DOMAINS = [
  'apprenticeship.gov',
  'dol.gov',
  'ed.gov',
  'nces.ed.gov',
  'collegescorecard.ed.gov',
  'careeronestop.org',
]

const STATE_GOV_PATTERNS = [
  '.gov',
  'dir.ca.gov',
  'edd.ca.gov',
  'twc.texas.gov',
  'floridajobs.org',
  'labor.ny.gov',
]

export function normalizeHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase()
  } catch {
    return ''
  }
}

export function isEduDomain(url: string) {
  const hostname = normalizeHostname(url)
  return hostname.endsWith('.edu')
}

export function isFederalGovSource(url: string) {
  const hostname = normalizeHostname(url)

  return FEDERAL_GOV_DOMAINS.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
  )
}

export function isGovernmentDomain(url: string) {
  const hostname = normalizeHostname(url)
  return hostname.endsWith('.gov')
}

export function classifyTrainingSource({
  baseUrl,
  sourceType,
}: {
  baseUrl: string
  sourceType: SourceType
}): SourceClassification {
  const hostname = normalizeHostname(baseUrl)

  if (!hostname) {
    return {
      sourceAuthority: 'manual_review',
      trustLevel: 'blocked',
      crawlerStrategy: 'manual',
      allowedDomains: [],
    }
  }

  if (isFederalGovSource(baseUrl)) {
    return {
      sourceAuthority: 'federal_gov',
      trustLevel: 'auto_trusted',
      crawlerStrategy: 'official_api',
      allowedDomains: [hostname],
    }
  }

  if (isGovernmentDomain(baseUrl)) {
    return {
      sourceAuthority: STATE_GOV_PATTERNS.some((pattern) =>
        hostname.includes(pattern.replace(/^\./, ''))
      )
        ? 'state_gov'
        : 'local_gov',
      trustLevel: 'auto_trusted',
      crawlerStrategy: 'official_api',
      allowedDomains: [hostname],
    }
  }

  if (isEduDomain(baseUrl)) {
    return {
      sourceAuthority: 'edu',
      trustLevel:
        sourceType === 'community_college' || sourceType === 'technical_college'
          ? 'trusted_source_review'
          : 'review_required',
      crawlerStrategy: 'official_page_crawl',
      allowedDomains: [hostname],
    }
  }

  return {
    sourceAuthority: 'manual_review',
    trustLevel: 'review_required',
    crawlerStrategy: 'manual',
    allowedDomains: [hostname],
  }
}

export function sourceAuthorityLabel(authority: SourceAuthority) {
  const labels: Record<SourceAuthority, string> = {
    edu: '.edu institution',
    federal_gov: 'Federal government',
    state_gov: 'State government',
    local_gov: 'Local government',
    provider_verified: 'Provider verified',
    manual_review: 'Manual review',
  }

  return labels[authority]
}

export function trustLevelLabel(level: TrustLevel) {
  const labels: Record<TrustLevel, string> = {
    auto_trusted: 'Auto-trusted source',
    trusted_source_review: 'Trusted source, review candidates',
    review_required: 'Review required',
    blocked: 'Blocked',
  }

  return labels[level]
}