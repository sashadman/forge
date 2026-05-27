'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/components/theme/ThemeProvider'

type SaveProgramButtonProps = {
  programId: string
  initiallySaved?: boolean
}

export default function SaveProgramButton({
  programId,
  initiallySaved,
}: SaveProgramButtonProps) {
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
        .from('saved_programs')
        .select('id')
        .eq('user_id', user.id)
        .eq('program_id', programId)
        .maybeSingle()

      if (!isMounted) return

      if (error) {
        console.error('Failed to load saved training program state:', error)
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
  }, [supabase, programId, initiallySaved, hasInitialSavedState])

  async function saveProgram() {
    if (!userId) return

    const { error: savedProgramError } = await supabase
      .from('saved_programs')
      .insert({
        user_id: userId,
        program_id: programId,
      })

    if (savedProgramError && savedProgramError.code !== '23505') {
      throw savedProgramError
    }

    const { error: pipelineError } = await supabase.from('program_pipeline').upsert(
      {
        user_id: userId,
        program_id: programId,
        status: 'saved',
        last_action_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,program_id',
      }
    )

    if (pipelineError) {
      throw pipelineError
    }
  }

  async function removeSavedProgram() {
    if (!userId) return

    const { error: savedProgramError } = await supabase
      .from('saved_programs')
      .delete()
      .eq('user_id', userId)
      .eq('program_id', programId)

    if (savedProgramError) {
      throw savedProgramError
    }

    const { error: pipelineError } = await supabase
      .from('program_pipeline')
      .delete()
      .eq('user_id', userId)
      .eq('program_id', programId)

    if (pipelineError) {
      throw pipelineError
    }
  }

  async function toggleSavedProgram() {
    if (!userId || saving) return

    setSaving(true)
    setError('')

    try {
      if (isSaved) {
        await removeSavedProgram()
        setIsSaved(false)
      } else {
        await saveProgram()
        setIsSaved(true)
      }
    } catch (error) {
      console.error('Failed to update saved training program:', error)
      setError('Could not update saved training program.')
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
        onClick={toggleSavedProgram}
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
            ? 'Saved training program'
            : 'Save training program'}
      </button>

      {error && <p className="mt-2 text-sm font-semibold text-red-600">{error}</p>}
    </div>
  )
}