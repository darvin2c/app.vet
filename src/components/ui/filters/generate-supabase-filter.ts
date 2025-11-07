import type { AppliedFilter } from './types'

/**
 * Construye una consulta de Supabase con filtros aplicados
 */
export function applySupabaseFilters(query: any, filters: AppliedFilter[]) {
  if (!filters || filters.length === 0) return query

  for (const filter of filters) {
    const { field, operator, value } = filter as {
      field: string
      operator: string
      value: unknown
    }

    switch (operator) {
      // Comparación básica
      case 'eq':
        query = query.eq(field, value)
        break
      case 'neq':
        query = query.neq(field, value)
        break
      case 'gt':
        query = query.gt(field, value)
        break
      case 'gte':
        query = query.gte(field, value)
        break
      case 'lt':
        query = query.lt(field, value)
        break
      case 'lte':
        query = query.lte(field, value)
        break

      // Patrones
      case 'like':
        query = query.like(field, String(value))
        break
      case 'ilike':
        query = query.ilike(field, String(value))
        break

      // Especiales
      case 'is': {
        // permite null/true/false
        const v = value === 'null' ? null : value
        query = query.is(field, v as any)
        break
      }
      case 'in': {
        const arr = Array.isArray(value) ? value : [value]
        query = query.in(field, arr as any)
        break
      }

      // Arrays / JSON
      case 'contains':
        query = query.contains(field, value as any)
        break
      case 'containedBy':
        query = query.containedBy(field, value as any)
        break
      case 'overlaps':
        query = query.overlaps(field, value as any)
        break

      // Texto completo -> usar textSearch con tipos soportados
      case 'fts': // map a plain
        query = query.textSearch(field, String(value), { type: 'plain' })
        break
      case 'plfts': // plainto_tsquery
        query = query.textSearch(field, String(value), { type: 'plain' })
        break
      case 'phfts': // phraseto_tsquery
        query = query.textSearch(field, String(value), { type: 'phrase' })
        break
      case 'wfts': // websearch_to_tsquery
        query = query.textSearch(field, String(value), { type: 'websearch' })
        break

      // Lógicos
      case 'not': {
        const { operator: op, value: v } = (value || {}) as {
          operator: string
          value: unknown
        }
        query = query.not(field, op, v as any)
        break
      }
      case 'or': {
        // `value` debe ser la expresión PostgREST, ej: 'status.eq.active,age.gte.18'
        query = query.or(String(value))
        break
      }
      case 'and': {
        // No existe .and(), usar .or con grupo and(...)
        query = query.or(`and(${String(value)})`)
        break
      }

      // Rangos especiales → usar .filter
      case 'sl': // <<
      case 'sr': // >>
      case 'nxl': // &>
      case 'nxr': // &<
      case 'adj': // -|-
        query = query.filter(field, operator as any, value as any)
        break

      default:
        // fallback seguro
        query = query.filter(field, operator as any, value as any)
    }
  }

  return query
}
