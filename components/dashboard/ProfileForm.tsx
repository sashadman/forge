'use client'

import { FormEvent, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type ProfileFormProps = {
  userId: string
  fullName: string
  location: string
  experienceLevel: string
}

const EXPERIENCE_OPTIONS = [
  'No experience',
  'Some hands-on experience',
  'Trade school student',
  'Apprentice',
  'Experienced professional',
]

export default function ProfileForm({
  userId,
  fullName,
  location,
  experienceLevel,
}: ProfileFormProps) {
  const supabase = createClient()

  const [name, setName] = useState(fullName)
  const [currentLocation, setCurrentLocation] = useState(location)
  const [currentExperience, setCurrentExperience] = useState(experienceLevel)

  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setSaving(true)
    setSuccess('')
    setError('')

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: name,
        location: currentLocation,
        experience_level: currentExperience,
      })
      .eq('id', userId)

    if (error) {
      console.error(error)
      setError('Could not update profile.')
      setSaving(false)
      return
    }

    setSuccess('Profile updated successfully.')
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="label">Full name</label>

        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="input-field"
          placeholder="Your full name"
        />
      </div>

      <div>
        <label className="label">Location</label>

        <input
          type="text"
          value={currentLocation}
          onChange={(event) => setCurrentLocation(event.target.value)}
          className="input-field"
          placeholder="City, State"
        />
      </div>

      <div>
        <label className="label">Experience level</label>

        <select
          value={currentExperience}
          onChange={(event) => setCurrentExperience(event.target.value)}
          className="input-field"
        >
          <option value="">Select experience level</option>

          {EXPERIENCE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <button type="submit" disabled={saving} className="btn-dark w-full rounded-2xl">
        {saving ? 'Saving...' : 'Save profile'}
      </button>
    </form>
  )
}