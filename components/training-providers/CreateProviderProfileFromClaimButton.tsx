'use client'

import { useState, useTransition } from 'react'
import { Building2, Loader2 } from 'lucide-react'
import { createProviderWorkspaceFromClaim } from '@/app/actions/provider-workspaces'

type CreateProviderProfileFromClaimButtonProps = {
  claimId: string
  claimStatus: string
  submittedBy: string | null
}

export default function CreateProviderProfileFromClaimButton({
  claimId,
  claimStatus,
  submittedBy,
}: CreateProviderProfileFromClaimButtonProps) {
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const canCreate = claimStatus === 'approved' && Boolean(submittedBy)

  function handleCreateProfile() {
    setNotice('')
    setError('')

    startTransition(async () => {
      try {
        await createProviderWorkspaceFromClaim(claimId)
        setNotice('Provider workspace created and linked programs connected.')
      } catch (caughtError) {
        console.error('Create provider workspace failed:', caughtError)

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Could not create provider workspace.'
        )
      }
    })
  }

  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-sm font-bold text-slate-950">
        Provider workspace setup
      </p>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        Create a verified provider profile, connect the submitting user as the
        provider owner, and attach any linked public program to that provider
        workspace.
      </p>

      {!submittedBy && (
        <p className="mt-3 text-sm font-semibold text-orange-700">
          This claim has no signed-in submitting user. Ask the provider to submit
          a new signed-in request before creating a workspace.
        </p>
      )}

      <button
        type="button"
        onClick={handleCreateProfile}
        disabled={!canCreate || isPending}
        className="btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Building2 className="h-4 w-4" />
        )}
        {isPending ? 'Creating workspace...' : 'Create provider workspace'}
      </button>

      {notice && (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {notice}
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}
    </div>
  )
}