/**
 * Aplica búsqueda de Supabase a la consulta usando AppliedPagination
 */
export function applySupabaseSearch(
  query: any,
  search?: string,
  fields?: string[]
) {
  if (!search || !fields) return query

  // Aplicar búsqueda en múltiples campos
  query = query.or(
    fields.map((field) => `${field}.ilike.%${search}%`).join(',')
  )

  return query
}
