import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { TablesInsert } from '@/types/supabase.types'
import { toast } from 'sonner'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

type CreateCustomerData = Omit<TablesInsert<'customers'>, 'tenant_id'>

export default function useCustomerCreate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: CreateCustomerData) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const { data: result, error } = await supabase
        .from('customers')
        .insert({ ...data, tenant_id: currentTenant.id })
        .select()
        .single()

      if (error) {
        throw new Error(`Error al crear cliente: ${error.message}`)
      }

      return result
    },
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'customers'],
      })

      toast.success('Cliente creado exitosamente', {
        description: `${data.first_name} ${data.last_name} ha sido registrado`,
      })
    },
    onError: (error) => {
      toast.error('Error al crear cliente', {
        description: error.message,
      })
    },
  })
}

export function useCustomerCreateBulk() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: CreateCustomerData[]) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const customerData: TablesInsert<'customers'>[] = data.map((item) => ({
        ...item,
        tenant_id: currentTenant.id,
      }))

      const { data: customers, error } = await supabase
        .from('customers')
        .insert(customerData)
        .select()

      if (error) {
        throw new Error(`Error al crear clientes: ${error.message}`)
      }

      return customers
    },
    onSuccess: (customers) => {
      // Invalidar las consultas relacionadas
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'customers'],
      })
      toast.success(`Se crearon ${customers.length} clientes exitosamente`)
    },
    onError: (error) => {
      toast.error(error.message || 'Error al crear clientes')
    },
  })
}
