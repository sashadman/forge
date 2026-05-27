'use client'

import { FormEvent, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Loader2 } from 'lucide-react'
import StateSelect from '@/components/forms/StateSelect'
import { updateTrainingProviderProfile } from '@/app/actions/training-providers'

type TrainingProviderProfile = {
  id: string
  name: string
  description: string | null
  website_url: string | null
  contact_email: string | null
  phone: string | null
  city: string
  state: string
  verification_status: string
}

type TrainingProviderProfileFormProps = {
  providerProfile: TrainingProviderProfile
}

export default function TrainingProviderProfileForm({
  providerProfile,
}: TrainingProviderProfileFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [name, setName] = useState(providerProfile.name)
  const [description, setDescription] = useState(providerProfile.description ?? '')
  const [websiteUrl, setWebsiteUrl] = useState(providerProfile.website_url ?? '')
  const [contactEmail, setContactEmail] = useState(
    providerProfile.contact_email ?? ''
  )
  const [phone, setPhone] = useState(providerProfile.phone ?? '')
  const [city, setCity] = useState(providerProfile.city)
  const [state, setState] = useState(providerProfile.state)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setNotice('')
    setError('')

    startTransition(async () => {
      try {
        await updateTrainingProviderProfile({
          providerProfileId: providerProfile.id,
          name,
          description,
          websiteUrl,
          contactEmail,
          phone,
          city,
          state,
        })

        setNotice('Provider profile updated.')
        router.refresh()
      } catch (caughtError) {
        console.error('Provider profile update failed:', caughtError)

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Could not update provider profile.'
        )
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="content-panel">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
          <Building2 className="h-7 w-7" />
        </div>

        <div>
          <p className="eyebrow">Provider profile</p>

          <h2 className="section-title mt-3">
            Maintain your verified provider profile.
          </h2>

          <p className="muted-text mt-3 max-w-3xl">
            Keep organization information accurate for career seekers. Program
            editing will be added after the provider ownership layer is stable.
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <label className="label">Provider name</label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="input-field"
            required
          />
        </div>

        <div className="lg:col-span-2">
          <label className="label">Description</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={6}
            className="input-field"
            placeholder="Describe the organization, training mission, service area, and student population."
          />
        </div>

        <div>
          <label className="label">Website</label>
          <input
            type="text"
            value={websiteUrl}
            onChange={(event) => setWebsiteUrl(event.target.value)}
            className="input-field"
            placeholder="https://provider.edu"
          />
        </div>

        <div>
          <label className="label">Contact email</label>
          <input
            type="email"
            value={contactEmail}
            onChange={(event) => setContactEmail(event.target.value)}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="label">Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="input-field"
            placeholder="Optional"
          />
        </div>

        <div>
          <label className="label">City</label>
          <input
            type="text"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className="input-field"
            required
          />
        </div>

        <StateSelect
          value={state}
          onChange={setState}
          required
          helperText="Use the provider's primary operating state."
        />

        <div>
          <label className="label">Verification status</label>
          <input
            type="text"
            value={providerProfile.verification_status}
            className="input-field"
            disabled
          />
        </div>
      </div>

      {notice && (
        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {notice}
        </div>
      )}

      {error && (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-slate-500">
          Provider profile changes remain connected to your approved provider
          membership.
        </p>

        <button type="submit" disabled={isPending} className="btn-primary">
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? 'Saving...' : 'Save provider profile'}
        </button>
      </div>
    </form>
  )
}