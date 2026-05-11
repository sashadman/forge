import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function QuizCTA() {
  return (
    <section className="bg-orange-50 py-20">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Not sure which trade fits you?
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          Take a short career quiz and get matched with trade paths based on your interests,
          strengths, and goals.
        </p>

        <Link
          href="/quiz"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700"
        >
          Take the quiz
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}