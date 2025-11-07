import { AppliedSort } from './types'

/**
 * Aplica ordenamientos de Supabase a la consulta usando AppliedSort
 */
export function applySupabaseSort(query: any, sorts: AppliedSort[]) {
  if (!Array.isArray(sorts) || sorts.length === 0) return query

  sorts.forEach((order) => {
    if (order.foreignTable) {
      // Para tablas foráneas, Supabase soporta order con table
      query = query.order(order.field, {
        ascending: order.direction === 'asc',
        foreignTable: order.foreignTable,
      } as any)
    } else {
      query = query.order(order.field, {
        ascending: order.direction === 'asc',
      })
    }
  })

  return query
}
