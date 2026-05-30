export type PlatformRole =
  | 'public'
  | 'career_seeker'
  | 'training_provider'
  | 'employer'
  | 'admin'

export type RoleFlowItem = {
  href: string
  label: string
  description: string
  role: PlatformRole
  nextHref?: string
  nextLabel?: string
}

export const ROUTES = {
  home: '/',
  dashboard: '/dashboard',

  careerSeeker: '/career-seeker',
  seekerDashboard: '/dashboard',

  providerClaim: '/training-providers/claim',
  providerDashboard: '/training-providers/dashboard',
  providerPrograms: '/training-providers/programs',

  employerSignIn: '/employers/sign-in',
  employerSignUp: '/employers/sign-up',
  employerOnboarding: '/employers/new',
  employerDashboard: '/employers/dashboard',
  employerProfile: '/employers/profile',

  admin: '/admin',

  signIn: '/auth/sign-in',
  signUp: '/auth/sign-up',
  authRedirect: '/auth/redirect',
} as const

const SAFE_INTERNAL_PATH_PATTERN = /^\/(?!\/)/

const BLOCKED_NEXT_PREFIXES = [
  ROUTES.signIn,
  ROUTES.signUp,
  ROUTES.authRedirect,
  ROUTES.employerSignIn,
  ROUTES.employerSignUp,
]

export function getSafeNextPath(nextPath: string | null | undefined) {
  if (!nextPath) return null

  const trimmedPath = nextPath.trim()

  if (!SAFE_INTERNAL_PATH_PATTERN.test(trimmedPath)) {
    return null
  }

  if (BLOCKED_NEXT_PREFIXES.some((prefix) => trimmedPath.startsWith(prefix))) {
    return null
  }

  return trimmedPath
}

export function getDefaultSeekerDestination(nextPath?: string | null) {
  return getSafeNextPath(nextPath) ?? ROUTES.seekerDashboard
}

/**
 * Backward-compatible provider destination helper.
 *
 * Supports both:
 * - getProviderDestination(true | false)
 * - getProviderDestination('/safe-next-path')
 */
export function getProviderDestination(
  hasProviderWorkspaceOrNextPath?: boolean | string | null
) {
  if (typeof hasProviderWorkspaceOrNextPath === 'boolean') {
    return hasProviderWorkspaceOrNextPath
      ? ROUTES.providerDashboard
      : ROUTES.providerClaim
  }

  return getSafeNextPath(hasProviderWorkspaceOrNextPath) ?? ROUTES.providerDashboard
}

/**
 * Backward-compatible employer destination helper.
 *
 * Existing auth code passes a boolean:
 * - true  -> employer dashboard
 * - false -> employer onboarding/profile creation
 *
 * Also supports a safe next path string for future use.
 */
export function getEmployerDestination(
  hasEmployerProfileOrNextPath?: boolean | string | null
) {
  if (typeof hasEmployerProfileOrNextPath === 'boolean') {
    return hasEmployerProfileOrNextPath
      ? ROUTES.employerDashboard
      : ROUTES.employerOnboarding
  }

  return getSafeNextPath(hasEmployerProfileOrNextPath) ?? ROUTES.employerDashboard
}

export const roleFlowItems: RoleFlowItem[] = [
  {
    href: '/',
    label: 'Public home',
    description: 'Introduces the platform and routes users by role.',
    role: 'public',
  },
  {
    href: '/career-seeker',
    label: 'Career seeker entry',
    description: 'Career seeker role path and pathway discovery entry.',
    role: 'career_seeker',
    nextHref: '/programs',
    nextLabel: 'Browse programs',
  },
  {
    href: '/programs',
    label: 'Training program directory',
    description: 'Public program discovery for career seekers.',
    role: 'career_seeker',
    nextHref: '/dashboard/training-programs',
    nextLabel: 'Plan saved programs',
  },
  {
    href: '/opportunities',
    label: 'Jobs and apprenticeships',
    description: 'Public opportunity discovery for career seekers.',
    role: 'career_seeker',
    nextHref: '/dashboard/applications',
    nextLabel: 'Track applications',
  },
  {
    href: '/training-providers/dashboard',
    label: 'Provider dashboard',
    description: 'Provider command center for claims, programs, and updates.',
    role: 'training_provider',
    nextHref: '/training-providers/programs',
    nextLabel: 'Manage programs',
  },
  {
    href: '/training-providers/programs',
    label: 'Provider programs',
    description: 'Provider-owned and connected program workspace.',
    role: 'training_provider',
    nextHref: '/training-providers/programs/new',
    nextLabel: 'Submit program',
  },
  {
    href: '/training-providers/claim',
    label: 'Provider claim',
    description: 'Provider claim and correction request entry point.',
    role: 'training_provider',
  },
  {
    href: '/employers/dashboard',
    label: 'Employer dashboard',
    description: 'Employer workspace for opportunity and application workflows.',
    role: 'employer',
  },
  {
    href: '/employers/new',
    label: 'Employer onboarding',
    description: 'Create the employer profile before accessing employer tools.',
    role: 'employer',
  },
  {
    href: '/admin',
    label: 'Admin command center',
    description: 'Admin operations hub for review queues and platform quality.',
    role: 'admin',
  },
  {
  href: '/admin/system-readiness',
  label: 'System readiness',
  description:
    'Internal checklist for deployment, security, RLS, environment, and operations readiness.',
  role: 'admin',
},
  {
    href: '/admin/program-candidates',
    label: 'Program candidates',
    description: 'Admin review queue for imported program candidates.',
    role: 'admin',
  },
  {
    href: '/admin/provider-claims',
    label: 'Provider claims',
    description: 'Admin review queue for provider access and program claims.',
    role: 'admin',
  },
  {
    href: '/admin/provider-programs',
    label: 'Provider program review',
    description: 'Admin review queue for provider-submitted programs.',
    role: 'admin',
  },
  {
    href: '/admin/program-update-requests',
    label: 'Program update requests',
    description: 'Admin review queue for provider-requested program changes.',
    role: 'admin',
  },
]

export function getRoleFlowItems(role: PlatformRole) {
  return roleFlowItems.filter((item) => item.role === role)
}