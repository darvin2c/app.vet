/**
 * Aplica búsqueda de Supabase a la consulta usando AppliedPagination
 */

type FieldWithReferencedTable = {
  referencedTable: string
  fields: string[]
}

export function applySupabaseSearch(
  query: any,
  search?: string,
  fields?: string[],
  fieldWithReferencedTable?: FieldWithReferencedTable[]
) {
  if (!search || !fields) return query

  // Aplicar búsqueda en múltiples campos
  if (fields?.length) {
    query = query.or(
      fields?.map((field) => `${field}.ilike.*${search}*`).join(',')
    )
  }

  // Aplicar búsqueda en múltiples campos con tabla referenciada
  if (fieldWithReferencedTable?.length) {
    for (const item of fieldWithReferencedTable) {
      const orExpr = item.fields
        ?.map((field) => `${field}.ilike.*${search}*`)
        .join(',')

      if (orExpr && orExpr.length) {
        query = query.or(orExpr, { referencedTable: item.referencedTable })
      }
    }
  }

  return query
}
