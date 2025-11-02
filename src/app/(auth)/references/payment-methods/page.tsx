'use client'

import PageBase from '@/components/page-base'
import { SearchInput } from '@/components/ui/search-input'
import { ButtonGroup } from '@/components/ui/button-group'
import { Filters } from '@/components/ui/filters'
import { OrderBy } from '@/components/ui/order-by'
import { PaymentMethodList } from '@/components/payment-methods/payment-method-list'
import { PaymentMethodCreateButton } from '@/components/payment-methods/payment-method-create-button'
import { FilterConfig } from '@/types/filters.types'
import { OrderByConfig } from '@/components/ui/order-by/order-by.types'

export default function PaymentMethodsPage() {
  // Configuración de filtros
  const filters: FilterConfig[] = [
    {
      key: 'payment_type',
      field: 'payment_type',
      label: 'Tipo de Pago',
      type: 'select',
      operator: 'eq',
      options: [
        { value: 'cash', label: 'Efectivo' },
        { value: 'app', label: 'Aplicación' },
        { value: 'credit', label: 'Crédito' },
        { value: 'others', label: 'Otros' },
      ],
    },
    {
      key: 'is_active',
      field: 'is_active',
      label: 'Estado',
      type: 'select',
      operator: 'eq',
      options: [
        { value: true, label: 'Activo' },
        { value: false, label: 'Inactivo' },
      ],
    },
  ]

  const orderByConfig: OrderByConfig = {
    columns: [
      { field: 'name', label: 'Nombre' },
      { field: 'code', label: 'Código' },
      { field: 'payment_type', label: 'Tipo' },
      { field: 'sort_order', label: 'Orden' },
      { field: 'created_at', label: 'Fecha de Creación' },
    ],
  }

  return (
    <PageBase
      title="Métodos de Pago"
      subtitle="Gestiona los métodos de pago disponibles en el sistema"
      search={
        <SearchInput
          hasSidebarTriggerLeft
          placeholder="Buscar métodos de pago..."
          size="lg"
          suffix={
            <ButtonGroup>
              <Filters filters={filters} />
              <OrderBy config={orderByConfig} />
              <PaymentMethodCreateButton />
            </ButtonGroup>
          }
        />
      }
    >
      <PaymentMethodList filterConfig={filters} orderByConfig={orderByConfig} />
    </PageBase>
  )
}
