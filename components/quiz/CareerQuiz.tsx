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
import type { QuizAnswer } from '@/types'

export default function CareerQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [savedResult, setSavedResult] = useState<any | null>(null)

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
    const storedResult = window.localStorage.getItem(
      'forge_latest_quiz_result'
    )
    if (!storedResult) return

    try {
      const parsedResult = JSON.parse(storedResult)
      setSavedResult(parsedResult)
     
    } catch (error) {
      console.error('Failed to parse saved quiz result:', error)
    }
  }, [])

  function updateAnswer(optionId: string) {
    const isMulti = currentQuestion.type === 'multi'

    setAnswers((previousAnswers) => {
      const existingAnswer = previousAnswers.find(
        (answer) => answer.question_id === currentQuestion.id
      )

      const currentSelectedOptions = existingAnswer?.selected_options ?? []

      let nextSelectedOptions: string[]

      if (isMulti) {
        const alreadySelected = currentSelectedOptions.includes(optionId)

        nextSelectedOptions = alreadySelected
          ? currentSelectedOptions.filter((id) => id !== optionId)
          : [...currentSelectedOptions, optionId]
      } else {
        nextSelectedOptions = [optionId]
      }

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

function goNext() {
  const currentAnswer = answers.find(
    (answer) => answer.question_id === currentQuestion.id
  )

  const hasSelection =
    currentAnswer && currentAnswer.selected_options.length > 0

  if (!hasSelection) return

  const isLastQuestion =
    currentQuestionIndex === QUIZ_QUESTIONS.length - 1

  if (isLastQuestion) {
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

    setIsComplete(true)
    return
  }

  setCurrentQuestionIndex((index) => index + 1)
}

  function goBack() {
    if (currentQuestionIndex === 0) return

    setCurrentQuestionIndex((index) => index - 1)
  }

  function restartQuiz() {
    window.localStorage.removeItem('forge_latest_quiz_result')
    setCurrentQuestionIndex(0)
    setAnswers([])
    setIsComplete(false)
  }
  if (!isComplete && savedResult) {
    return (
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
                Latest quiz result
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                Welcome back.
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                Forge found trade paths that matched your previous answers.
              </p>
            </div>

            <div className="mt-10 grid gap-6">
              {savedResult.results.map((result: any) => {
                const trade = TRADE_MAP[result.trade]

                return (
                  <div
                    key={result.trade}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
                  >
                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 font-bold text-white">
                            {result.rank}
                          </span>

                          <div>
                            <h3 className="text-2xl font-bold text-slate-950">
                              {trade.name}
                            </h3>

                            <p className="text-slate-600">
                              {trade.tagline}
                            </p>
                          </div>
                        </div>

                        <p className="mt-5 max-w-3xl leading-7 text-slate-600">
                          {trade.description}
                        </p>
                      </div>

                      <div className="min-w-40 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Match score
                        </p>

                        <p className="mt-1 text-3xl font-bold text-orange-600">
                          {result.score}%
                        </p>

                        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Median salary
                        </p>

                        <p className="mt-1 font-bold text-slate-950">
                          {formatSalary(trade.median_salary)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <Link
                        href={`/trades/${trade.slug}`}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                      >
                        View career profile
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>

            <button
              type="button"
              onClick={restartQuiz}
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <RotateCcw className="h-4 w-4" />
              Retake quiz
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (isComplete) {
    return (
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
                Your results
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                These trades may fit your interests.
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                These results are not a final decision. They are a starting point
                to help you explore career paths with more clarity.
              </p>
            </div>

            <div className="mt-10 grid gap-6">
              {results.map((result) => (
                <div
                  key={result.trade}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
                >
                  <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 font-bold text-white">
                          {result.rank}
                        </span>

                        <div>
                          <h3 className="text-2xl font-bold text-slate-950">
                            {result.tradeDetails.name}
                          </h3>
                          <p className="text-slate-600">
                            {result.tradeDetails.tagline}
                          </p>
                        </div>
                      </div>

                      <p className="mt-5 max-w-3xl leading-7 text-slate-600">
                        {result.tradeDetails.description}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {result.tradeDetails.key_skills.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="min-w-40 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Match score
                      </p>
                      <p className="mt-1 text-3xl font-bold text-orange-600">
                        {result.score}%
                      </p>

                      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Median salary
                      </p>
                      <p className="mt-1 font-bold text-slate-950">
                        {formatSalary(result.tradeDetails.median_salary)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href={`/trades/${result.tradeDetails.slug}`}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      View career profile
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                    <Link
                      href="/trades"
                      className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-white"
                    >
                      Compare trades
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={restartQuiz}
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <RotateCcw className="h-4 w-4" />
              Retake quiz
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <div>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
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
              <p className="mt-3 text-slate-600">
                {currentQuestion.subtext}
              </p>
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
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-slate-200 bg-white hover:border-orange-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {option.emoji && (
                      <span className="text-2xl">{option.emoji}</span>
                    )}

                    <span className="font-semibold text-slate-800">
                      {option.text}
                    </span>
                  </div>

                  {isSelected && (
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-orange-600" />
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
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <button
              type="button"
              onClick={goNext}
              disabled={selectedOptions.length === 0}
              className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {currentQuestionIndex === QUIZ_QUESTIONS.length - 1
                ? 'See results'
                : 'Next'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}