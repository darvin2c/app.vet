import type { PostgrestFilterBuilder } from '@supabase/postgrest-js'
import type { Database } from '@/types/supabase.types'
import type { AppliedFilter } from './types'

/**
 * Construye una consulta de Supabase con filtros aplicados
 */
export function applySupabaseFilters<
  T extends keyof Database['public']['Tables'],
>(
  query: PostgrestFilterBuilder<
    Database['public']['Tables'][T]['Row'],
    T,
    Database['public']['Tables'][T]['Row'],
    T
  >,
  filters: AppliedFilter[]
) {
  if (!filters || filters.length === 0) return query

  for (const filter of filters) {
    const { field, operator, value } = filter as {
      field: keyof Database['public']['Tables'][T]['Row'] & string
      operator: string
      value: any
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
        query = query.like(field, value)
        break
      case 'ilike':
        query = query.ilike(field, value)
        break

      // Especiales
      case 'is': {
        // permite null/true/false
        query = query.is(field, value === 'null' ? null : value)
        break
      }
      case 'in': {
        const arr = Array.isArray(value) ? value : [value]
        query = query.in(field, arr)
        break
      }

      // Arrays / JSON
      case 'contains':
        query = query.contains(field, value)
        break // cs
      case 'containedBy':
        query = query.containedBy(field, value)
        break // cd
      case 'overlaps':
        query = query.overlaps(field, value)
        break // ov

      // Texto completo -> usar textSearch
      case 'fts': // to_tsquery (raw)
        query = query.textSearch(field, value, { type: 'raw' })
        break
      case 'plfts': // plainto_tsquery
        query = query.textSearch(field, value, { type: 'plain' })
        break
      case 'phfts': // phraseto_tsquery
        query = query.textSearch(field, value, { type: 'phrase' })
        break
      case 'wfts': // websearch_to_tsquery
        query = query.textSearch(field, value, { type: 'websearch' })
        break

      // Lógicos
      case 'not': {
        // value debe traer { operator, value }
        // p.ej: { operator: 'is', value: null }  -> NOT (col IS NULL)
        const { operator: op, value: v } = value as {
          operator: string
          value: any
        }
        query = query.not(field, op, v)
        break
      }
      case 'or': {
        // `value` debe ser la expresión PostgREST, ej:
        // 'status.eq.active,age.gte.18'
        query = query.or(value as string)
        break
      }
      // No existe .and(), AND se logra encadenando o usando expresiones en .or('and(...)')
      case 'and': {
        // Soporte opcional: usa .or con grupo and(...)
        // value: string con la expresión interna, ej: 'age.gte.18,score.gt.100'
        query = query.or(`and(${String(value)})`)
        break
      }

      // Rangos y operadores “raros” → usar .filter
      case 'sl': // <<  estrictamente a la izquierda
      case 'sr': // >>  estrictamente a la derecha
      case 'nxl': // &>  no se extiende a la izquierda
      case 'nxr': // &<  no se extiende a la derecha
      case 'adj': // -|- adyacente
      case 'cs': // alias contains
      case 'cd': // alias containedBy
      case 'ov': // alias overlaps
      case 'isdistinct': // IS DISTINCT FROM
      case 'match': // ~
      case 'imatch': // ~*
        query = query.filter(field, operator as any, value)
        break

      default:
        // fallback seguro: usa .filter() crudo
        query = query.filter(field, operator as any, value)
    }
  }

  return query
}
