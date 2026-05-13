import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and a publishable/anon/service key are required.'
  )
}

const supabase = createClient(supabaseUrl, supabaseKey)

const stories = {
  'SCN-008': [
    { type: 'system', content: 'CRITICAL ALERT: PROFILE SERVICE TIMEOUTS DETECTED.', delay: 1000 },
    {
      type: 'message',
      role: 'Product Manager',
      name: 'Alex Rivera',
      content:
        "Junior, we've got a problem. Marketing just went live with the new 'User Profiles' campaign, but it looks like the backend route... well, it doesn't exist yet. The front-end is just hitting a 501.",
      delay: 2000,
    },
    {
      type: 'message',
      role: 'Frontend Lead',
      name: 'Jordan Park',
      content:
        "I've got hundreds of users tweeting at us because they can't set their avatars. Sarah says you're the only one available to fix this. Please tell me you can handle a simple GET /api/profile.",
      delay: 1500,
    },
    {
      type: 'message',
      role: 'Senior Dev',
      name: 'Sarah Chen',
      content:
        "It's a straightforward task. The auth middleware is already done. Just map the user data correctly and exclude the password hash. Don't let us down.",
      delay: 2000,
    },
  ],
  'SCN-007': [
    { type: 'system', content: 'SECURITY SCAN: RATE LIMIT VIOLATION ON /api/search.', delay: 1000 },
    {
      type: 'message',
      role: 'Product Manager',
      name: 'Alex Rivera',
      content:
        "Emergency meeting! We're being scraped by 'DataCrawler-9000'. They're pulling our entire proprietary catalog. We have a production deploy at 6 PM — we NEED rate limiting included in that push.",
      delay: 2500,
    },
    {
      type: 'message',
      role: 'Junior Dev',
      name: 'Benja',
      content:
        "Uh, Sarah? I might have pushed a 'fix' to main that simplifies search queries... I think I accidentally disabled the legacy protection. The staging build is failing.",
      delay: 2000,
    },
    {
      type: 'message',
      role: 'Senior Dev',
      name: 'Sarah Chen',
      content:
        "BENJA! We discussed this. Step aside. Junior, I need you to clean up Benja's mess and implement a robust Redis-backed rate limiter. The 6 PM deadline is non-negotiable.",
      delay: 2000,
    },
  ],
}

async function updateScenarios() {
  for (const [id, story] of Object.entries(stories)) {
    console.log(`Updating scenario ${id}...`)
    const { error } = await supabase.from('scenarios').update({ story }).eq('id', id)

    if (error) {
      console.error(`Error updating ${id}:`, error.message)
    } else {
      console.log(`Successfully updated ${id}`)
    }
  }
}

updateScenarios()
