'use client'

import { useParams } from 'next/navigation'
import { OrderList } from '@/components/orders/order-list'
import { OrderCreateButton } from '@/components/orders/order-create-button'
import { PendingBillingItems } from '@/components/orders/pending-billing-items'
import { FilterConfig } from '@/components/ui/filters'
import { OrderByConfig } from '@/components/ui/order-by'
import PageBase from '@/components/page-base'
import { usePetDetail } from '@/hooks/pets/use-pet-detail'

export default function PetOrdersPage() {
  const params = useParams()
  const petId = params.id as string

  const orderFilterConfig: FilterConfig[] = [
    {
      field: 'status',
      label: 'Estado',
      placeholder: 'Selecciona estado',
      operator: 'eq',
      options: [
        { value: 'pending', label: 'Pendiente' },
        { value: 'confirmed', label: 'Confirmada' },
        { value: 'in_progress', label: 'En Proceso' },
        { value: 'completed', label: 'Completada' },
        { value: 'cancelled', label: 'Cancelada' },
      ],
    },
  ]

  const orderOrderByConfig: OrderByConfig = {
    columns: [
      { field: 'order_number', label: 'Número de Orden', sortable: true },
      { field: 'total', label: 'Total', sortable: true },
      { field: 'created_at', label: 'Fecha de Creación', sortable: true },
    ],
  }

  const { data: pet } = usePetDetail(petId)
  const petName = pet?.name || 'Mascota'

  return (
    <PageBase
      title="Ordenes"
      subtitle="Historial de compras de la mascota"
      breadcrumbs={[
        { label: 'Mascotas', href: '/pets' },
        { label: petName, href: `/pets/${petId}` },
        { label: 'Ordenes' },
      ]}
      actions={<OrderCreateButton />}
    >
      <PendingBillingItems petId={petId} />
      <OrderList
        filterConfig={orderFilterConfig}
        orderByConfig={orderOrderByConfig}
        additionalFilters={[
          { field: 'pet_id', operator: 'eq', value: petId },
        ]}
      />
    </PageBase>
  )
}
