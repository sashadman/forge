'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/components/theme/ThemeProvider'

type SaveOpportunityButtonProps = {
  opportunityId: string
  initiallySaved?: boolean
}

export default function SaveOpportunityButton({
  opportunityId,
  initiallySaved,
}: SaveOpportunityButtonProps) {
  const supabase = useMemo(() => createClient(), [])
  const { isLight } = useTheme()

  const hasInitialSavedState = typeof initiallySaved === 'boolean'

  const [userId, setUserId] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(initiallySaved ?? false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadSavedState() {
      setLoading(true)
      setError('')

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!isMounted) return

      if (!user) {
        setUserId(null)
        setIsSaved(false)
        setLoading(false)
        return
      }

      setUserId(user.id)

      if (hasInitialSavedState) {
        setIsSaved(initiallySaved)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('saved_opportunities')
        .select('id')
        .eq('user_id', user.id)
        .eq('opportunity_id', opportunityId)
        .maybeSingle()

      if (!isMounted) return

      if (error) {
        console.error('Failed to load saved job or apprenticeship state:', error)
        setError('Could not check saved status.')
        setLoading(false)
        return
      }

      setIsSaved(Boolean(data))
      setLoading(false)
    }

    loadSavedState()

    return () => {
      isMounted = false
    }
  }, [supabase, opportunityId, initiallySaved, hasInitialSavedState])

  async function saveOpportunity() {
    if (!userId) return

    const { error: savedOpportunityError } = await supabase
      .from('saved_opportunities')
      .insert({
        user_id: userId,
        opportunity_id: opportunityId,
      })

    if (savedOpportunityError && savedOpportunityError.code !== '23505') {
      throw savedOpportunityError
    }

    const { error: pipelineError } = await supabase
      .from('opportunity_pipeline')
      .upsert(
        {
          user_id: userId,
          opportunity_id: opportunityId,
          status: 'saved',
          last_action_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,opportunity_id',
        }
      )

    if (pipelineError) {
      throw pipelineError
    }
  }

  async function removeSavedOpportunity() {
    if (!userId) return

    const { error: savedOpportunityError } = await supabase
      .from('saved_opportunities')
      .delete()
      .eq('user_id', userId)
      .eq('opportunity_id', opportunityId)

    if (savedOpportunityError) {
      throw savedOpportunityError
    }

    const { error: pipelineError } = await supabase
      .from('opportunity_pipeline')
      .delete()
      .eq('user_id', userId)
      .eq('opportunity_id', opportunityId)

    if (pipelineError) {
      throw pipelineError
    }
  }

  async function toggleSavedOpportunity() {
    if (!userId || saving) return

    setSaving(true)
    setError('')

    try {
      if (isSaved) {
        await removeSavedOpportunity()
        setIsSaved(false)
      } else {
        await saveOpportunity()
        setIsSaved(true)
      }
    } catch (error) {
      console.error('Failed to update saved job or apprenticeship:', error)
      setError('Could not update saved job or apprenticeship.')
    } finally {
      setSaving(false)
    }
  }

  const neutralButtonClass = isLight
    ? 'inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 px-6 py-4 font-semibold text-slate-800 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60'
    : 'inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 py-4 font-semibold text-white transition hover:border-cyan-300/40 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60'

  const savedButtonClass = isLight
    ? 'inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-100 px-6 py-4 font-semibold text-orange-700 transition hover:bg-orange-200 disabled:cursor-not-allowed disabled:opacity-60'
    : 'inline-flex w-full items-center justify-center gap-2 rounded-full border border-orange-300/30 bg-orange-500/15 px-6 py-4 font-semibold text-orange-200 transition hover:bg-orange-500/20 disabled:cursor-not-allowed disabled:opacity-60'

  if (loading) {
    return (
      <button type="button" disabled className={neutralButtonClass}>
        Checking...
      </button>
    )
  }

  if (!userId) {
    return (
      <Link href="/auth/sign-in" className={neutralButtonClass}>
        <Bookmark className="h-4 w-4" />
        Sign in to save
      </Link>
    )
  }

  return (
    <div>
      <button
        type="button"
        onClick={toggleSavedOpportunity}
        disabled={saving}
        aria-pressed={isSaved}
        className={isSaved ? savedButtonClass : neutralButtonClass}
      >
        {isSaved ? (
          <BookmarkCheck className="h-4 w-4" />
        ) : (
          <Bookmark className="h-4 w-4" />
        )}

        {saving
          ? 'Saving...'
          : isSaved
            ? 'Saved job or apprenticeship'
            : 'Save job or apprenticeship'}
      </button>

      {error && <p className="mt-2 text-sm font-semibold text-red-600">{error}</p>}
    </div>
  )
}