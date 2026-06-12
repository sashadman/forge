// app/api/admin/jobs/import/usajobs/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

type USAJobsMatchedObject = {
  MatchedObjectId?: string
  MatchedObjectDescriptor?: {
    PositionTitle?: string
    OrganizationName?: string
    PositionLocationDisplay?: string
    PositionLocation?: Array<{
      CityName?: string
      CountrySubDivisionCode?: string
      LocationName?: string
    }>
    PositionURI?: string
    ApplyURI?: string[]
    PublicationStartDate?: string
    ApplicationCloseDate?: string
    PositionOfferingType?: Array<{
      Name?: string
    }>
    JobCategory?: Array<{
      Name?: string
    }>
    PositionRemuneration?: Array<{
      MinimumRange?: string
      MaximumRange?: string
      Description?: string
    }>
    UserArea?: {
      Details?: {
        JobSummary?: string
      }
    }
  }
}

type USAJobsResponse = {
  SearchResult?: {
    SearchResultItems?: USAJobsMatchedObject[]
  }
}

type JobInsert = Database['public']['Tables']['jobs']['Insert']

const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const TRADE_SEARCHES = [
  {
    keyword: 'electrician',
    tradeCategory: 'Electrical',
  },
  {
    keyword: 'maintenance mechanic',
    tradeCategory: 'Maintenance',
  },
  {
    keyword: 'hvac',
    tradeCategory: 'HVAC',
  },
  {
    keyword: 'welder',
    tradeCategory: 'Welding',
  },
  {
    keyword: 'plumber',
    tradeCategory: 'Plumbing',
  },
  {
    keyword: 'engineering technician',
    tradeCategory: 'Engineering Technician',
  },
  {
    keyword: 'equipment operator',
    tradeCategory: 'Equipment Operation',
  },
  {
    keyword: 'construction',
    tradeCategory: 'Construction',
  },
]

export async function POST(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret) {
    const authHeader = request.headers.get('authorization')

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const userAgent = process.env.USAJOBS_USER_AGENT
  const authorizationKey = process.env.USAJOBS_AUTHORIZATION_KEY

  if (!userAgent || !authorizationKey) {
    return NextResponse.json(
      {
        error:
          'Missing USAJOBS_USER_AGENT or USAJOBS_AUTHORIZATION_KEY in .env.local',
      },
      { status: 500 }
    )
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return NextResponse.json(
      {
        error:
          'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local',
      },
      { status: 500 }
    )
  }

  const importedJobs: JobInsert[] = []
  const errors: string[] = []

  for (const search of TRADE_SEARCHES) {
    try {
      const url = new URL('https://data.usajobs.gov/api/Search')

      url.searchParams.set('Keyword', search.keyword)
      url.searchParams.set('LocationName', 'San Diego, California')
      url.searchParams.set('ResultsPerPage', '10')

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          Host: 'data.usajobs.gov',
          'User-Agent': userAgent,
          'Authorization-Key': authorizationKey,
        },
        cache: 'no-store',
      })

      if (!response.ok) {
        errors.push(
          `${search.keyword}: USAJOBS request failed with status ${response.status}`
        )
        continue
      }

      const data = (await response.json()) as USAJobsResponse
      const items = data.SearchResult?.SearchResultItems ?? []

      for (const item of items) {
        const descriptor = item.MatchedObjectDescriptor

        if (!descriptor?.PositionTitle || !item.MatchedObjectId) {
          continue
        }

        const firstLocation = descriptor.PositionLocation?.[0]
        const applyUrl =
          descriptor.ApplyURI?.[0] ||
          descriptor.PositionURI ||
          `https://www.usajobs.gov/job/${item.MatchedObjectId}`

        const salaryText = buildSalaryText(
          descriptor.PositionRemuneration?.[0]?.MinimumRange,
          descriptor.PositionRemuneration?.[0]?.MaximumRange,
          descriptor.PositionRemuneration?.[0]?.Description
        )

        const summary = cleanSummary(descriptor.UserArea?.Details?.JobSummary)

        const normalizedJob: JobInsert = {
          employer_id: null,

          title: descriptor.PositionTitle,
          company_name: descriptor.OrganizationName ?? 'U.S. Government',
          location:
            descriptor.PositionLocationDisplay ||
            firstLocation?.LocationName ||
            'San Diego, CA',
          city: firstLocation?.CityName ?? null,
          state: firstLocation?.CountrySubDivisionCode ?? 'CA',

          trade_category: search.tradeCategory,
          employment_type: descriptor.PositionOfferingType?.[0]?.Name ?? null,

          salary_min: parseSalaryNumber(
            descriptor.PositionRemuneration?.[0]?.MinimumRange
          ),
          salary_max: parseSalaryNumber(
            descriptor.PositionRemuneration?.[0]?.MaximumRange
          ),
          salary_text: salaryText,

          description_summary: summary,
          full_description: null,

          source_type: 'government_api',
          source_name: 'USAJOBS',
          source_job_id: item.MatchedObjectId,
          source_url: descriptor.PositionURI ?? applyUrl,
          apply_url: applyUrl,

          is_external: true,
          is_verified: false,
          status: 'active',

          posted_at: descriptor.PublicationStartDate
            ? new Date(descriptor.PublicationStartDate).toISOString()
            : new Date().toISOString(),
          expires_at: descriptor.ApplicationCloseDate
            ? new Date(descriptor.ApplicationCloseDate).toISOString()
            : null,
          last_seen_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        importedJobs.push(normalizedJob)
      }
    } catch (error) {
      errors.push(
        `${search.keyword}: ${
          error instanceof Error ? error.message : 'Unknown import error'
        }`
      )
    }
  }

  if (importedJobs.length === 0) {
    return NextResponse.json({
      imported: 0,
      errors,
      message:
        'No jobs were imported. Check USAJOBS credentials, location, and keyword results.',
    })
  }

  const { error: upsertError } = await supabaseAdmin.from('jobs').upsert(
    importedJobs,
    {
      onConflict: 'source_name,source_job_id',
    }
  )

  if (upsertError) {
    return NextResponse.json(
      {
        error: upsertError.message,
        importedAttempted: importedJobs.length,
        errors,
      },
      { status: 500 }
    )
  }

  return NextResponse.json({
    imported: importedJobs.length,
    errors,
  })
}

function cleanSummary(summary?: string | null) {
  if (!summary) return null

  return summary
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 320)
}

function parseSalaryNumber(value?: string | null) {
  if (!value) return null

  const number = Number(value.replace(/[^0-9.]/g, ''))

  return Number.isFinite(number) ? number : null
}

function buildSalaryText(
  min?: string | null,
  max?: string | null,
  description?: string | null
) {
  const cleanMin = min?.trim()
  const cleanMax = max?.trim()
  const cleanDescription = description?.trim()

  if (cleanMin && cleanMax && cleanMin !== '0' && cleanMax !== '0') {
    return `$${Number(cleanMin).toLocaleString()} - $${Number(
      cleanMax
    ).toLocaleString()} ${cleanDescription ?? ''}`.trim()
  }

  if (cleanDescription) {
    return cleanDescription
  }

  return null
}
