'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react'
import {
  calculateQuizResults,
  QUIZ_QUESTIONS,
  TRADE_MAP,
  formatSalary,
} from '@/utils/trades'
import type { QuizAnswer, TradeCategory } from '@/types'
import type { Json } from '@/lib/supabase/types'
import { createClient } from '@/lib/supabase/client'

type QuizResultItem = {
  trade: TradeCategory
  score: number
  rank: number
}

type SavedQuizResult = {
  completedAt: string
  answers: QuizAnswer[]
  results: QuizResultItem[]
}

export default function CareerQuiz() {
  const supabase = useMemo(() => createClient(), [])

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [savedResult, setSavedResult] = useState<SavedQuizResult | null>(null)
  const [hasLoadedSavedResult, setHasLoadedSavedResult] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [savingSavedResult, setSavingSavedResult] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [saveError, setSaveError] = useState('')

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex]
  const currentAnswer = answers.find(
    (answer) => answer.question_id === currentQuestion.id
  )
  const selectedOptions = currentAnswer?.selected_options ?? []
  const progressPercentage =
    ((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100

  const results = useMemo(() => {
    if (!isComplete) return []

    return calculateQuizResults(answers).map((result) => ({
      ...result,
      tradeDetails: TRADE_MAP[result.trade],
    }))
  }, [answers, isComplete])

  useEffect(() => {
    async function loadQuizState() {
      if (typeof window === 'undefined') return

      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUserId(user?.id ?? null)

      const storedResult = window.localStorage.getItem('forge_latest_quiz_result')

      if (!storedResult) {
        setHasLoadedSavedResult(true)
        return
      }

      try {
        const parsedResult = JSON.parse(storedResult) as SavedQuizResult
        setSavedResult(parsedResult)
      } catch (error) {
        console.error('Failed to parse saved quiz result:', error)
        window.localStorage.removeItem('forge_latest_quiz_result')
      } finally {
        setHasLoadedSavedResult(true)
      }
    }

    loadQuizState()
  }, [supabase])

  function updateAnswer(optionId: string) {
    const isMulti = currentQuestion.type === 'multi'

    setAnswers((previousAnswers) => {
      const existingAnswer = previousAnswers.find(
        (answer) => answer.question_id === currentQuestion.id
      )

      const currentSelectedOptions = existingAnswer?.selected_options ?? []

      const nextSelectedOptions = isMulti
        ? currentSelectedOptions.includes(optionId)
          ? currentSelectedOptions.filter((id) => id !== optionId)
          : [...currentSelectedOptions, optionId]
        : [optionId]

      if (existingAnswer) {
        return previousAnswers.map((answer) =>
          answer.question_id === currentQuestion.id
            ? { ...answer, selected_options: nextSelectedOptions }
            : answer
        )
      }

      return [
        ...previousAnswers,
        {
          question_id: currentQuestion.id,
          selected_options: nextSelectedOptions,
        },
      ]
    })
  }

  async function goNext() {
    const currentAnswer = answers.find(
      (answer) => answer.question_id === currentQuestion.id
    )

    const hasSelection =
      currentAnswer && currentAnswer.selected_options.length > 0

    if (!hasSelection) return

    const isLastQuestion = currentQuestionIndex === QUIZ_QUESTIONS.length - 1

    if (!isLastQuestion) {
      setCurrentQuestionIndex((index) => index + 1)
      return
    }

    const calculatedResults = calculateQuizResults(answers)

    const resultToSave = {
      completedAt: new Date().toISOString(),
      answers,
      results: calculatedResults,
    }

    window.localStorage.setItem(
      'forge_latest_quiz_result',
      JSON.stringify(resultToSave)
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { error } = await supabase.from('quiz_results').insert({
        user_id: user.id,
        answers: answers as unknown as Json,
        results: calculatedResults as unknown as Json,
        completed_at: resultToSave.completedAt,
      })

      if (error) {
        console.error('Failed to save quiz result to Supabase:', error)
      } else {
        await supabase
          .from('profiles')
          .update({ quiz_completed: true })
          .eq('id', user.id)
      }
    }

    setIsComplete(true)
  }

  function goBack() {
    if (currentQuestionIndex === 0) return
    setCurrentQuestionIndex((index) => index - 1)
  }

  async function saveDeviceResultToDashboard() {
    if (!userId || !savedResult) return

    setSavingSavedResult(true)
    setSaveMessage('')
    setSaveError('')

    const { error } = await supabase.from('quiz_results').insert({
      user_id: userId,
      answers: savedResult.answers as unknown as Json,
      results: savedResult.results as unknown as Json,
      completed_at: savedResult.completedAt,
    })

    if (error) {
      console.error('Failed to save device quiz result:', error)
      setSaveError('Could not save this result. Please try again.')
      setSavingSavedResult(false)
      return
    }

    await supabase
      .from('profiles')
      .update({ quiz_completed: true })
      .eq('id', userId)

    setSaveMessage('Quiz result saved to your dashboard.')
    setSavingSavedResult(false)
  }

  function restartQuiz() {
    window.localStorage.removeItem('forge_latest_quiz_result')
    setSavedResult(null)
    setCurrentQuestionIndex(0)
    setAnswers([])
    setIsComplete(false)
    setSaveMessage('')
    setSaveError('')
  }

  if (!hasLoadedSavedResult) {
    return (
      <div className="content-panel">
        <p className="eyebrow">Career quiz</p>

        <h2 className="section-title mt-3">Loading your quiz...</h2>

        <p className="muted-text mt-4">
          Checking whether you already have a saved result.
        </p>
      </div>
    )
  }

  if (!isComplete && savedResult) {
    return (
      <div className="content-panel">
        <div className="max-w-3xl">
          <p className="eyebrow">Latest quiz result</p>

          <h2 className="section-title mt-3">
            You have a recent quiz result on this device.
          </h2>

          <p className="muted-text mt-4">
            Your previous answers matched with several career paths. Sign in or
            create an account to save future results to your dashboard.
          </p>
        </div>

        <div className="mt-10 grid gap-6">
          {savedResult.results.map((result) => {
            const trade = TRADE_MAP[result.trade]

            return (
              <ResultCard
                key={result.trade}
                rank={result.rank}
                score={result.score}
                tradeName={trade.name}
                tagline={trade.tagline}
                description={trade.description}
                salary={formatSalary(trade.median_salary)}
                tradeSlug={trade.slug}
              />
            )
          })}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={restartQuiz} className="btn-outline">
            <RotateCcw className="h-4 w-4" />
            Retake quiz
          </button>

          {userId ? (
            <button
              type="button"
              onClick={saveDeviceResultToDashboard}
              disabled={savingSavedResult}
              className="btn-primary"
            >
              {savingSavedResult ? 'Saving result...' : 'Save result to dashboard'}
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <Link href="/auth/sign-up" className="btn-primary">
              Create account to save results
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {saveMessage && (
          <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
            {saveMessage}
          </div>
        )}

        {saveError && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {saveError}
          </div>
        )}
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className="content-panel">
        <div className="max-w-3xl">
          <p className="eyebrow">Your results</p>

          <h2 className="section-title mt-3">
            These career paths may fit your interests.
          </h2>

          <p className="muted-text mt-4">
            These results are not a final decision. They are a starting point to
            help you explore career paths with more clarity.
          </p>
        </div>

        <div className="mt-10 grid gap-6">
          {results.map((result) => (
            <ResultCard
              key={result.trade}
              rank={result.rank}
              score={result.score}
              tradeName={result.tradeDetails.name}
              tagline={result.tradeDetails.tagline}
              description={result.tradeDetails.description}
              salary={formatSalary(result.tradeDetails.median_salary)}
              tradeSlug={result.tradeDetails.slug}
              skills={result.tradeDetails.key_skills.slice(0, 4)}
              showCompare
            />
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={restartQuiz} className="btn-outline">
            <RotateCcw className="h-4 w-4" />
            Retake quiz
          </button>

          <Link href="/auth/sign-up" className="btn-primary">
            Create account to save results
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="content-panel">
      <div>
        <div className="flex items-center justify-between gap-4">
          <p className="eyebrow">
            Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}
          </p>

          <p className="text-sm font-medium text-slate-500">
            {Math.round(progressPercentage)}%
          </p>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-orange-600 transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-3xl font-bold tracking-tight text-slate-950">
          {currentQuestion.text}
        </h2>

        {currentQuestion.subtext && (
          <p className="muted-text mt-3">{currentQuestion.subtext}</p>
        )}

        {currentQuestion.type === 'multi' && (
          <p className="mt-4 text-sm font-medium text-slate-500">
            You can choose more than one.
          </p>
        )}
      </div>

      <div className="mt-8 grid gap-4">
        {currentQuestion.options.map((option) => {
          const isSelected = selectedOptions.includes(option.id)

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => updateAnswer(option.id)}
              className={`flex items-center justify-between gap-4 rounded-2xl border p-5 text-left transition ${
                isSelected
                  ? 'border-orange-500 bg-orange-50 ring-4 ring-orange-100'
                  : 'border-slate-200 bg-white hover:border-orange-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-4">
                {option.emoji && <span className="text-2xl">{option.emoji}</span>}

                <span className="font-semibold text-slate-800">
                  {option.text}
                </span>
              </div>

              {isSelected && (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-orange-600" />
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-10 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={goBack}
          disabled={currentQuestionIndex === 0}
          className="btn-outline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <button
          type="button"
          onClick={goNext}
          disabled={selectedOptions.length === 0}
          className="btn-primary"
        >
          {currentQuestionIndex === QUIZ_QUESTIONS.length - 1
            ? 'See results'
            : 'Next'}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function ResultCard({
  rank,
  score,
  tradeName,
  tagline,
  description,
  salary,
  tradeSlug,
  skills = [],
  showCompare = false,
}: {
  rank: number
  score: number
  tradeName: string
  tagline: string
  description: string
  salary: string
  tradeSlug: string
  skills?: string[]
  showCompare?: boolean
}) {
  return (
    <div className="card-soft">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 font-bold text-white">
              {rank}
            </span>

            <div>
              <h3 className="text-2xl font-bold text-slate-950">{tradeName}</h3>
              <p className="text-slate-600">{tagline}</p>
            </div>
          </div>

          <p className="muted-text mt-5 max-w-3xl">{description}</p>

          {skills.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill} className="badge-slate bg-white">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mini-card-white min-w-40">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Match score
          </p>

          <p className="mt-1 text-3xl font-bold text-orange-600">{score}%</p>

          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Median salary
          </p>

          <p className="mt-1 font-bold text-slate-950">{salary}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link href={`/trades/${tradeSlug}`} className="btn-dark">
          View career profile
          <ArrowRight className="h-4 w-4" />
        </Link>

        {showCompare && (
          <Link href="/trades" className="btn-outline">
            Compare career paths
          </Link>
        )}
      </div>
    </div>
  )
}