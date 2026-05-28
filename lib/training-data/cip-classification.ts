export type ProgramType =
  | 'apprenticeship'
  | 'trade_school'
  | 'community_college'
  | 'workforce_program'
  | 'employer_training'

type ClassifiedProgram = {
  tradeSlug: string
  programType: ProgramType
}

const TRADE_KEYWORDS: { tradeSlug: string; keywords: string[] }[] = [
  {
    tradeSlug: 'electrical',
    keywords: [
      'electrician',
      'electrical',
      'electromechanical',
      'power transmission',
      'electrical and electronics',
    ],
  },
  {
    tradeSlug: 'hvac',
    keywords: [
      'heating',
      'air conditioning',
      'refrigeration',
      'hvac',
      'environmental control',
    ],
  },
  {
    tradeSlug: 'plumbing',
    keywords: ['plumbing', 'pipefitting', 'pipefitter', 'steamfitting'],
  },
  {
    tradeSlug: 'welding',
    keywords: ['welding', 'welder', 'metal fabrication', 'metal working'],
  },
  {
    tradeSlug: 'automotive',
    keywords: [
      'automotive',
      'vehicle',
      'diesel',
      'collision',
      'autobody',
      'auto body',
      'mechanic',
    ],
  },
  {
    tradeSlug: 'solar',
    keywords: ['solar', 'photovoltaic', 'renewable energy'],
  },
  {
    tradeSlug: 'construction',
    keywords: [
      'construction',
      'building',
      'carpentry',
      'masonry',
      'cabinetmaking',
      'construction trades',
      'heavy equipment',
      'industrial technology',
      'manufacturing',
      'machine tool',
      'machining',
    ],
  },
  {
    tradeSlug: 'carpentry',
    keywords: ['carpentry', 'carpenter', 'woodworking', 'cabinetmaking'],
  },
]

export function classifyProgramFromText(text: string): ClassifiedProgram {
  const normalized = text.toLowerCase()

  const match = TRADE_KEYWORDS.find((trade) =>
    trade.keywords.some((keyword) => normalized.includes(keyword))
  )

  return {
    tradeSlug: match?.tradeSlug ?? 'other',
    programType: 'community_college',
  }
}

export function shouldImportFieldOfStudy({
  institutionName,
  cipDescription,
}: {
  institutionName: string
  cipDescription: string
}) {
  const combined = `${institutionName} ${cipDescription}`.toLowerCase()

  const isCommunityOrTechnicalInstitution =
    combined.includes('community college') ||
    combined.includes('junior college') ||
    combined.includes('city college') ||
    combined.includes('technical college') ||
    combined.includes('trade') ||
    combined.includes('career') ||
    combined.includes('vocational')

  const isSkilledTradeField = TRADE_KEYWORDS.some((trade) =>
    trade.keywords.some((keyword) => combined.includes(keyword))
  )

  return isCommunityOrTechnicalInstitution || isSkilledTradeField
}

export function normalizeCredentialLabel(value: string | null | undefined) {
  const cleaned = value?.trim()

  if (!cleaned) return 'Program'

  return cleaned
    .replace(/^Certificate of /i, 'Certificate: ')
    .replace(/^Associate's degree$/i, 'Associate Degree')
}