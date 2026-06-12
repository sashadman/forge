type OpportunityTrustInput = {
  verification_status?: string | null
  employerIsVerified?: boolean | null
}

export function isExternalOpportunity({
  verification_status,
}: OpportunityTrustInput) {
  return (
    verification_status === 'source_verified' ||
    verification_status === 'admin_reviewed'
  )
}

export function getOpportunityTrustLabel({
  verification_status,
  employerIsVerified,
}: OpportunityTrustInput) {
  if (verification_status === 'employer_verified') {
    return employerIsVerified
      ? 'Ara Skills Verified Employer'
      : 'Employer-posted Opportunity'
  }

  if (isExternalOpportunity({ verification_status })) {
    return 'External Opportunity'
  }

  return 'Reviewed Listing'
}

export function getOpportunityTrustDescription({
  verification_status,
  employerIsVerified,
}: OpportunityTrustInput) {
  if (verification_status === 'employer_verified') {
    return employerIsVerified
      ? 'This listing is connected to an Ara Skills reviewed employer profile.'
      : 'This listing was posted through the employer workflow and reviewed before publication.'
  }

  if (isExternalOpportunity({ verification_status })) {
    return 'This opportunity comes from a trusted external hiring source. Apply through the original employer or partner application page.'
  }

  return 'This listing passed the public visibility review gate.'
}

export function getOpportunityApplyLabel(input: OpportunityTrustInput) {
  return isExternalOpportunity(input)
    ? 'Apply on Employer Site'
    : 'Apply through Ara Skills'
}
