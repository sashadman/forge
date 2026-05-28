import {
  classifyProgramFromText,
  normalizeCredentialLabel,
  shouldImportFieldOfStudy,
} from './cip-classification'

export type CollegeScorecardFieldRow = Record<string, string | undefined>

function getFirstValue(row: CollegeScorecardFieldRow, keys: string[]) {
  for (const key of keys) {
    const value = row[key]

    if (value && value.trim()) {
      return value.trim()
    }
  }

  return ''
}

function createReadableProgramTitle({
  cipDescription,
  credentialDescription,
}: {
  cipDescription: string
  credentialDescription: string
}) {
  const credential = normalizeCredentialLabel(credentialDescription)

  if (credential === 'Program') {
    return cipDescription
  }

  return `${cipDescription} — ${credential}`
}

function createCollegeScorecardSourceUrl({
  institutionName,
  unitId,
  cipCode,
  credentialLevel,
}: {
  institutionName: string
  unitId: string
  cipCode: string
  credentialLevel: string
}) {
  const searchParams = new URLSearchParams()

  if (unitId) searchParams.set('unitid', unitId)
  if (institutionName) searchParams.set('search', institutionName)
  if (cipCode) searchParams.set('cip', cipCode)
  if (credentialLevel) searchParams.set('credential', credentialLevel)

  return `https://collegescorecard.ed.gov/search/?${searchParams.toString()}`
}

export function normalizeCollegeScorecardFieldRow(row: CollegeScorecardFieldRow) {
  const unitId = getFirstValue(row, ['UNITID', 'unitid', 'id'])
  const institutionName = getFirstValue(row, [
    'INSTNM',
    'instnm',
    'institution.name',
    'school.name',
  ])
  const cipCode = getFirstValue(row, ['CIPCODE', 'cipcode', 'cip.code'])
  const cipDescription = getFirstValue(row, [
    'CIPDESC',
    'cipdesc',
    'cip.description',
    'program.name',
  ])
  const credentialLevel = getFirstValue(row, ['CREDLEV', 'credlev'])
  const credentialDescription = getFirstValue(row, [
    'CREDDESC',
    'creddesc',
    'credential.description',
  ])
  const state = getFirstValue(row, ['STABBR', 'stabbr', 'school.state'])
  const city = getFirstValue(row, ['CITY', 'city', 'school.city'])

  if (!institutionName || !cipDescription) {
    return null
  }

  if (
    !shouldImportFieldOfStudy({
      institutionName,
      cipDescription,
    })
  ) {
    return null
  }

  const classification = classifyProgramFromText(
    `${institutionName} ${cipDescription}`
  )

  const title = createReadableProgramTitle({
    cipDescription,
    credentialDescription,
  })

  const sourceUrl = createCollegeScorecardSourceUrl({
    institutionName,
    unitId,
    cipCode,
    credentialLevel,
  })

  return {
    external_id: [unitId, cipCode, credentialLevel].filter(Boolean).join('-'),
    source_url: sourceUrl,
    title,
    provider_name: institutionName,
    institution_name: institutionName,
    program_type: classification.programType,
    trade_slug: classification.tradeSlug,
    location: city || 'See provider',
    state: state || null,
    country: 'US',
    duration: 'See official source',
    cost: 'See official source',
    description:
      `Official College Scorecard field-of-study record for ${institutionName}. ` +
      `Review the official source and college catalog for current details, availability, and admission requirements.`,
    requirements: [
      'Review the official college catalog or program page',
      'Confirm current admission, placement, and enrollment requirements',
      'Verify current program availability with the provider',
    ],
    outcomes: [
      `Field of study: ${cipDescription}`,
      credentialDescription
        ? `Credential level: ${credentialDescription}`
        : 'Credential details available from the official source',
    ],
    cip_code: cipCode || null,
    occupation_code: null,
    apprenticeship_occupation: null,
    raw_payload: row,
  }
}