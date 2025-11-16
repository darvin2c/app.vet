import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { TablesInsert } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import useUser from '../auth/use-user'
import { toast } from 'sonner'

type CreateInvitationItem = {
  email: string
  role_id: string
  expires_at: string
  message?: string
}

export default function useInvitationCreateBulk() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()
  const { data: user } = useUser()

  return useMutation({
    mutationFn: async (items: CreateInvitationItem[]) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }
      if (!user?.id) {
        throw new Error('Usuario no autenticado')
      }

      const rows: TablesInsert<'invitations'>[] = items.map((i) => ({
        email: i.email,
        role_id: i.role_id,
        expires_at: i.expires_at,
        tenant_id: currentTenant.id,
        token: crypto.randomUUID(),
        created_by: user.id,
        status: 'pending',
        metadata: i.message ? { message: i.message } : null,
      }))

      const { data, error } = await supabase
        .from('invitations')
        .insert(rows)
        .select()

      if (error) {
        throw new Error(`Error al crear invitaciones: ${error.message}`)
      }

      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'invitations'],
      })
      toast.success(`Se crearon ${data.length} invitaciones`)
    },
    onError: (error) => {
      toast.error(error.message || 'Error al crear invitaciones')
    },
  })
}

