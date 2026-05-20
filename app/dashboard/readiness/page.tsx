import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import {
  getCurrentUserReadinessItems,
  getCurrentUserReadinessScore,
} from '@/app/actions/readiness'
import ReadinessPanel from '@/components/dashboard/readiness/ReadinessPanel'

export const metadata: Metadata = {
  title: 'Profile Readiness',
  description:
    'Complete your readiness profile so you can take action on programs and opportunities.',
}

export default async function ReadinessPage() {
  const [items, score] = await Promise.all([
    getCurrentUserReadinessItems(),
    getCurrentUserReadinessScore(),
  ])

  return (
    <main className="page-shell">
      <section className="section-light min-h-screen py-12">
        <div className="section-shell max-w-4xl">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-orange-700 transition hover:text-orange-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>

          <div className="mt-8">
            <p className="eyebrow">Profile readiness</p>

            <h1 className="page-title mt-4">
              Build the profile you need before applying.
            </h1>

            <p className="lead-text mt-5 max-w-3xl">
              Complete your readiness items so you can move from saved programs
              and opportunities into real applications with fewer blockers.
            </p>
          </div>

          <div className="mt-8">
            <ReadinessPanel initialItems={items} initialScore={score} />
          </div>
        </div>
      </section>
    </main>
  )
}