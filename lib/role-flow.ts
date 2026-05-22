export const ROUTES = {
  home: '/',
  seekerDashboard: '/dashboard',
  seekerReadiness: '/dashboard/readiness',
  careerPaths: '/trades',
  trainingPrograms: '/programs',
  jobsAndApprenticeships: '/opportunities',
  careerQuiz: '/quiz',

  employerOverview: '/for-employers',
  employerSignUp: '/employers/sign-up',
  employerSignIn: '/employers/sign-in',
  employerProfileSetup: '/employers/new',
  employerDashboard: '/employers/dashboard',
  employerProfile: '/employers/profile',
  employerCreateListing: '/employers/opportunities/new',

  trainingProviderOverview: '/for-programs',
  trainingProviderWorkflow: '/for-programs#provider-workflow',
  trainingProviderProgramData: '/for-programs#program-data',
  trainingProviderInsights: '/for-programs#provider-insights',
} as const

const SAFE_NEXT_PATHS = new Set<string>([
  ROUTES.seekerDashboard,
  ROUTES.seekerReadiness,
  ROUTES.careerPaths,
  ROUTES.trainingPrograms,
  ROUTES.jobsAndApprenticeships,
  ROUTES.careerQuiz,

  ROUTES.employerOverview,
  ROUTES.employerSignIn,
  ROUTES.employerSignUp,
  ROUTES.employerProfileSetup,
  ROUTES.employerDashboard,
  ROUTES.employerProfile,
  ROUTES.employerCreateListing,

  ROUTES.trainingProviderOverview,
  ROUTES.trainingProviderWorkflow,
  ROUTES.trainingProviderProgramData,
  ROUTES.trainingProviderInsights,
])

export function getSafeNextPath(nextPath?: string | null) {
  if (!nextPath) return null

  if (!nextPath.startsWith('/')) return null
  if (nextPath.startsWith('//')) return null

  const pathWithoutQuery = nextPath.split('?')[0].split('#')[0]
  const hash = nextPath.includes('#') ? `#${nextPath.split('#')[1]}` : ''
  const normalizedPath = `${pathWithoutQuery}${hash}`

  if (SAFE_NEXT_PATHS.has(normalizedPath)) {
    return nextPath
  }

  if (SAFE_NEXT_PATHS.has(pathWithoutQuery)) {
    return nextPath
  }

  return null
}

export function getEmployerDestination(hasEmployerProfile: boolean) {
  return hasEmployerProfile
    ? ROUTES.employerDashboard
    : ROUTES.employerProfileSetup
}

export function getProviderDestination() {
  return ROUTES.trainingProviderWorkflow
}

export function getDefaultSeekerDestination() {
  return ROUTES.seekerDashboard
}