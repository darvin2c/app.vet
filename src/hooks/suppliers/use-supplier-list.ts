import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { SupplierFilters } from '@/schemas/suppliers.schema'
import { Tables } from '@/types/supabase.types'

export default function useSuppliers(filters?: SupplierFilters) {
  return useQuery({
    queryKey: ['suppliers', filters],
    queryFn: async () => {
      let query = supabase
        .from('suppliers')
        .select('*')
        .order('created_at', { ascending: false })

      // Aplicar filtros
      if (filters?.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,contact_person.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
        )
      }



      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active)
      }

      if (filters?.created_from) {
        query = query.gte('created_at', filters.created_from)
      }

      if (filters?.created_to) {
        query = query.lte('created_at', filters.created_to)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Error al obtener proveedores: ${error.message}`)
      }

      return data as Tables<'suppliers'>[]
    },
  })
}
