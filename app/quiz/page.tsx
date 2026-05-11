import type { Metadata } from 'next'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import CareerQuiz from '@/components/quiz/CareerQuiz'

export const metadata: Metadata = {
  title: 'Career Quiz — Forge',
  description:
    'Take a short skilled trades career quiz and discover trade paths that match your interests, strengths, and goals.',
}

export default function QuizPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <SiteNavbar />

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
              Career quiz
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-6xl">
              Find the skilled trade that fits you.
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Answer a few questions about your interests, work style, and goals.
              Forge will compare your answers with skilled trade career paths.
            </p>
          </div>
        </div>
      </section>

      <CareerQuiz />

      <SiteFooter />
    </main>
  )
}