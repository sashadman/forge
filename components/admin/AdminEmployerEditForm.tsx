'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Circle,
  ExternalLink,
  Save,
  ShieldCheck,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Employer = {
  id: string
  name: string
  slug: string
  description: string
  industry: string | null
  location: string
  state: string
  website_url: string | null
  contact_email: string | null
  linkedin_url: string | null
  instagram_url: string | null
  facebook_url: string | null
  x_url: string | null
  youtube_url: string | null
  tiktok_url: string | null
  other_social_url: string | null
  is_verified: boolean
  is_active: boolean
}

type AdminEmployerEditFormProps = {
  employer: Employer
}

function cleanUrl(value: string) {
  const trimmed = value.trim()

  if (!trimmed) return null

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }

  return `https://${trimmed}`
}

export default function AdminEmployerEditForm({
  employer,
}: AdminEmployerEditFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const [name, setName] = useState(employer.name)
  const [description, setDescription] = useState(employer.description)
  const [industry, setIndustry] = useState(employer.industry || '')
  const [location, setLocation] = useState(employer.location)
  const [state, setState] = useState(employer.state)
  const [websiteUrl, setWebsiteUrl] = useState(employer.website_url || '')
  const [contactEmail, setContactEmail] = useState(employer.contact_email || '')

  const [linkedinUrl, setLinkedinUrl] = useState(employer.linkedin_url || '')
  const [instagramUrl, setInstagramUrl] = useState(employer.instagram_url || '')
  const [facebookUrl, setFacebookUrl] = useState(employer.facebook_url || '')
  const [xUrl, setXUrl] = useState(employer.x_url || '')
  const [youtubeUrl, setYoutubeUrl] = useState(employer.youtube_url || '')
  const [tiktokUrl, setTiktokUrl] = useState(employer.tiktok_url || '')
  const [otherSocialUrl, setOtherSocialUrl] = useState(
    employer.other_social_url || ''
  )

  const [isVerified, setIsVerified] = useState(employer.is_verified)
  const [isActive, setIsActive] = useState(employer.is_active)

  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const hasSocialLink = Boolean(
    linkedinUrl ||
      instagramUrl ||
      facebookUrl ||
      xUrl ||
      youtubeUrl ||
      tiktokUrl ||
      otherSocialUrl
  )

  const verificationItems = useMemo(
    () => [
      {
        label: 'Company name',
        complete: Boolean(name.trim()),
        helpText: 'Employer has a clear organization name.',
      },
      {
        label: 'Description quality',
        complete: description.trim().length >= 80,
        helpText: 'Description is detailed enough for public review.',
      },
      {
        label: 'Website',
        complete: Boolean(websiteUrl.trim()),
        helpText: 'Website is present for external verification.',
      },
      {
        label: 'Contact email',
        complete: Boolean(contactEmail.trim()),
        helpText: 'Contact email is present for follow-up.',
      },
      {
        label: 'Location',
        complete: Boolean(location.trim() && state.trim()),
        helpText: 'City and state are present.',
      },
      {
        label: 'Social or professional link',
        complete: hasSocialLink,
        helpText: 'At least one social/professional link is present.',
      },
      {
        label: 'Public visibility',
        complete: isActive,
        helpText: 'Employer is active and can appear publicly.',
      },
    ],
    [
      contactEmail,
      description,
      hasSocialLink,
      isActive,
      location,
      name,
      state,
      websiteUrl,
    ]
  )

  const completedVerificationItems = verificationItems.filter(
    (item) => item.complete
  ).length

  const verificationScore = Math.round(
    (completedVerificationItems / verificationItems.length) * 100
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setSaving(true)
    setSuccess('')
    setError('')

    const { error } = await supabase
      .from('employers')
      .update({
        name,
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
        is_verified: isVerified,
        is_active: isActive,
      })
      .eq('id', employer.id)

    if (error) {
      console.error(error)
      setError('Could not update employer. Check permissions and try again.')
      setSaving(false)
      return
    }

    setSuccess('Employer updated successfully.')
    setSaving(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="content-panel">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
            <Building2 className="h-7 w-7" />
          </div>

          <div>
            <p className="eyebrow">Employer verification workflow</p>

            <h2 className="section-title mt-3">{employer.name}</h2>

            <p className="muted-text mt-3 max-w-3xl">
              Review employer quality, public visibility, and verification
              status before marking an employer as verified.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/admin/employers" className="btn-outline">
            <ArrowLeft className="h-4 w-4" />
            Back to employers
          </Link>

          {employer.is_active && (
            <Link href={`/employers/${employer.slug}`} className="btn-dark">
              Public profile
              <ExternalLink className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>

      <div className="mt-10 rounded-3xl border border-orange-100 bg-orange-50/60 p-6">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
          <div>
            <p className="eyebrow">Verification readiness</p>

            <h3 className="mt-3 text-2xl font-bold text-slate-950">
              {verificationScore}% ready
            </h3>

            <p className="muted-text mt-3 max-w-3xl">
              This score is an internal admin aid. It does not automatically
              verify the employer. Use judgment before changing verification
              status.
            </p>
          </div>

          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-xl font-bold text-orange-700 shadow-sm">
            {verificationScore}%
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {verificationItems.map((item) => (
            <VerificationChecklistItem
              key={item.label}
              label={item.label}
              helpText={item.helpText}
              complete={item.complete}
            />
          ))}
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
          />
          <p className="mt-2 text-xs text-slate-500">
            Recommended: at least 80 characters for a useful public profile.
          </p>
        </div>

        <div>
          <label className="label">Industry</label>
          <input
            type="text"
            value={industry}
            onChange={(event) => setIndustry(event.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="label">Contact email</label>
          <input
            type="email"
            value={contactEmail}
            onChange={(event) => setContactEmail(event.target.value)}
            className="input-field"
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
          />
        </div>

        <div className="lg:col-span-2">
          <label className="label">Website</label>
          <input
            type="text"
            value={websiteUrl}
            onChange={(event) => setWebsiteUrl(event.target.value)}
            className="input-field"
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
          Social links are optional, but at least one professional or social link
          improves trust.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <label className="label">LinkedIn</label>
            <input
              type="text"
              value={linkedinUrl}
              onChange={(event) => setLinkedinUrl(event.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="label">Instagram</label>
            <input
              type="text"
              value={instagramUrl}
              onChange={(event) => setInstagramUrl(event.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="label">Facebook</label>
            <input
              type="text"
              value={facebookUrl}
              onChange={(event) => setFacebookUrl(event.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="label">X / Twitter</label>
            <input
              type="text"
              value={xUrl}
              onChange={(event) => setXUrl(event.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="label">YouTube</label>
            <input
              type="text"
              value={youtubeUrl}
              onChange={(event) => setYoutubeUrl(event.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="label">TikTok</label>
            <input
              type="text"
              value={tiktokUrl}
              onChange={(event) => setTiktokUrl(event.target.value)}
              className="input-field"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="label">Other social link</label>
            <input
              type="text"
              value={otherSocialUrl}
              onChange={(event) => setOtherSocialUrl(event.target.value)}
              className="input-field"
            />
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-slate-200 pt-8">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-orange-600" />
          <h3 className="text-2xl font-bold tracking-tight text-slate-950">
            Verification and visibility
          </h3>
        </div>

        <p className="muted-text mt-3">
          Verification is a trust signal shown publicly. Only mark an employer
          verified after reviewing the profile information.
        </p>

        <div className="mt-6 grid gap-4">
          <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <input
              type="checkbox"
              checked={isVerified}
              onChange={(event) => setIsVerified(event.target.checked)}
              className="mt-1 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
            />

            <span>
              <span className="block font-semibold text-slate-950">
                Mark employer as verified
              </span>
              <span className="mt-1 block text-sm leading-6 text-slate-500">
                Verified employers display public trust signals. This does not
                guarantee employment quality or current openings.
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(event) => setIsActive(event.target.checked)}
              className="mt-1 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
            />

            <span>
              <span className="block font-semibold text-slate-950">
                Active employer profile
              </span>
              <span className="mt-1 block text-sm leading-6 text-slate-500">
                Active employers can appear publicly. Inactive employers are
                hidden from public employer detail pages.
              </span>
            </span>
          </label>
        </div>
      </div>

      {error && (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-slate-500">
          Changes update this employer record and public trust status.
        </p>

        <button type="submit" disabled={saving} className="btn-primary">
          <Save className="h-4 w-4" />
          {saving ? 'Saving changes...' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}

function VerificationChecklistItem({
  label,
  helpText,
  complete,
}: {
  label: string
  helpText: string
  complete: boolean
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start gap-3">
        {complete ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
        ) : (
          <Circle className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
        )}

        <div>
          <p className="font-semibold text-slate-950">{label}</p>
          <p className="mt-1 text-sm leading-6 text-slate-500">{helpText}</p>
        </div>
      </div>
    </div>
  )
}