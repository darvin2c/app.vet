import { OrderList } from '@/components/orders/order-list'
import { OrderCreateButton } from '@/components/orders/order-create-button'
import { SearchInput } from '@/components/ui/search-input'
import PageBase from '@/components/page-base'
import { Filters } from '@/components/ui/filters'
import { FilterConfig } from '@/components/ui/filters'
import { OrderBy } from '@/components/ui/order-by'
import { OrderByConfig } from '@/components/ui/order-by'
import { CustomerSelect } from '@/components/customers/customer-select'
import { PetSelect } from '@/components/pets/pet-select'
import CanAccess from '@/components/ui/can-access'

export default function OrdersPage() {
  // Configuración de filtros
  const filters: FilterConfig[] = [
    {
      field: 'customer_id',
      label: 'Cliente',
      operator: 'eq',
      component: CustomerSelect,
    },
    {
      field: 'pet_id',
      label: 'Mascota',
      operator: 'eq',
      component: PetSelect,
    },
    {
      field: 'currency',
      label: 'Moneda',
      placeholder: 'Selecciona moneda',
      operator: 'eq',
      options: [
        { value: 'PEN', label: 'Soles (PEN)' },
        { value: 'USD', label: 'Dólares (USD)' },
        { value: 'EUR', label: 'Euros (EUR)' },
      ],
    },
    {
      field: 'total',
      label: 'Total mínimo',
      placeholder: 'Total mínimo',
      operator: 'gte',
    },
    {
      field: 'total',
      label: 'Total máximo',
      placeholder: 'Total máximo',
      operator: 'lte',
    },
    {
      field: 'created_at',
      label: 'Fecha de creación',
      placeholder: 'Selecciona rango de fechas',
      operator: 'gte',
    },
  ]

  const orderByConfig: OrderByConfig = {
    columns: [
      { field: 'order_number', label: 'Número de Orden', sortable: true },
      { field: 'total', label: 'Total', sortable: true },
      { field: 'created_at', label: 'Fecha de Creación', sortable: true },
      { field: 'updated_at', label: 'Última Actualización', sortable: true },
    ],
  }

  return (
    <CanAccess resource="orders" action="read">
      <PageBase
        title="Órdenes de Venta"
        subtitle="Gestiona las órdenes de venta y facturación"
        search={
          <SearchInput
            hasSidebarTriggerLeft
            placeholder="Buscar por número de orden, cliente o mascota"
            
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
              </>
            }
          />
        }
        actions={<OrderCreateButton variant={'outline'} />}
      >
        <OrderList filterConfig={filters} orderByConfig={orderByConfig} />
      </PageBase>
    </CanAccess>
  )
}
