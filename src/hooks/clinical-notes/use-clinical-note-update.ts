import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { TablesUpdate } from '@/types/supabase.types'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'

export function useClinicalNoteUpdate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: Omit<TablesUpdate<'clinical_notes'>, 'tenant_id'>
    }) => {
      const supabase = createClient()

      const { data: clinicalNote, error } = await supabase
        .from('clinical_notes')
        .update(data)
        .eq('id', id)
        .eq('tenant_id', currentTenant?.id!)
        .select()
        .single()

      if (error) throw error
      return clinicalNote
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'clinical_notes'],
      })
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'pet-clinical-notes'],
      })
    },
  })
}
