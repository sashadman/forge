'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/components/theme/ThemeProvider'

type SaveTradeButtonProps = {
  tradeSlug: string
}

export default function SaveTradeButton({ tradeSlug }: SaveTradeButtonProps) {
  const supabase = useMemo(() => createClient(), [])
  const { isLight } = useTheme()

  const [userId, setUserId] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)
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

      const { data, error } = await supabase
        .from('saved_trades')
        .select('id')
        .eq('user_id', user.id)
        .eq('trade_slug', tradeSlug)
        .maybeSingle()

      if (!isMounted) return

      if (error) {
        console.error('Failed to load saved career path state:', error)
        setError('Could not check saved status.')
      }

      setIsSaved(Boolean(data))
      setLoading(false)
    }

    loadSavedState()

    return () => {
      isMounted = false
    }
  }, [supabase, tradeSlug])

  async function toggleSavedTrade() {
    if (!userId || saving) return

    setSaving(true)
    setError('')

    try {
      if (isSaved) {
        const { error } = await supabase
          .from('saved_trades')
          .delete()
          .eq('user_id', userId)
          .eq('trade_slug', tradeSlug)

        if (error) throw error

        setIsSaved(false)
      } else {
        const { error } = await supabase.from('saved_trades').insert({
          user_id: userId,
          trade_slug: tradeSlug,
        })

        if (error && error.code !== '23505') throw error

        setIsSaved(true)
      }
    } catch (error) {
      console.error('Failed to update saved career path:', error)
      setError('Could not update saved career path.')
    } finally {
      setSaving(false)
    }
  }

  const neutralButtonClass = isLight
    ? 'inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-7 py-4 font-semibold text-slate-800 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60'
    : 'inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-7 py-4 font-semibold text-white transition hover:border-cyan-300/40 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60'

  const savedButtonClass = isLight
    ? 'inline-flex items-center justify-center gap-2 rounded-full bg-orange-100 px-7 py-4 font-semibold text-orange-700 transition hover:bg-orange-200 disabled:cursor-not-allowed disabled:opacity-60'
    : 'inline-flex items-center justify-center gap-2 rounded-full border border-orange-300/30 bg-orange-500/15 px-7 py-4 font-semibold text-orange-200 transition hover:bg-orange-500/20 disabled:cursor-not-allowed disabled:opacity-60'

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
        onClick={toggleSavedTrade}
        disabled={saving}
        aria-pressed={isSaved}
        className={isSaved ? savedButtonClass : neutralButtonClass}
      >
        {isSaved ? (
          <BookmarkCheck className="h-4 w-4" />
        ) : (
          <Bookmark className="h-4 w-4" />
        )}

        {saving ? 'Saving...' : isSaved ? 'Saved career path' : 'Save career path'}
      </button>

      {error && <p className="mt-2 text-sm font-semibold text-red-600">{error}</p>}
    </div>
  )
}