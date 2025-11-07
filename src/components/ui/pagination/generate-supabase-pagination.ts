import { AppliedPagination } from './types'

/**
 * Aplica paginación de Supabase a la consulta usando AppliedPagination
 */
export function applySupabasePagination(
  query: any,
  pagination: AppliedPagination
) {
  if (!pagination) return query

  const { page, pageSize } = pagination

  // Validar parámetros
  if (page < 1 || pageSize < 1) {
    console.warn('Parámetros de paginación inválidos:', { page, pageSize })
    return query
  }

  // Calcular offset
  const offset = (page - 1) * pageSize

  // Aplicar límites para paginación
  query = query.range(offset, offset + pageSize - 1)

  return query
}
