import type { Metadata } from 'next'
import PageBase from '@/components/page-base'
import { PaymentMethodList } from '@/components/payment-methods/payment-method-list'
import { PaymentMethodCreateButton } from '@/components/payment-methods/payment-method-create-button'
import { SearchInput } from '@/components/ui/search-input'
import { ButtonGroup } from '@/components/ui/button-group'
import { Filters } from '@/components/ui/filters'
import { OrderBy } from '@/components/ui/order-by'
import type { FilterConfig } from '@/components/ui/filters'
import type { OrderByConfig } from '@/components/ui/order-by'
import { PaymentMethodImportButton } from '@/components/payment-methods/payment-method-import-button'
import { Enums } from '@/types/supabase.types'

type FilterConfigWithOptions = FilterConfig & {
  options?: {
    value: Enums<'payment_type'>
    label: string
  }[]
}

export default function PaymentMethodsPage() {
  const filters: FilterConfigWithOptions[] = [
    {
      field: 'is_active',
      label: 'Estado',
      operator: 'eq',
    },
    {
      field: 'payment_type',
      label: 'Tipo de Pago',
      operator: 'in',
      options: [
        { value: 'cash', label: 'Efectivo' },
        { value: 'card', label: 'Tarjeta' },
        { value: 'transfer', label: 'Transferencia' },
        { value: 'wallet', label: 'Billetera electrónica' },
        { value: 'other', label: 'Otro' },
      ],
    },
  ]

  const orderByConfig: OrderByConfig = {
    columns: [
      { field: 'name', label: 'Nombre', sortable: true },
      { field: 'code', label: 'Código', sortable: true },
      { field: 'payment_type', label: 'Tipo', sortable: true },
      { field: 'sort_order', label: 'Orden', sortable: true },
      { field: 'created_at', label: 'Fecha de Creación', sortable: true },
    ],
  }

  return (
    <PageBase
      title="Métodos de Pago"
      subtitle="Gestiona los métodos de pago disponibles"
      search={
        <SearchInput
          hasSidebarTriggerLeft
          placeholder="Buscar métodos de pago..."
          size="lg"
          suffix={
            <ButtonGroup>
              <Filters filters={filters} triggerProps={{ variant: 'ghost' }} />
              <OrderBy
                config={orderByConfig}
                triggerProps={{ variant: 'ghost' }}
              />
              <PaymentMethodImportButton variant="ghost" />
              <PaymentMethodCreateButton variant="ghost" />
            </ButtonGroup>
          }
        />
      }
    >
      <PaymentMethodList filterConfig={filters} orderByConfig={orderByConfig} />
    </PageBase>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Métodos de Pago',
    description:
      'Administra los métodos de pago disponibles y su configuración para el punto de venta.',
  }
}
