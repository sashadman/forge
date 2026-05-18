'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type RemoveSavedTradeButtonProps = {
  tradeSlug: string
}

export default function RemoveSavedTradeButton({
  tradeSlug,
}: RemoveSavedTradeButtonProps) {
  const router = useRouter()
  const supabase = createClient()

  const [removing, setRemoving] = useState(false)
  const [error, setError] = useState('')

  async function removeSavedTrade() {
    setRemoving(true)
    setError('')

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('Please sign in again.')
      setRemoving(false)
      return
    }

    const { error } = await supabase
      .from('saved_trades')
      .delete()
      .eq('user_id', user.id)
      .eq('trade_slug', tradeSlug)

    if (error) {
      console.error(error)
      setError('Could not remove saved trade.')
      setRemoving(false)
      return
    }

    router.refresh()
  }

  return (
    <div>
      <button
        type="button"
        onClick={removeSavedTrade}
        disabled={removing}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <X className="h-4 w-4" />
        {removing ? 'Removing...' : 'Remove'}
      </button>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}