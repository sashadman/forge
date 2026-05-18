import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type PageProps = {
  searchParams?: {
    intent?: string
  }
}

export default async function AuthRedirectPage({ searchParams }: PageProps) {
  const supabase = createClient()
  const intent = searchParams?.intent

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.role === 'admin') {
    redirect('/admin')
  }

  const { data: employer } = await supabase
    .from('employers')
    .select('id')
    .eq('owner_id', user.id)
    .eq('is_active', true)
    .maybeSingle()

  if (employer) {
    redirect('/employers/dashboard')
  }

  if (intent === 'employer') {
    redirect('/employers/new')
  }

  redirect('/dashboard')
}