import type { Metadata } from 'next'
import EmployerAuthForm from '@/components/auth/EmployerAuthForm'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Employer Sign In — ${siteConfig.name}`,
  description: 'Sign in to manage your employer profile.',
}

export default function EmployerSignInPage() {
  return (
    <main className="page-shell flex min-h-screen items-center justify-center px-6 py-16">
      <EmployerAuthForm mode="sign-in" />
    </main>
  )
}