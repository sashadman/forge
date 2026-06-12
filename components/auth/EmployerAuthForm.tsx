'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  LockKeyhole,
  Loader2,
  Mail,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getEmployerDestination } from '@/lib/role-flow'
import { siteConfig } from '@/config/site'

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
        const siteUrl =
          process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin

        const redirectTo = `${siteUrl}/auth/redirect?intent=employer`

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
    <section className="w-full py-8">
      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/12 lg:grid lg:min-h-[38rem] lg:grid-cols-[0.9fr_1.1fr]">
        <div
          className="relative overflow-hidden bg-slate-950 p-7 text-white sm:p-9 lg:p-10 xl:p-12"
          style={{
            background:
              'linear-gradient(180deg, rgba(217,119,6,0.16) 0%, transparent 18rem), linear-gradient(135deg, rgba(14,165,233,0.16) 0%, transparent 34rem), linear-gradient(135deg, #0F172A 0%, #172033 52%, #1E293B 100%)',
          }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.045),rgba(255,255,255,0.045)_1px,transparent_1px,transparent_8px)]" />

          <div className="relative flex h-full flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-white shadow-lg shadow-black/20">
                  <Image
                    src="/AraSkills-Logo.png"
                    alt={`${siteConfig.name} logo`}
                    width={48}
                    height={48}
                    className="h-full w-full object-contain"
                    priority
                  />
                </div>

                <div>
                  <p className="font-display text-lg font-black text-white">
                    Employer access
                  </p>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-200">
                    Hiring workspace
                  </p>
                </div>
              </div>

              <p className="mt-10 inline-flex items-center gap-2 rounded-full border border-orange-300/25 bg-orange-400/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-orange-100">
                <BriefcaseBusiness className="h-3.5 w-3.5" />
                {isSignUp ? 'New employer profile' : 'Returning employer'}
              </p>

              <h1 className="mt-5 max-w-lg font-display text-4xl font-black leading-tight text-white sm:text-5xl">
                {isSignUp
                  ? 'Create a clean hiring command center.'
                  : 'Return to your hiring workspace.'}
              </h1>

              <p className="mt-5 max-w-lg text-base leading-7 text-slate-200">
                {isSignUp
                  ? 'Employer accounts stay separate from seeker dashboards, so profiles, listings, and applicants remain attached to the right organization.'
                  : 'Manage your employer profile, reviewed listings, and applicant workflow from one focused place.'}
              </p>
            </div>

            <div className="mt-10 grid gap-3">
              {[
                'Create employer account',
                'Build company profile',
                'Post reviewed opportunities',
              ].map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/10 p-3 backdrop-blur"
                >
                  <span className="font-mono text-xs font-bold text-orange-200">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <CheckCircle2 className="h-4 w-4 text-cyan-200" />
                  <span className="text-sm font-semibold text-slate-100">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-7 sm:p-10 lg:p-12">
          <div className="mx-auto max-w-xl">
            <p className="eyebrow">
              <ShieldCheck className="h-3.5 w-3.5" />
              Organization access
            </p>

            <h2 className="mt-5 font-display text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
              {isSignUp ? 'Create employer account' : 'Employer sign in'}
            </h2>

            <p className="muted-text mt-3">
              {isSignUp
                ? 'Use a work email connected to the organization you will manage.'
                : 'Use the email connected to your employer account.'}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {isSignUp && (
                <>
                  <label className="block">
                    <span className="label">Your name</span>
                    <div className="relative">
                      <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        className="input-field pl-11"
                        placeholder="Jane Smith"
                        required
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="label">Organization name</span>
                    <div className="relative">
                      <Building2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={organizationName}
                        onChange={(event) =>
                          setOrganizationName(event.target.value)
                        }
                        className="input-field pl-11"
                        placeholder="Example Electric"
                        required
                      />
                    </div>
                  </label>
                </>
              )}

              <label className="block">
                <span className="label">Email</span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="input-field pl-11"
                    placeholder="you@company.com"
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="label">Password</span>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="input-field pl-11"
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                  />
                </div>
              </label>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              {notice && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                  {notice}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full px-6 py-4 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? (
                  'Please wait...'
                ) : (
                  <>
                    {isSignUp
                      ? 'Create employer account'
                      : 'Sign in to employer workspace'}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-600">
              {isSignUp ? (
                <>
                  Already have an employer account?{' '}
                  <Link
                    href="/employers/sign-in"
                    className="font-bold text-orange-700 hover:text-orange-800"
                  >
                    Sign in
                  </Link>
                </>
              ) : (
                <>
                  Need an employer account?{' '}
                  <Link
                    href="/employers/sign-up"
                    className="font-bold text-orange-700 hover:text-orange-800"
                  >
                    Create one
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
