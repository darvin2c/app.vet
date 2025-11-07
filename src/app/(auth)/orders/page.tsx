import { OrderList } from '@/components/orders/order-list'
import { OrderCreateButton } from '@/components/orders/order-create-button'
import { SearchInput } from '@/components/ui/search-input'
import PageBase from '@/components/page-base'
import { Filters } from '@/components/ui/filters'
import { ButtonGroup } from '@/components/ui/button-group'
import { FilterConfig } from '@/components/ui/filters'
import { OrderBy } from '@/components/ui/order-by'
import { OrderByConfig } from '@/components/ui/order-by'
import { CustomerSelect } from '@/components/customers/customer-select'
import { PetSelect } from '@/components/pets/pet-select'

export default function OrdersPage() {
  // Configuración de filtros
  const filters: FilterConfig[] = [
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
      { field: 'status', label: 'Estado', sortable: true },
      { field: 'total', label: 'Total', sortable: true },
      { field: 'created_at', label: 'Fecha de Creación', sortable: true },
      { field: 'updated_at', label: 'Última Actualización', sortable: true },
    ],
  }

  return (
    <PageBase
      title="Órdenes de Venta"
      subtitle="Gestiona las órdenes de venta y facturación"
      search={
        <SearchInput
          hasSidebarTriggerLeft
          placeholder="Buscar por número de orden, cliente o mascota"
          size="lg"
          suffix={
            <ButtonGroup>
              <Filters filters={filters} />
              <OrderBy config={orderByConfig} />
              <OrderCreateButton />
            </ButtonGroup>
          }
        />
      }
    >
      <OrderList filterConfig={filters} orderByConfig={orderByConfig} />
    </PageBase>
  )
}
