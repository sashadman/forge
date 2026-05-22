'use client'

import Link from 'next/link'
import { useState } from 'react'
import { BriefcaseBusiness, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getEmployerDestination } from '@/lib/role-flow'

type EmployerAuthFormProps = {
  mode: 'sign-in' | 'sign-up'
}

export default function EmployerAuthForm({ mode }: EmployerAuthFormProps) {
  const supabase = createClient()
  const isSignUp = mode === 'sign-up'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [organizationName, setOrganizationName] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)

  async function userHasEmployerProfile(userId: string) {
    const { data: employer, error: employerError } = await supabase
      .from('employers')
      .select('id')
      .eq('owner_id', userId)
      .maybeSingle()

    if (employerError) {
      console.error('Failed to check employer profile:', employerError)
      throw new Error('Could not check employer profile.')
    }

    return Boolean(employer)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError('')
    setNotice('')
    setLoading(true)

    try {
      if (isSignUp) {
        const redirectTo = `${window.location.origin}/auth/redirect?intent=employer`

        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectTo,
            data: {
              full_name: fullName,
              organization_name: organizationName,
              signup_intent: 'employer',
            },
          },
        })

        if (signUpError) {
          throw signUpError
        }

        if (!data.user || !data.session) {
          setNotice(
            'Check your email to confirm your employer account. After confirmation, you will continue to employer profile setup.'
          )
          setLoading(false)
          return
        }

        const hasEmployerProfile = await userHasEmployerProfile(data.user.id)
        window.location.href = getEmployerDestination(hasEmployerProfile)
        return
      }

      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        })

      if (signInError) {
        throw signInError
      }

      if (!data.user) {
        throw new Error('Could not load employer account.')
      }

      const hasEmployerProfile = await userHasEmployerProfile(data.user.id)
      window.location.href = getEmployerDestination(hasEmployerProfile)
    } catch (caughtError) {
      console.error('Employer auth error:', caughtError)
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Something went wrong. Please try again.'
      )
      setLoading(false)
    }
  }

  return (
    <section className="section-light min-h-[calc(100vh-5rem)] py-16">
      <div className="section-shell">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="content-panel">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
              <BriefcaseBusiness className="h-7 w-7" />
            </div>

            <p className="eyebrow mt-8">Employer access</p>

            <h1 className="section-title mt-4">
              {isSignUp
                ? 'Create your employer account.'
                : 'Sign in to your employer account.'}
            </h1>

            <p className="lead-text mt-5">
              {isSignUp
                ? 'Start with employer access, then complete your employer profile before creating listings or reviewing applicants.'
                : 'Sign in to continue to your employer workspace.'}
            </p>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-950">
                Correct employer flow
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Employer account → employer profile → employer dashboard →
                listings and applicants.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="card p-8">
            <h2 className="text-2xl font-bold text-slate-950">
              {isSignUp ? 'Create employer account' : 'Employer sign in'}
            </h2>

            <p className="mt-2 text-slate-600">
              {isSignUp
                ? 'Use a work email connected to the organization you will manage.'
                : 'Use the email connected to your employer account.'}
            </p>

            <div className="mt-8 grid gap-5">
              {isSignUp && (
                <>
                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-slate-700">
                      Your name
                    </span>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      className="input-field"
                      placeholder="Jane Smith"
                      required
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-slate-700">
                      Organization name
                    </span>
                    <input
                      type="text"
                      value={organizationName}
                      onChange={(event) =>
                        setOrganizationName(event.target.value)
                      }
                      className="input-field"
                      placeholder="Example Electric"
                      required
                    />
                  </label>
                </>
              )}

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">
                  Email
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="input-field"
                  placeholder="you@company.com"
                  required
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">
                  Password
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="input-field"
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                />
              </label>
            </div>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            {notice && (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                {notice}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-8 w-full px-6 py-4 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSignUp ? 'Create employer account' : 'Sign in to employer workspace'}
            </button>

            <div className="mt-6 text-center text-sm text-slate-600">
              {isSignUp ? (
                <>
                  Already have an employer account?{' '}
                  <Link
                    href="/employers/sign-in"
                    className="font-semibold text-orange-700 hover:text-orange-800"
                  >
                    Sign in
                  </Link>
                </>
              ) : (
                <>
                  Need an employer account?{' '}
                  <Link
                    href="/employers/sign-up"
                    className="font-semibold text-orange-700 hover:text-orange-800"
                  >
                    Create one
                  </Link>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}