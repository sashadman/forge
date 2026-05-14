import type { Metadata } from 'next'
import EmployerAuthForm from '@/components/auth/EmployerAuthForm'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Employer Sign Up — ${siteConfig.name}`,
  description: 'Create an employer account and build your company profile.',
}

export default function EmployerSignUpPage() {
  return (
    <main className="page-shell flex min-h-screen items-center justify-center px-6 py-16">
      <EmployerAuthForm mode="sign-up" />
    </main>
  )
}