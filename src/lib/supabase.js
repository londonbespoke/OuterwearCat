import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables.')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

// Images are stored as full URLs — return as-is
export const getImageUrl = (url) => {
  if (!url) return null
  return url
}
