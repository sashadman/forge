'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type EmployerProfileFormProps = {
  userId: string
  userEmail: string
}

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function cleanUrl(value: string) {
  const trimmed = value.trim()

  if (!trimmed) return null

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }

  return `https://${trimmed}`
}

export default function EmployerProfileForm({
  userId,
  userEmail,
}: EmployerProfileFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [industry, setIndustry] = useState('')
  const [location, setLocation] = useState('')
  const [state, setState] = useState('CA')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [contactEmail, setContactEmail] = useState(userEmail)

  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [instagramUrl, setInstagramUrl] = useState('')
  const [facebookUrl, setFacebookUrl] = useState('')
  const [xUrl, setXUrl] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [tiktokUrl, setTiktokUrl] = useState('')
  const [otherSocialUrl, setOtherSocialUrl] = useState('')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setSaving(true)
    setError('')

    const slug = createSlug(name)

    if (!slug) {
      setError('Please enter a valid employer name.')
      setSaving(false)
      return
    }

    const { error } = await supabase.from('employers').insert({
      owner_id: userId,
      name,
      slug,
      description,
      industry: industry.trim() || null,
      location,
      state,
      website_url: cleanUrl(websiteUrl),
      contact_email: contactEmail.trim() || null,
      linkedin_url: cleanUrl(linkedinUrl),
      instagram_url: cleanUrl(instagramUrl),
      facebook_url: cleanUrl(facebookUrl),
      x_url: cleanUrl(xUrl),
      youtube_url: cleanUrl(youtubeUrl),
      tiktok_url: cleanUrl(tiktokUrl),
      other_social_url: cleanUrl(otherSocialUrl),
      is_verified: false,
      is_active: true,
    })

    if (error) {
      console.error(error)

      if (error.message.toLowerCase().includes('duplicate')) {
        setError(
          'An employer profile with this name or slug already exists. Try a more specific company name.'
        )
      } else {
        setError('Could not create employer profile. Please try again.')
      }

      setSaving(false)
      return
    }

    router.push(`/employers/${slug}`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="content-panel">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
          <Building2 className="h-7 w-7" />
        </div>

        <div>
          <p className="eyebrow">Company profile</p>

          <h2 className="section-title mt-3">
            Tell career seekers about your organization.
          </h2>

          <p className="muted-text mt-3 max-w-3xl">
            Use real company information. New profiles are public but marked as
            not verified until reviewed.
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <label className="label">Employer or company name</label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="input-field"
            placeholder="Example: Perez Electrical & Solar"
          />
        </div>

        <div className="lg:col-span-2">
          <label className="label">Description</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
            rows={5}
            className="input-field"
            placeholder="Describe the company, type of work, service area, and workforce needs."
          />
        </div>

        <div>
          <label className="label">Industry</label>
          <input
            type="text"
            value={industry}
            onChange={(event) => setIndustry(event.target.value)}
            className="input-field"
            placeholder="Electrical, HVAC, plumbing, construction..."
          />
        </div>

        <div>
          <label className="label">Contact email</label>
          <input
            type="email"
            value={contactEmail}
            onChange={(event) => setContactEmail(event.target.value)}
            className="input-field"
            placeholder="contact@example.com"
          />
        </div>

        <div>
          <label className="label">City</label>
          <input
            type="text"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            required
            className="input-field"
            placeholder="San Diego"
          />
        </div>

        <div>
          <label className="label">State</label>
          <input
            type="text"
            value={state}
            onChange={(event) => setState(event.target.value.toUpperCase())}
            required
            maxLength={2}
            className="input-field"
            placeholder="CA"
          />
        </div>

        <div className="lg:col-span-2">
          <label className="label">Website</label>
          <input
            type="text"
            value={websiteUrl}
            onChange={(event) => setWebsiteUrl(event.target.value)}
            className="input-field"
            placeholder="https://company.com"
          />
        </div>
      </div>

      <div className="mt-10 border-t border-slate-200 pt-8">
        <div className="flex items-center gap-3">
          <ExternalLink className="h-5 w-5 text-orange-600" />
          <h3 className="text-2xl font-bold tracking-tight text-slate-950">
            Social links
          </h3>
        </div>

        <p className="muted-text mt-3">
          Add only the social profiles your organization actively uses.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <label className="label">LinkedIn</label>
            <input
              type="text"
              value={linkedinUrl}
              onChange={(event) => setLinkedinUrl(event.target.value)}
              className="input-field"
              placeholder="https://linkedin.com/company/..."
            />
          </div>

          <div>
            <label className="label">Instagram</label>
            <input
              type="text"
              value={instagramUrl}
              onChange={(event) => setInstagramUrl(event.target.value)}
              className="input-field"
              placeholder="https://instagram.com/..."
            />
          </div>

          <div>
            <label className="label">Facebook</label>
            <input
              type="text"
              value={facebookUrl}
              onChange={(event) => setFacebookUrl(event.target.value)}
              className="input-field"
              placeholder="https://facebook.com/..."
            />
          </div>

          <div>
            <label className="label">X / Twitter</label>
            <input
              type="text"
              value={xUrl}
              onChange={(event) => setXUrl(event.target.value)}
              className="input-field"
              placeholder="https://x.com/..."
            />
          </div>

          <div>
            <label className="label">YouTube</label>
            <input
              type="text"
              value={youtubeUrl}
              onChange={(event) => setYoutubeUrl(event.target.value)}
              className="input-field"
              placeholder="https://youtube.com/..."
            />
          </div>

          <div>
            <label className="label">TikTok</label>
            <input
              type="text"
              value={tiktokUrl}
              onChange={(event) => setTiktokUrl(event.target.value)}
              className="input-field"
              placeholder="https://tiktok.com/@..."
            />
          </div>

          <div className="lg:col-span-2">
            <label className="label">Other social link</label>
            <input
              type="text"
              value={otherSocialUrl}
              onChange={(event) => setOtherSocialUrl(event.target.value)}
              className="input-field"
              placeholder="Any other official company social profile"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-slate-500">
          Your profile will be connected to your signed-in account.
        </p>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Creating profile...' : 'Create employer profile'}
        </button>
      </div>
    </form>
  )
}