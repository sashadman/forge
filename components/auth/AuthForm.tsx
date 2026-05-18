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
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
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
    <div className="w-full max-w-5xl">
      <div className="grid overflow-hidden rounded-[2.25rem] border border-white/70 bg-white shadow-2xl shadow-slate-900/10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.28),transparent_28rem)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14),transparent_24rem)]" />

          <div className="relative flex h-full flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-600 text-white">
                <Hammer className="h-6 w-6" />
              </div>

              <p className="eyebrow-dark mt-8">{siteConfig.name}</p>

              <h1 className="mt-6 text-4xl font-bold tracking-tight">
                {isSignUp ? 'Start building your trade path.' : 'Welcome back.'}
              </h1>

              <p className="lead-text-dark mt-5">
                {isSignUp
                  ? 'Create an account to save trades, programs, and build your skilled-trades roadmap.'
                  : 'Sign in to continue exploring trades, programs, and your saved career path.'}
              </p>
            </div>

            <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
              <p className="font-bold text-white">Marketplace progress</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Discover trades, compare real pathways, save what matters, and prepare for future opportunities.
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <div>
            <p className="eyebrow">{siteConfig.name}</p>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              {isSignUp ? 'Create your account' : 'Sign in to your account'}
            </h1>

            <p className="muted-text mt-3">
              {isSignUp
                ? 'Start exploring skilled trades and save your career matches.'
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