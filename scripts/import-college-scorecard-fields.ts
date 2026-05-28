import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'csv-parse/sync'
import { createClient } from '@supabase/supabase-js'
import { normalizeCandidateRecord } from '../lib/training-data/program-candidate-import'
import { normalizeCollegeScorecardFieldRow } from '../lib/training-data/college-scorecard-field-import'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const csvFilePath = process.argv[2]

const BATCH_SIZE = 500
const SOURCE_SLUG = 'college-scorecard'

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is missing.')
}

if (!serviceRoleKey) {
  throw new Error(
    'SUPABASE_SERVICE_ROLE_KEY is missing. This importer must run only locally or in a secure server environment.'
  )
}

if (!csvFilePath) {
  throw new Error(
    'Missing CSV path. Example: npm run import:scorecard-fields -- data/imports/Most-Recent-Field-Data-Elements.csv'
  )
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

function readCsv(filePath: string) {
  const absolutePath = path.resolve(filePath)
  const raw = fs.readFileSync(absolutePath, 'utf8')

  return parse(raw, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
    relax_quotes: true,
    relax_column_count: true,
  }) as Record<string, string | undefined>[]
}

async function getCollegeScorecardSource() {
  const { data: source, error } = await supabase
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
    .eq('source_slug', SOURCE_SLUG)
    .maybeSingle()

  if (error) throw error

  if (!source) {
    throw new Error(
      'College Scorecard training source not found. Run npm run seed:training-sources first.'
    )
  }

  return source
}
async function upsertBatch({
  batch,
  source,
  importRunId,
}: {
  batch: Record<string, unknown>[]
  source: {
    id: string
    source_authority: string
    trust_level: string
  }
  importRunId: string
}) {
  if (batch.length === 0) return 0

  const dedupedBySourceUrl = new Map<string, Record<string, unknown>>()

  for (const record of batch) {
    const sourceUrl = record.source_url

    if (typeof sourceUrl !== 'string' || sourceUrl.trim().length === 0) {
      continue
    }

    dedupedBySourceUrl.set(sourceUrl, record)
  }

  const recordsToUpsert = Array.from(dedupedBySourceUrl.values()).map(
    (record) => ({
      ...record,
      source_id: source.id,
      import_run_id: importRunId,
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
    })
  )

  if (recordsToUpsert.length === 0) return 0

  const { error } = await supabase
    .from('training_program_candidates')
    .upsert(recordsToUpsert, {
      onConflict: 'source_url',
    })

  if (error) throw error

  return recordsToUpsert.length
}

async function main() {
  const source = await getCollegeScorecardSource()
  const rows = readCsv(csvFilePath)

  const { data: importRun, error: importRunError } = await supabase
    .from('program_import_runs')
    .insert({
      source_id: source.id,
      run_type: 'csv',
      status: 'running',
      started_at: new Date().toISOString(),
      metadata: {
        import_file: csvFilePath,
        source_slug: SOURCE_SLUG,
        row_count: rows.length,
      },
    })
    .select('id')
    .single()

  if (importRunError) throw importRunError

  let recordsCreatedOrUpdated = 0
  let recordsRejected = 0
  let recordsSkipped = 0
  let batch: Record<string, unknown>[] = []

  try {
    for (const row of rows) {
      const normalizedScorecardRecord = normalizeCollegeScorecardFieldRow(row)

      if (!normalizedScorecardRecord) {
        recordsSkipped += 1
        continue
      }

      try {
        const candidateRecord = normalizeCandidateRecord(normalizedScorecardRecord)

        batch.push(candidateRecord)

        if (batch.length >= BATCH_SIZE) {
         const upsertedCount =  await upsertBatch({
            batch,
            source,
            importRunId: importRun.id,
          })

          recordsCreatedOrUpdated += batch.length
          batch = []
        }
      } catch (recordError) {
        recordsRejected += 1
        console.error('Rejected College Scorecard row:', recordError)
      }
    }

    if (batch.length > 0) {
      const upsertedCount =await upsertBatch({
        batch,
        source,
        importRunId: importRun.id,
      })

      recordsCreatedOrUpdated += upsertedCount
    }

    const { error: finishError } = await supabase
      .from('program_import_runs')
      .update({
        status: 'completed',
        finished_at: new Date().toISOString(),
        records_found: rows.length,
        records_created: recordsCreatedOrUpdated,
        records_updated: 0,
        records_rejected: recordsRejected + recordsSkipped,
        metadata: {
          import_file: csvFilePath,
          source_slug: SOURCE_SLUG,
          row_count: rows.length,
          skipped_non_trade_or_non_target_rows: recordsSkipped,
        },
      })
      .eq('id', importRun.id)

    if (finishError) throw finishError

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

    console.log('College Scorecard field import completed.')
    console.log(`Rows found: ${rows.length}`)
    console.log(`Candidates created or updated: ${recordsCreatedOrUpdated}`)
    console.log(`Rejected rows: ${recordsRejected}`)
    console.log(`Skipped rows: ${recordsSkipped}`)
  } catch (error) {
    await supabase
      .from('program_import_runs')
      .update({
        status: 'failed',
        finished_at: new Date().toISOString(),
        error_message:
           error instanceof Error ? error.message : JSON.stringify(error),
        records_found: rows.length,
        records_created: recordsCreatedOrUpdated,
        records_rejected: recordsRejected + recordsSkipped,
      })
      .eq('id', importRun.id)

    await supabase
      .from('training_sources')
      .update({
        crawl_status: 'failed',
        last_crawled_at: new Date().toISOString(),
        last_error: error instanceof Error ? error.message : JSON.stringify(error),
        updated_at: new Date().toISOString(),
      })
      .eq('id', source.id)

    throw error
  }
}

main()