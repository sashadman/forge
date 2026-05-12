'use client'
import { siteConfig } from '@/config/site'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
          setError(error.message)
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
        setError(error.message)
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      console.error(error)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
          {siteConfig.name}
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
          {isSignUp ? 'Create your account' : 'Welcome back'}
        </h1>

        <p className="mt-3 text-slate-600">
          {isSignUp
            ? 'Start exploring skilled trades and save your career matches.'
            : `Sign in to continue your ${siteConfig.name} journey.`}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {isSignUp && (
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Full name
            </label>

            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-orange-500"
              placeholder="Your full name"
            />
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-orange-500"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-orange-500"
            placeholder="Create a password"
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
          className="w-full rounded-2xl bg-orange-600 px-5 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
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
  )
}