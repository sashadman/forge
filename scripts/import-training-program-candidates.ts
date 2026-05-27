import fs from 'node:fs/promises'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'
import {
  normalizeCandidateRecord,
  sourceAllowsCandidateUrl,
  type ProgramCandidateImportFile,
} from '../lib/training-data/program-candidate-import'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const importFilePath = process.argv[2]

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is missing.')
}

if (!serviceRoleKey) {
  throw new Error(
    'SUPABASE_SERVICE_ROLE_KEY is missing. This importer must only run locally or in a secure server environment.'
  )
}

if (!importFilePath) {
  throw new Error(
    'Missing import file path. Example: npm run import:program-candidates -- data/imports/sample-program-candidates.json'
  )
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function readImportFile(filePath: string) {
  const absolutePath = path.resolve(filePath)
  const raw = await fs.readFile(absolutePath, 'utf8')
  return JSON.parse(raw) as ProgramCandidateImportFile
}

async function main() {
  const importData = await readImportFile(importFilePath)

  const { data: source, error: sourceError } = await supabase
    .from('training_sources')
    .select(
      `
      id,
      source_slug,
      source_name,
      source_authority,
      trust_level,
      allowed_domains
      `
    )
    .eq('source_slug', importData.source_slug)
    .maybeSingle()

  if (sourceError) {
    throw sourceError
  }

  if (!source) {
    throw new Error(`Training source not found: ${importData.source_slug}`)
  }

  const { data: importRun, error: importRunError } = await supabase
    .from('program_import_runs')
    .insert({
      source_id: source.id,
      run_type: 'manual',
      status: 'running',
      started_at: new Date().toISOString(),
      metadata: {
        import_file: importFilePath,
        source_slug: importData.source_slug,
      },
    })
    .select('id')
    .single()

  if (importRunError) {
    throw importRunError
  }

  let recordsCreated = 0
  let recordsUpdated = 0
  let recordsRejected = 0

  try {
    for (const rawRecord of importData.records) {
      try {
        const normalized = normalizeCandidateRecord(rawRecord)

        const allowedDomains = source.allowed_domains ?? []

        if (
          allowedDomains.length > 0 &&
          !sourceAllowsCandidateUrl({
            candidateDomain: normalized.source_domain,
            allowedDomains,
          })
        ) {
          recordsRejected += 1
          continue
        }

        const { data: existingCandidate, error: existingError } = await supabase
          .from('training_program_candidates')
          .select('id')
          .eq('source_url', normalized.source_url)
          .maybeSingle()

        if (existingError) {
          throw existingError
        }

        const candidatePayload = {
          ...normalized,
          source_id: source.id,
          import_run_id: importRun.id,
          source_authority: source.source_authority,
          trust_level: source.trust_level,
          verification_status:
            source.trust_level === 'auto_trusted'
              ? 'trusted_candidate'
              : 'candidate',
          confidence_score:
            source.trust_level === 'auto_trusted'
              ? 90
              : source.trust_level === 'trusted_source_review'
                ? 75
                : 50,
          updated_at: new Date().toISOString(),
        }

        const { error: upsertError } = await supabase
          .from('training_program_candidates')
          .upsert(candidatePayload, {
            onConflict: 'source_url',
          })

        if (upsertError) {
          throw upsertError
        }

        if (existingCandidate) {
          recordsUpdated += 1
        } else {
          recordsCreated += 1
        }
      } catch (recordError) {
        recordsRejected += 1
        console.error('Rejected candidate record:', recordError)
      }
    }

    const { error: finishError } = await supabase
      .from('program_import_runs')
      .update({
        status: 'completed',
        finished_at: new Date().toISOString(),
        records_found: importData.records.length,
        records_created: recordsCreated,
        records_updated: recordsUpdated,
        records_rejected: recordsRejected,
      })
      .eq('id', importRun.id)

    if (finishError) {
      throw finishError
    }

    await supabase
      .from('training_sources')
      .update({
        crawl_status: 'completed',
        last_crawled_at: new Date().toISOString(),
        last_successful_crawl_at: new Date().toISOString(),
        last_error: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', source.id)

    console.log('Import completed.')
    console.log(`Found: ${importData.records.length}`)
    console.log(`Created: ${recordsCreated}`)
    console.log(`Updated: ${recordsUpdated}`)
    console.log(`Rejected: ${recordsRejected}`)
  } catch (error) {
    await supabase
      .from('program_import_runs')
      .update({
        status: 'failed',
        finished_at: new Date().toISOString(),
        error_message:
          error instanceof Error ? error.message : 'Unknown import error',
        records_found: importData.records.length,
        records_created: recordsCreated,
        records_updated: recordsUpdated,
        records_rejected: recordsRejected,
      })
      .eq('id', importRun.id)

    await supabase
      .from('training_sources')
      .update({
        crawl_status: 'failed',
        last_crawled_at: new Date().toISOString(),
        last_error: error instanceof Error ? error.message : 'Unknown import error',
        updated_at: new Date().toISOString(),
      })
      .eq('id', source.id)

    throw error
  }
}

main()