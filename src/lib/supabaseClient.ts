import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Environment check:')
console.log('VITE_SUPABASE_URL exists:', !!supabaseUrl)
console.log('VITE_SUPABASE_ANON_KEY exists:', !!supabaseAnonKey)
console.log('URL length:', supabaseUrl?.length)
console.log('Key length:', supabaseAnonKey?.length)

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 