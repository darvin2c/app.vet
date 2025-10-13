import { CustomerList } from '@/components/customers/customer-list'
import { CustomerCreateButton } from '@/components/customers/customer-create-button'
import { SearchInput } from '@/components/ui/search-input'
import PageBase from '@/components/page-base'
import { Filters } from '@/components/ui/filters'
import { ButtonGroup } from '@/components/ui/button-group'
import { FilterConfig } from '@/types/filters.types'
import { OrderBy } from '@/components/ui/order-by'
import { OrderByConfig } from '@/types/order-by.types'

export default function CustomersPage() {
  // Configuración de filtros
  const filters: FilterConfig[] = [
    {
      key: 'is_active',
      field: 'is_active',
      type: 'boolean',
      label: 'Estado',
      placeholder: 'Selecciona estado',
      operator: 'eq',
    },
    {
      key: 'created_range',
      field: 'created_at',
      type: 'dateRange',
      label: 'Fecha de registro',
      placeholder: 'Selecciona rango de fechas',
      operator: 'gte',
    },
  ]

  const orderByConfig: OrderByConfig = {
    columns: [
      { field: 'first_name', label: 'Nombre', sortable: true },
      { field: 'last_name', label: 'Apellido', sortable: true },
      { field: 'email', label: 'Email', sortable: true },
      { field: 'phone', label: 'Teléfono', sortable: true },
      { field: 'created_at', label: 'Fecha de Registro', sortable: true },
    ],
  }

  return (
    <PageBase
      title="Clientes"
      subtitle="Gestiona la información de tus clientes"
      search={
        <SearchInput
          hasSidebarTrigger
          placeholder="Buscar cliente"
          size="lg"
          suffix={
            <ButtonGroup>
              <Filters filters={filters} />
              <OrderBy config={orderByConfig} />
              <CustomerCreateButton />
            </ButtonGroup>
          }
        />
      }
    >
      <CustomerList filterConfig={filters} orderByConfig={orderByConfig} />
    </PageBase>
  )
}
