import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

// @ts-ignore-next-line 
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// @ts-ignore-next-line
const supabaseKey = import.meta.env.VITE_SUPABASE_PUB_KEY

// Inject <Database> here so everything later is strictly typed
export const supabase = createClient<Database>(supabaseUrl, supabaseKey)