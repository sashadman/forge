'use client'

import { siteConfig } from '@/config/site'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Hammer, Loader2 } from 'lucide-react'
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
      <div className="grid min-h-[34rem] overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 lg:grid-cols-[1.05fr_1fr]">
        <div
          className="relative hidden overflow-hidden p-10 text-white lg:block xl:p-12"
          style={{
            background:
              'linear-gradient(135deg, #0F172A 0%, #172033 52%, #1E293B 100%)',
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,119,6,0.18),transparent_26rem)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_24rem)]" />

          <div className="relative flex h-full flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-white" style={{ background: '#D97706' }}>
                <Hammer className="h-6 w-6" />
              </div>

              <p
                className="mt-8 inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.12em]"
                style={{
                  borderColor: 'rgba(217,119,6,0.45)',
                  background: 'rgba(217,119,6,0.18)',
                  color: '#FDBA74',
                }}
              >
                {siteConfig.name}
              </p>

              <h1 className="mt-5 max-w-md text-4xl font-bold leading-tight tracking-tight text-white">
                {isSignUp ? 'Start building your trade path.' : 'Welcome back.'}
              </h1>

              <p className="mt-5 max-w-md text-base leading-7 text-slate-200">
                {isSignUp
                  ? 'Create an account to save career paths, training programs, and build your skilled-trades roadmap.'
                  : 'Sign in to continue exploring career paths, training programs, and your saved career path.'}
              </p>
            </div>

            <div className="mt-10 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
              <p className="font-bold text-white">Marketplace progress</p>
              <p className="mt-2 text-sm leading-6 text-slate-200">
                Discover career paths, compare training programs, save what matters, and prepare for real jobs or apprenticeships.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center p-7 sm:p-10 lg:p-12">
          <div className="w-full">
            <p className="eyebrow">{siteConfig.name}</p>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              {isSignUp ? 'Create your account' : 'Sign in to your account'}
            </h1>

            <p className="muted-text mt-3">
              {isSignUp
                ? 'Start comparing career paths and save your matches.'
                : `Continue your ${siteConfig.name} journey.`}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {isSignUp && (
              <div>
                <label className="label">Full name</label>

                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  required
                  className="input-field"
                  placeholder="Your full name"
                />
              </div>
            )}

            <div>
              <label className="label">Email</label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="input-field"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="label">Password</label>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={6}
                className="input-field"
                placeholder={isSignUp ? 'Create a password' : 'Enter your password'}
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full rounded-2xl py-4"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading
                ? 'Please wait...'
                : isSignUp
                ? 'Create account'
                : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 text-sm text-slate-600">
            {isSignUp ? (
              <p>
                Already have an account?{' '}
                <Link
                  href="/auth/sign-in"
                  className="font-semibold text-orange-600 hover:text-orange-700"
                >
                  Sign in
                </Link>
              </p>
            ) : (
              <p>
                Need an account?{' '}
                <Link
                  href="/auth/sign-up"
                  className="font-semibold text-orange-600 hover:text-orange-700"
                >
                  Create one
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
