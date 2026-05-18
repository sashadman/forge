import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AuthRedirectPage() {
  const supabase = createClient()

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

  const { data: employer } = await supabase//Does this user own an active employer profile?
    .from('employers')//The role check is only a fallback if later we manually mark someone as employer but they have not created a profile yet
    .select('id')
    .eq('owner_id', user.id)
    .eq('is_active', true)
    .maybeSingle()

  if (employer) {
    redirect('/employers/dashboard')
  }

  if (profile?.role === 'employer') {
    redirect('/employers/new')
  }

  redirect('/dashboard')
}