'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type RemoveSavedOpportunityButtonProps = {
  opportunityId: string
}

export default function RemoveSavedOpportunityButton({
  opportunityId,
}: RemoveSavedOpportunityButtonProps) {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [removing, setRemoving] = useState(false)
  const [error, setError] = useState('')

  async function removeSavedOpportunity() {
    if (removing) return

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

    const { error: savedOpportunityError } = await supabase
      .from('saved_opportunities')
      .delete()
      .eq('user_id', user.id)
      .eq('opportunity_id', opportunityId)

    if (savedOpportunityError) {
      console.error('Failed to remove saved opportunity:', savedOpportunityError)
      setError('Could not remove saved opportunity.')
      setRemoving(false)
      return
    }

    const { error: pipelineError } = await supabase
      .from('opportunity_pipeline')
      .delete()
      .eq('user_id', user.id)
      .eq('opportunity_id', opportunityId)

    if (pipelineError) {
      console.error('Failed to remove opportunity pipeline record:', pipelineError)
      setError('Saved opportunity was removed, but pipeline cleanup failed.')
      setRemoving(false)
      router.refresh()
      return
    }

    router.refresh()
  }

  return (
    <div>
      <button
        type="button"
        onClick={removeSavedOpportunity}
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