import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://vjulagaprzbnquynwjmt.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqdWxhZ2FwcnpibnF1eW53am10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4OTYzMDEsImV4cCI6MjA5MjQ3MjMwMX0.wX5C8kV4COGDwca_rxGMY41wHfpmsD7hMEWcxirIpak'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Charger toutes les éditions depuis Supabase
export async function loadEditsFromCloud() {
  const { data, error } = await supabase
    .from('carnet_edits')
    .select('section_id, title, paragraphs, updated_at')
  if (error) { console.error('Supabase load error:', error); return null }
  // Convertir en objet { [section_id]: { title, paragraphs } }
  const result = {}
  for (const row of data) {
    result[row.section_id] = {
      title: row.title,
      paragraphs: row.paragraphs,
      updated_at: row.updated_at,
    }
  }
  return result
}

// Sauvegarder une section dans Supabase (upsert)
export async function saveEditToCloud(sectionId, title, paragraphs) {
  const { error } = await supabase
    .from('carnet_edits')
    .upsert({
      section_id: sectionId,
      title,
      paragraphs,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'section_id' })
  if (error) { console.error('Supabase save error:', error); return false }
  return true
}

// Supprimer une édition (restauration original)
export async function deleteEditFromCloud(sectionId) {
  const { error } = await supabase
    .from('carnet_edits')
    .delete()
    .eq('section_id', sectionId)
  if (error) { console.error('Supabase delete error:', error); return false }
  return true
}
