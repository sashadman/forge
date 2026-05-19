'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type SaveProgramButtonProps = {
  programId: string
  initiallySaved?: boolean
}

export default function SaveProgramButton({
  programId,
  initiallySaved,
}: SaveProgramButtonProps) {
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
        .from('saved_programs')
        .select('id')
        .eq('user_id', user.id)
        .eq('program_id', programId)
        .maybeSingle()

      if (!isMounted) return

      if (error) {
        console.error('Failed to load saved program state:', error)
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

  async function toggleSavedProgram() {
    if (!userId || saving) return

    setSaving(true)
    setError('')

    if (isSaved) {
      const { error } = await supabase
        .from('saved_programs')
        .delete()
        .eq('user_id', userId)
        .eq('program_id', programId)

      if (error) {
        console.error('Failed to remove saved program:', error)
        setError('Could not remove saved program.')
        setSaving(false)
        return
      }

      setIsSaved(false)
      setSaving(false)
      return
    }

    const { error } = await supabase.from('saved_programs').insert({
      user_id: userId,
      program_id: programId,
    })

    if (error) {
      console.error('Failed to save program:', error)

      if (error.code === '23505') {
        setIsSaved(true)
        setSaving(false)
        return
      }

      setError('Could not save program.')
      setSaving(false)
      return
    }

    setIsSaved(true)
    setSaving(false)
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
        onClick={toggleSavedProgram}
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

        {saving ? 'Saving...' : isSaved ? 'Saved program' : 'Save program'}
      </button>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}