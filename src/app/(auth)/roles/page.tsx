import { RoleCreateButton } from '@/components/roles/role-create-button'
import { RoleList } from '@/components/roles/role-list'
import { ButtonGroup } from '@/components/ui/button-group'
import { SearchInput } from '@/components/ui/search-input'
import { OrderByConfig } from '@/types/order-by.types'
import { FilterConfig } from '@/types/filters.types'
import { OrderBy } from '@/components/ui/order-by'
import { Filters } from '@/components/ui/filters'
import PageBase from '@/components/page-base'

export default function RolesPage() {
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
      { field: 'name', label: 'Nombre', sortable: true },
      { field: 'description', label: 'Descripción', sortable: true },
      { field: 'is_active', label: 'Estado', sortable: true },
      { field: 'created_at', label: 'Fecha de creación', sortable: true },
      { field: 'updated_at', label: 'Última actualización', sortable: true },
    ],
  }

  return (
    <PageBase
      title="Roles"
      subtitle="Gestiona los roles y permisos del sistema"
      search={
        <SearchInput
          hasSidebarTriggerLeft
          placeholder="Buscar rol"
          size="lg"
          suffix={
            <ButtonGroup>
              <Filters filters={filters} />
              <OrderBy config={orderByConfig} />
              <RoleCreateButton variant={'ghost'} />
            </ButtonGroup>
          }
        />
      }
    >
      <RoleList filterConfig={filters} orderByConfig={orderByConfig} />
    </PageBase>
  )
}
