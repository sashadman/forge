import { createClient } from '@supabase/supabase-js'
import { nationalTrainingSourcesSeed } from '../data/training-sources.seed'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is missing.')
}

if (!serviceRoleKey) {
  throw new Error(
    'SUPABASE_SERVICE_ROLE_KEY is missing. This script must only run locally or in a secure server environment.'
  )
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function main() {
  const { error } = await supabase.from('training_sources').upsert(
    nationalTrainingSourcesSeed,
    {
      onConflict: 'source_slug',
    }
  )

  if (error) {
    console.error('Failed to seed training sources:', error)
    process.exit(1)
  }

  console.log(
    `Seeded ${nationalTrainingSourcesSeed.length} national training sources.`
  )
}

main()