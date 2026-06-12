'use client'

import { siteConfig } from '@/config/site'
import { FormEvent, type ReactNode, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  LockKeyhole,
  Loader2,
  Mail,
  Map,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type AuthMode = 'sign-in' | 'sign-up'

type AuthFormProps = {
  mode: AuthMode
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const isSignUp = mode === 'sign-up'

  const missionSteps = isSignUp
    ? [
        'Save career paths',
        'Compare training programs',
        'Track jobs and readiness',
      ]
    : ['Open dashboard', 'Resume saved paths', 'Continue next actions']

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setLoading(true)
    setError('')
    setSuccessMessage('')

    try {
      if (isSignUp) {
        const siteUrl =
          process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${siteUrl}/auth/redirect`,
            data: {
              full_name: fullName,
            },
          },
        })

        if (error) {
          console.error(error)
          setError(error.message)
          setLoading(false)
          return
        }

        setSuccessMessage(
          'Account created successfully. Check your email to confirm your account.'
        )

        return
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error(error)
        setError(error.message)
        setLoading(false)
        return
      }

      router.refresh()
      window.location.href = '/auth/redirect'
    } catch (error) {
      console.error(error)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-6xl">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/12 lg:grid lg:min-h-[38rem] lg:grid-cols-[0.92fr_1.08fr]">
        <div
          className="relative overflow-hidden bg-slate-950 p-7 text-white sm:p-9 lg:p-10 xl:p-12"
          style={{
            background:
              'linear-gradient(180deg, rgba(14,165,233,0.18) 0%, transparent 18rem), linear-gradient(135deg, rgba(217,119,6,0.14) 0%, transparent 34rem), linear-gradient(135deg, #0F172A 0%, #172033 52%, #1E293B 100%)',
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
                    {siteConfig.name}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                    Mission access
                  </p>
                </div>
              </div>

              <p
                className="mt-10 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-cyan-100"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {isSignUp ? 'New seeker profile' : 'Returning seeker'}
              </p>

              <h1 className="mt-5 max-w-lg font-display text-4xl font-black leading-tight text-white sm:text-5xl">
                {isSignUp
                  ? 'Build your skilled-trades mission file.'
                  : 'Welcome back to your mission hub.'}
              </h1>

              <p className="mt-5 max-w-lg text-base leading-7 text-slate-200">
                {isSignUp
                  ? 'Create a career-seeker account, save the paths that fit, and move through training, readiness, and job discovery with a clear dashboard.'
                  : 'Sign in to pick up your saved career paths, training programs, applications, and readiness work.'}
              </p>
            </div>

            <div className="mt-10 grid gap-3">
              {missionSteps.map((step, index) => (
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
              Secure access
            </p>

            <h2 className="mt-5 font-display text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
              {isSignUp ? 'Create your account' : 'Sign in to your account'}
            </h2>

            <p className="muted-text mt-3">
              {isSignUp
                ? 'Start with a free career-seeker account. Employers and providers use their own separate access paths.'
                : `Continue your ${siteConfig.name} journey.`}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {isSignUp && (
                <label className="block">
                  <span className="label">Full name</span>

                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      required
                      className="input-field pl-11"
                      placeholder="Your full name"
                    />
                  </div>
                </label>
              )}

              <label className="block">
                <span className="label">Email</span>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    className="input-field pl-11"
                    placeholder="you@example.com"
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
                    required
                    minLength={6}
                    className="input-field pl-11"
                    placeholder={
                      isSignUp ? 'Create a password' : 'Enter your password'
                    }
                  />
                </div>
              </label>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                  {successMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? (
                  'Please wait...'
                ) : (
                  <>
                    {isSignUp ? 'Create account' : 'Sign in'}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <AuthMiniStat icon={<Map />} label="Paths" value="Explore" />
              <AuthMiniStat icon={<BriefcaseBusiness />} label="Jobs" value="Save" />
              <AuthMiniStat icon={<ShieldCheck />} label="Readiness" value="Track" />
            </div>

            <div className="mt-6 text-sm text-slate-600">
              {isSignUp ? (
                <p>
                  Already have an account?{' '}
                  <Link
                    href="/auth/sign-in"
                    className="font-bold text-orange-700 hover:text-orange-800"
                  >
                    Sign in
                  </Link>
                </p>
              ) : (
                <p>
                  Need an account?{' '}
                  <Link
                    href="/auth/sign-up"
                    className="font-bold text-orange-700 hover:text-orange-800"
                  >
                    Create one
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AuthMiniStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center gap-2 text-orange-700">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-100">
          {icon}
        </span>
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
          {label}
        </p>
      </div>
      <p className="mt-2 font-display text-lg font-black text-slate-950">
        {value}
      </p>
    </div>
  )
}
