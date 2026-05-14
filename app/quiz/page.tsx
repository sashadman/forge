import type { Metadata } from 'next'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import CareerQuiz from '@/components/quiz/CareerQuiz'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Career Quiz — ${siteConfig.name}`,
  description:
    'Take a short skilled trades career quiz and discover trade paths that match your interests, strengths, and goals.',
}

export default function QuizPage() {
  return (
    <main className="page-shell">
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <div className="max-w-4xl">
            <p className="eyebrow-dark">Career quiz</p>

            <h1 className="page-title-dark mt-6">
              Find the skilled trade that fits you.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Answer a few questions about your interests, work style, and goals.
              {siteConfig.name} will compare your answers with skilled trade career paths.
            </p>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="-mt-12">
            <CareerQuiz />
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}