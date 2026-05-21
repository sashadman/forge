'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, ExternalLink, ShieldCheck } from 'lucide-react'
import StateSelect from '@/components/forms/StateSelect'
import { createClient } from '@/lib/supabase/client'

type AdminEmployerFormProps = {
  adminUserId: string
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

export default function AdminEmployerForm({
  adminUserId,
}: AdminEmployerFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [industry, setIndustry] = useState('')
  const [location, setLocation] = useState('')
  const [state, setState] = useState('CA')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [contactEmail, setContactEmail] = useState('')

  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [instagramUrl, setInstagramUrl] = useState('')
  const [facebookUrl, setFacebookUrl] = useState('')
  const [xUrl, setXUrl] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [tiktokUrl, setTiktokUrl] = useState('')
  const [otherSocialUrl, setOtherSocialUrl] = useState('')

  const [isVerified, setIsVerified] = useState(true)
  const [isActive, setIsActive] = useState(true)

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
      owner_id: adminUserId,
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
      is_verified: isVerified,
      is_active: isActive,
    })

    if (error) {
      console.error(error)

      if (error.message.toLowerCase().includes('duplicate')) {
        setError(
          'An employer with this name/slug already exists. Use a more specific name.'
        )
      } else {
        setError('Could not create employer. Check permissions and try again.')
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
          <p className="eyebrow">Manual employer entry</p>

          <h2 className="section-title mt-3">
            Add verified real employer information.
          </h2>

          <p className="muted-text mt-3 max-w-3xl">
            This creates a public employer profile owned by your admin account.
            Use it only for real organizations.
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
            placeholder="Describe the company and its real work."
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

        <StateSelect
          value={state}
          onChange={setState}
          required
          helperText="ZIP autofill will be added through the internal ZIP data layer next."
        />

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

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <SocialInput label="LinkedIn" value={linkedinUrl} onChange={setLinkedinUrl} />
          <SocialInput label="Instagram" value={instagramUrl} onChange={setInstagramUrl} />
          <SocialInput label="Facebook" value={facebookUrl} onChange={setFacebookUrl} />
          <SocialInput label="X / Twitter" value={xUrl} onChange={setXUrl} />
          <SocialInput label="YouTube" value={youtubeUrl} onChange={setYoutubeUrl} />
          <SocialInput label="TikTok" value={tiktokUrl} onChange={setTiktokUrl} />

          <div className="lg:col-span-2">
            <SocialInput
              label="Other social link"
              value={otherSocialUrl}
              onChange={setOtherSocialUrl}
            />
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-slate-200 pt-8">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-orange-600" />
          <h3 className="text-2xl font-bold tracking-tight text-slate-950">
            Admin settings
          </h3>
        </div>

        <div className="mt-6 grid gap-4">
          <AdminCheckbox
            checked={isVerified}
            onChange={setIsVerified}
            title="Mark as verified"
            description="Use this only when you have reviewed the employer information."
          />

          <AdminCheckbox
            checked={isActive}
            onChange={setIsActive}
            title="Publish as active"
            description="Active employers can appear publicly."
          />
        </div>
      </div>

      {error && (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-slate-500">
          Submit only real employer information. No placeholder data.
        </p>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Creating employer...' : 'Create employer'}
        </button>
      </div>
    </form>
  )
}

function SocialInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="input-field"
      />
    </div>
  )
}

function AdminCheckbox({
  checked,
  onChange,
  title,
  description,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  title: string
  description: string
}) {
  return (
    <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
      />
      <span>
        <span className="block font-semibold text-slate-950">{title}</span>
        <span className="mt-1 block text-sm leading-6 text-slate-500">
          {description}
        </span>
      </span>
    </label>
  )
}