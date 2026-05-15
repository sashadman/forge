'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { Building2, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { siteConfig } from '@/config/site'

type AuthMode = 'sign-in' | 'sign-up'

type EmployerAuthFormProps = {
  mode: AuthMode
}

export default function EmployerAuthForm({ mode }: EmployerAuthFormProps) {
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
        'Employer account created. Check your email to confirm your account, then sign in to create your employer profile.'
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

    window.location.href = '/employers/dashboard'
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
                <Building2 className="h-6 w-6" />
              </div>

              <p className="eyebrow-dark mt-8">Employer portal</p>

              <h1 className="mt-6 text-4xl font-bold tracking-tight">
                {isSignUp
                  ? 'Create your employer account.'
                  : 'Sign in as an employer.'}
              </h1>

              <p className="lead-text-dark mt-5">
                {isSignUp
                  ? 'Build a real employer profile, connect your website and social links, and prepare to list real skilled-trades opportunities.'
                  : 'Manage your employer profile and future opportunity listings.'}
              </p>
            </div>

            <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
              <p className="font-bold text-white">Separate from job seekers</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                This portal is for employers, contractors, companies, and workforce partners.
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <div>
            <p className="eyebrow">Employer portal</p>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              {isSignUp ? 'Create employer account' : 'Employer sign in'}
            </h1>

            <p className="muted-text mt-3">
              {isSignUp
                ? `Create an employer account for ${siteConfig.name}.`
                : 'Sign in to continue to your employer profile.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {isSignUp && (
              <div>
                <label className="label">Your name</label>

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
              <label className="label">Work email</label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="input-field"
                placeholder="you@company.com"
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
                ? 'Create employer account'
                : 'Sign in to employer portal'}
            </button>
          </form>

          <div className="mt-6 text-sm text-slate-600">
            {isSignUp ? (
              <p>
                Already have an employer account?{' '}
                <Link
                  href="/employers/sign-in"
                  className="font-semibold text-orange-600 hover:text-orange-700"
                >
                  Sign in
                </Link>
              </p>
            ) : (
              <p>
                Need an employer account?{' '}
                <Link
                  href="/employers/sign-up"
                  className="font-semibold text-orange-600 hover:text-orange-700"
                >
                  Create one
                </Link>
              </p>
            )}
          </div>

          <div className="mt-6 border-t border-slate-200 pt-6 text-sm text-slate-500">
            Looking for a trade career?{' '}
            <Link
              href="/auth/sign-in"
              className="font-semibold text-slate-700 hover:text-slate-950"
            >
              Use job seeker sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}