import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://vjulagaprzbnquynwjmt.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqdWxhZ2FwcnpibnF1eW53am10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4OTYzMDEsImV4cCI6MjA5MjQ3MjMwMX0.wX5C8kV4COGDwca_rxGMY41wHfpmsD7hMEWcxirIpak'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ═══════════════════════════════════
// CARNET DE VOYAGE
// ═══════════════════════════════════

export async function loadEditsFromCloud() {
  const { data, error } = await supabase
    .from('carnet_edits')
    .select('section_id, title, paragraphs, updated_at')
  if (error) { console.error('Supabase load error:', error); return null }
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

export async function deleteEditFromCloud(sectionId) {
  const { error } = await supabase
    .from('carnet_edits')
    .delete()
    .eq('section_id', sectionId)
  if (error) { console.error('Supabase delete error:', error); return false }
  return true
}

// ═══════════════════════════════════
// BUDGET — DÉPENSES
// ═══════════════════════════════════

export async function loadExpensesFromCloud() {
  const { data, error } = await supabase
    .from('budget_expenses')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) { console.error('loadExpenses error:', error); return null }
  return data
}

export async function saveExpenseToCloud(expense) {
  const { error } = await supabase
    .from('budget_expenses')
    .upsert(expense, { onConflict: 'id' })
  if (error) { console.error('saveExpense error:', error); return false }
  return true
}

export async function deleteExpenseFromCloud(id) {
  const { error } = await supabase
    .from('budget_expenses')
    .delete()
    .eq('id', id)
  if (error) { console.error('deleteExpense error:', error); return false }
  return true
}

// ═══════════════════════════════════
// BUDGET — HÉBERGEMENTS
// ═══════════════════════════════════

export async function loadHotelsFromCloud() {
  const { data, error } = await supabase
    .from('budget_hotels')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) { console.error('loadHotels error:', error); return null }
  return data
}

export async function saveHotelToCloud(hotel) {
  const { error } = await supabase
    .from('budget_hotels')
    .upsert(hotel, { onConflict: 'id' })
  if (error) { console.error('saveHotel error:', error); return false }
  return true
}

export async function deleteHotelFromCloud(id) {
  const { error } = await supabase
    .from('budget_hotels')
    .delete()
    .eq('id', id)
  if (error) { console.error('deleteHotel error:', error); return false }
  return true
}

// ═══════════════════════════════════
// BUDGET — CONFIG (enveloppes, taux)
// ═══════════════════════════════════

export async function loadBudgetConfigFromCloud(key) {
  const { data, error } = await supabase
    .from('budget_config')
    .select('value')
    .eq('key', key)
    .single()
  if (error) return null
  return data?.value
}

export async function saveBudgetConfigToCloud(key, value) {
  const { error } = await supabase
    .from('budget_config')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
  if (error) { console.error('saveBudgetConfig error:', error); return false }
  return true
}
