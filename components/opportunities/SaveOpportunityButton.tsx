'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type SaveOpportunityButtonProps = {
  opportunityId: string
  initiallySaved?: boolean
}

export default function SaveOpportunityButton({
  opportunityId,
  initiallySaved,
}: SaveOpportunityButtonProps) {
  const supabase = useMemo(() => createClient(), [])

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
        console.error('Failed to load saved opportunity state:', error)
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
      console.error('Failed to update saved opportunity:', error)
      setError('Could not update saved opportunity.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <button
        type="button"
        disabled
        className="btn-outline w-full px-6 py-4 text-slate-400"
      >
        Checking...
      </button>
    )
  }

  if (!userId) {
    return (
      <Link href="/auth/sign-in" className="btn-outline w-full px-6 py-4">
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
        className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
          isSaved
            ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
            : 'border border-slate-300 text-slate-800 hover:bg-slate-100'
        }`}
      >
        {isSaved ? (
          <BookmarkCheck className="h-4 w-4" />
        ) : (
          <Bookmark className="h-4 w-4" />
        )}

        {saving
          ? 'Saving...'
          : isSaved
            ? 'Saved opportunity'
            : 'Save opportunity'}
      </button>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}