'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type SaveOpportunityButtonProps = {
  opportunityId: string
}

export default function SaveOpportunityButton({
  opportunityId,
}: SaveOpportunityButtonProps) {
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
        .from('saved_opportunities')
        .select('id')
        .eq('user_id', user.id)
        .eq('opportunity_id', opportunityId)
        .maybeSingle()

      if (error) {
        console.error('Failed to load saved opportunity state:', error)
        setError('Could not check saved status.')
      }

      setIsSaved(Boolean(data))
      setLoading(false)
    }

    loadSavedState()
  }, [supabase, opportunityId])

  async function toggleSavedOpportunity() {
    if (!userId) return

    setSaving(true)
    setError('')

    if (isSaved) {
      const { error } = await supabase
        .from('saved_opportunities')
        .delete()
        .eq('user_id', userId)
        .eq('opportunity_id', opportunityId)

      if (error) {
        console.error('Failed to remove saved opportunity:', error)
        setError('Could not remove saved opportunity.')
        setSaving(false)
        return
      }

      setIsSaved(false)
      setSaving(false)
      return
    }

    const { error } = await supabase.from('saved_opportunities').insert({
      user_id: userId,
      opportunity_id: opportunityId,
    })

    if (error) {
      console.error('Failed to save opportunity:', error)
      setError('Could not save opportunity.')
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
        onClick={toggleSavedOpportunity}
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

        {saving ? 'Saving...' : isSaved ? 'Saved opportunity' : 'Save opportunity'}
      </button>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}