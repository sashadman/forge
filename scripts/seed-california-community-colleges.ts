import { createClient } from '@supabase/supabase-js'
import { californiaCommunityCollegesSeed } from '../data/california-community-colleges.seed'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is missing.')
}

if (!serviceRoleKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing. Use this script only locally or in a secure server environment.')
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function main() {
  const { error } = await supabase
    .from('california_community_colleges')
    .upsert(californiaCommunityCollegesSeed, {
      onConflict: 'slug',
    })

  if (error) {
    console.error('Failed to seed California community colleges:', error)
    process.exit(1)
  }

  console.log(
    `Seeded ${californiaCommunityCollegesSeed.length} California community college records.`
  )
}

main()