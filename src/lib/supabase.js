import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(url, key)

export async function loadNotebook() {
  const { data, error } = await supabase
    .from('notebook')
    .select('data')
    .eq('id', 'main')
    .single()
  if (error) throw error
  return data.data
}

export async function saveNotebook(notebook) {
  const { error } = await supabase
    .from('notebook')
    .update({ data: notebook, updated_at: new Date().toISOString() })
    .eq('id', 'main')
  if (error) throw error
}
