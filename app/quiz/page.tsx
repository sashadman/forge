import type { Metadata } from 'next'
import { Compass, GraduationCap } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import BackLink from '@/components/ui/BackLink'
import NextStepPanel from '@/components/ui/NextStepPanel'
import CareerQuiz from '@/components/quiz/CareerQuiz'
import ThemedPublicPage from '@/components/theme/ThemedPublicPage'
import ThemedPublicSection from '@/components/theme/ThemedPublicSection'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Career Quiz — ${siteConfig.name}`,
  description:
    'Take a short skilled-trades career quiz and discover career paths that match your interests, strengths, and goals.',
}

export default function QuizPage() {
  return (
    <ThemedPublicPage>
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <BackLink href="/trades" label="Back to career paths" variant="light" />

          <div className="mt-10 max-w-4xl">
            <p className="eyebrow-dark">Career seeker quiz</p>

            <h1 className="page-title-dark mt-6">
              Find skilled-trades career paths that fit you.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Answer a few questions about your interests, work style, and goals.
              {siteConfig.name} will compare your answers with skilled-trades
              career paths so you can choose a more focused next step.
            </p>
          </div>
        </div>
      </section>

      <ThemedPublicSection className="pb-20">
        <div className="section-shell">
          <div className="pt-8">
            <NextStepPanel
              title="Use the quiz to choose a direction, not to make a final decision."
              description="After the quiz, compare career paths, review training programs, and look at real jobs or apprenticeships connected to the direction that fits you."
              primaryHref="/trades"
              primaryLabel="Compare career paths"
              secondaryHref="/programs"
              secondaryLabel="Compare training programs"
              icon={<Compass className="h-6 w-6" />}
            />
          </div>

          <div className="mt-8">
            <CareerQuiz />
          </div>

          <section className="mt-8 rounded-[2rem] border border-white/10 bg-slate-950 p-8 text-white shadow-xl">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-orange-300 ring-1 ring-white/15">
                <GraduationCap className="h-8 w-8" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-300">
                  After the quiz
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-tight">
                  Turn your result into a practical training or application plan.
                </h2>

                <p className="mt-4 max-w-4xl leading-7 text-slate-300">
                  A career match is only the first step. Use the result to
                  compare training programs, build your readiness profile, and
                  eventually apply to real jobs or apprenticeships.
                </p>
              </div>
            </div>
          </section>
        </div>
      </ThemedPublicSection>

      <SiteFooter />
    </ThemedPublicPage>
  )
}