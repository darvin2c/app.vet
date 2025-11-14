import type { AppliedFilter } from './types'

/**
 * Construye una consulta de Supabase con filtros aplicados
 */
export function applySupabaseFilters(query: unknown, filters: AppliedFilter[]) {
  let q: any = query as any
  if (!filters || filters.length === 0) return query

  for (const filter of filters) {
    const { field, operator, value } = filter

    switch (operator) {
      // Comparación básica
      case 'eq':
        q = q.eq(field, value)
        break
      case 'neq':
        q = q.neq(field, value)
        break
      case 'gt':
        q = q.gt(field, value)
        break
      case 'gte':
        q = q.gte(field, value)
        break
      case 'lt':
        q = q.lt(field, value)
        break
      case 'lte':
        q = q.lte(field, value)
        break

      // Patrones
      case 'like':
        q = q.like(field, String(value))
        break
      case 'ilike':
        q = q.ilike(field, String(value))
        break

      // Especiales
      case 'is': {
        // permite null/true/false
        const v = value === 'null' ? null : value
        q = q.is(field, v as any)
        break
      }
      case 'in': {
        const arr = Array.isArray(value) ? value : [value]
        q = q.in(field, arr as any)
        break
      }

      // Arrays / JSON
      case 'contains':
        q = q.contains(field, value as any)
        break
      case 'containedBy':
        q = q.containedBy(field, value as any)
        break
      case 'overlaps':
        q = q.overlaps(field, value as any)
        break

      // Texto completo -> usar textSearch con tipos soportados
      case 'fts': // map a plain
        q = q.textSearch(field, String(value), { type: 'plain' })
        break
      case 'plfts': // plainto_tsquery
        q = q.textSearch(field, String(value), { type: 'plain' })
        break
      case 'phfts': // phraseto_tsquery
        q = q.textSearch(field, String(value), { type: 'phrase' })
        break
      case 'wfts': // websearch_to_tsquery
        q = q.textSearch(field, String(value), { type: 'websearch' })
        break

      // Lógicos
      case 'not': {
        const { operator: op, value: v } = (value || {}) as {
          operator: string
          value: unknown
        }
        q = q.not(field, op, v as any)
        break
      }
      case 'or': {
        // `value` debe ser la expresión PostgREST, ej: 'status.eq.active,age.gte.18'
        q = q.or(String(value))
        break
      }
      case 'and': {
        // No existe .and(), usar .or con grupo and(...)
        q = q.or(`and(${String(value)})`)
        break
      }

      // Rangos especiales → usar .filter
      case 'sl': // <<
      case 'sr': // >>
      case 'nxl': // &>
      case 'nxr': // &<
      case 'adj': // -|-
        q = q.filter(field, operator as any, value as any)
        break

      default:
        // fallback seguro
        q = q.filter(field, operator as any, value as any)
    }
  }

  return q
}
