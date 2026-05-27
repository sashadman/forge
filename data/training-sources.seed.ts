import {
  classifyTrainingSource,
  type SourceType,
} from '@/lib/training-data/source-classification'

export type TrainingSourceSeed = {
  source_name: string
  source_slug: string
  source_type: SourceType
  base_url: string
  source_state: string | null
  source_country: 'US'
  institution_name: string | null
  provider_name: string | null
  program_index_url: string | null
  api_endpoint: string | null
  admin_notes: string | null
}

function makeSource(input: TrainingSourceSeed) {
  const classification = classifyTrainingSource({
    baseUrl: input.base_url,
    sourceType: input.source_type,
  })

  return {
    ...input,
    source_authority: classification.sourceAuthority,
    trust_level: classification.trustLevel,
    crawler_strategy: classification.crawlerStrategy,
    allowed_domains: classification.allowedDomains,
    crawl_status: 'not_started' as const,
    is_active: true,
  }
}

export const nationalTrainingSourcesSeed = [
  makeSource({
    source_name: 'Apprenticeship.gov',
    source_slug: 'apprenticeship-gov',
    source_type: 'registered_apprenticeship',
    base_url: 'https://www.apprenticeship.gov/',
    source_state: null,
    source_country: 'US',
    institution_name: null,
    provider_name: 'U.S. Department of Labor',
    program_index_url: 'https://www.apprenticeship.gov/data-and-statistics',
    api_endpoint: null,
    admin_notes:
      'Official federal apprenticeship source. Use for registered apprenticeship discovery and source validation.',
  }),
  makeSource({
    source_name: 'College Scorecard',
    source_slug: 'college-scorecard',
    source_type: 'college_scorecard',
    base_url: 'https://collegescorecard.ed.gov/',
    source_state: null,
    source_country: 'US',
    institution_name: null,
    provider_name: 'U.S. Department of Education',
    program_index_url: 'https://collegescorecard.ed.gov/data/',
    api_endpoint: 'https://api.data.gov/ed/collegescorecard/v1/schools',
    admin_notes:
      'Official federal education data source for institution discovery and postsecondary data.',
  }),
  makeSource({
    source_name: 'IPEDS / NCES',
    source_slug: 'ipeds-nces',
    source_type: 'ipeds',
    base_url: 'https://nces.ed.gov/ipeds/',
    source_state: null,
    source_country: 'US',
    institution_name: null,
    provider_name: 'National Center for Education Statistics',
    program_index_url: 'https://nces.ed.gov/ipeds/',
    api_endpoint: null,
    admin_notes:
      'Federal postsecondary education data source. Use for institution and completion/program-category reference.',
  }),
  makeSource({
    source_name: 'CareerOneStop',
    source_slug: 'careeronestop',
    source_type: 'state_etpl',
    base_url: 'https://www.careeronestop.org/',
    source_state: null,
    source_country: 'US',
    institution_name: null,
    provider_name: 'U.S. Department of Labor / CareerOneStop',
    program_index_url: 'https://www.careeronestop.org/Toolkit/Training/find-local-training.aspx',
    api_endpoint: null,
    admin_notes:
      'National workforce and training search source connected to American Job Center ecosystem. Use for ETPL/training-provider discovery where available.',
  }),
  makeSource({
    source_name: 'California DIR Registered Apprenticeship Search',
    source_slug: 'california-dir-registered-apprenticeship-search',
    source_type: 'registered_apprenticeship',
    base_url: 'https://www.dir.ca.gov/',
    source_state: 'CA',
    source_country: 'US',
    institution_name: null,
    provider_name: 'California Department of Industrial Relations',
    program_index_url: 'https://www.dir.ca.gov/databases/das/aigstart.asp',
    api_endpoint: null,
    admin_notes:
      'California official registered apprenticeship search source.',
  }),
  makeSource({
    source_name: 'California EDD Eligible Training Provider List',
    source_slug: 'california-edd-etpl',
    source_type: 'state_etpl',
    base_url: 'https://edd.ca.gov/',
    source_state: 'CA',
    source_country: 'US',
    institution_name: null,
    provider_name: 'California Employment Development Department',
    program_index_url:
      'https://edd.ca.gov/en/jobs_and_training/Eligible_Training_Provider_List/',
    api_endpoint: null,
    admin_notes:
      'California state eligible training provider source. Use for verified workforce-training discovery.',
  }),
]