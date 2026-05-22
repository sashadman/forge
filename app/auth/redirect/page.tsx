import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  getDefaultSeekerDestination,
  getEmployerDestination,
  getProviderDestination,
  getSafeNextPath,
  ROUTES,
} from '@/lib/role-flow'

type AuthRedirectPageProps = {
  searchParams: {
    code?: string
    intent?: string
    next?: string
  }
}

async function userHasEmployerProfile(userId: string) {
  const supabase = createClient()

  const { data: employer, error } = await supabase
    .from('employers')
    .select('id')
    .eq('owner_id', userId)
    .maybeSingle()

  if (error) {
    console.error('Failed to resolve employer redirect:', error)
    return false
  }

  return Boolean(employer)
}

export default async function AuthRedirectPage({
  searchParams,
}: AuthRedirectPageProps) {
  const supabase = createClient()

  if (searchParams.code) {
    const { error } = await supabase.auth.exchangeCodeForSession(
      searchParams.code
    )

    if (error) {
      console.error('Failed to exchange auth code:', error)
      redirect(ROUTES.employerSignIn)
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  const safeNextPath = getSafeNextPath(searchParams.next)

  if (searchParams.intent === 'employer') {
    const hasEmployerProfile = await userHasEmployerProfile(user.id)
    redirect(getEmployerDestination(hasEmployerProfile))
  }

  if (searchParams.intent === 'provider') {
    redirect(getProviderDestination())
  }

  if (safeNextPath) {
    redirect(safeNextPath)
  }

  redirect(getDefaultSeekerDestination())
}