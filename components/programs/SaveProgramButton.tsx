'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type SaveProgramButtonProps = {
  programId: string
}

export default function SaveProgramButton({ programId }: SaveProgramButtonProps) {
  const supabase = createClient()

  const [userId, setUserId] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadSavedState() {
      setLoading(true)
      setError('')

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setUserId(null)
        setIsSaved(false)
        setLoading(false)
        return
      }

      setUserId(user.id)

      const { data, error } = await supabase
        .from('saved_programs')
        .select('id')
        .eq('user_id', user.id)
        .eq('program_id', programId)
        .maybeSingle()

      if (error) {
        console.error('Failed to load saved program state:', error)
        setError('Could not check saved status.')
      }

      setIsSaved(Boolean(data))
      setLoading(false)
    }

    loadSavedState()
  }, [supabase, programId])

  async function toggleSavedProgram() {
    if (!userId) return

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
      setError('Could not save program.')
      setSaving(false)
      return
    }

    setIsSaved(true)
    setSaving(false)
  }

  if (loading) {
    return (
      <button type="button" disabled className="btn-outline w-full px-6 py-4 text-slate-400">
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