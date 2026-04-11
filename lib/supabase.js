import { createClient } from '@supabase/supabase-js'

// Aquí Next.js lee las llaves secretas de tu archivo .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Exportamos la conexión para usarla en cualquier parte de la web
export const supabase = createClient(supabaseUrl, supabaseAnonKey)