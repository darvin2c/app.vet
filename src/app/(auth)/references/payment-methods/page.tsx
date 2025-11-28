import type { Metadata } from 'next'
import PageBase from '@/components/page-base'
import { PaymentMethodList } from '@/components/payment-methods/payment-method-list'
import { PaymentMethodCreateButton } from '@/components/payment-methods/payment-method-create-button'
import { SearchInput } from '@/components/ui/search-input'
import { Filters } from '@/components/ui/filters'
import { OrderBy } from '@/components/ui/order-by'
import type { FilterConfig } from '@/components/ui/filters'
import type { OrderByConfig } from '@/components/ui/order-by'
import { PaymentMethodImportButton } from '@/components/payment-methods/payment-method-import-button'
import { Enums } from '@/types/supabase.types'
import CanAccess from '@/components/ui/can-access'

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
      { field: 'payment_type', label: 'Tipo', sortable: true },
      { field: 'is_active', label: 'Activo', sortable: true },
    ],
  }

  return (
    <CanAccess resource="payment-methods" action="read">
      <PageBase
        title="Métodos de Pago"
        subtitle="Gestiona los métodos de pago disponibles"
        search={
          <SearchInput
            hasSidebarTriggerLeft
            placeholder="Buscar métodos de pago..."
            size="lg"
            suffix={
              <>
                <Filters
                  filters={filters}
                  triggerProps={{ variant: 'outline' }}
                />
                <OrderBy
                  config={orderByConfig}
                  triggerProps={{ variant: 'outline' }}
                />
                <PaymentMethodImportButton variant="outline" />
                <PaymentMethodCreateButton variant="outline" />
              </>
            }
          />
        }
      >
        <PaymentMethodList
          filterConfig={filters}
          orderByConfig={orderByConfig}
        />
      </PageBase>
    </CanAccess>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Métodos de Pago',
    description:
      'Administra los métodos de pago disponibles y su configuración para el punto de venta.',
  }
}
