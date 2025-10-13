import { SupplierList } from '@/components/suppliers/supplier-list'
import { SupplierCreateButton } from '@/components/suppliers/supplier-create-button'
import { SearchInput } from '@/components/ui/search-input'
import PageBase from '@/components/page-base'
import { Filters } from '@/components/ui/filters'
import { ButtonGroup } from '@/components/ui/button-group'
import { FilterConfig } from '@/types/filters.types'
import { OrderBy } from '@/components/ui/order-by'
import { OrderByConfig } from '@/types/order-by.types'

export default function SuppliersPage() {
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
      label: 'Fecha de creación',
      placeholder: 'Selecciona rango de fechas',
      operator: 'gte',
    },
  ]

  const orderByConfig: OrderByConfig = {
    columns: [
      {
        field: 'name',
        label: 'Nombre',
      },
      {
        field: 'contact_person',
        label: 'Persona de contacto',
      },
      {
        field: 'created_at',
        label: 'Fecha de creación',
      },
    ],
  }

  return (
    <PageBase
      title="Proveedores"
      subtitle="Gestiona los proveedores de tu clínica veterinaria"
      search={
        <SearchInput
          hasSidebarTrigger
          placeholder="Buscar proveedores..."
          size="lg"
          suffix={
            <ButtonGroup>
              <Filters filters={filters} />
              <OrderBy config={orderByConfig} />
              <SupplierCreateButton />
            </ButtonGroup>
          }
        />
      }
    >
      <SupplierList filterConfig={filters} orderByConfig={orderByConfig} />
    </PageBase>
  )
}
