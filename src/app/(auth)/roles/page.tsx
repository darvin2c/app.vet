import { RoleCreateButton } from '@/components/roles/role-create-button'
import { RoleList } from '@/components/roles/role-list'
import { ButtonGroup } from '@/components/ui/button-group'
import { SearchInput } from '@/components/ui/search-input'
import { OrderByConfig } from '@/components/ui/order-by'
import { FilterConfig } from '@/components/ui/filters'
import { OrderBy } from '@/components/ui/order-by'
import { Filters } from '@/components/ui/filters'
import PageBase from '@/components/page-base'
import CanAccess from '@/components/ui/can-access'

export default function RolesPage() {
  // Configuración de filtros
  const filters: FilterConfig[] = [
    {
      field: 'is_active',
      label: 'Estado',
      placeholder: 'Selecciona estado',
      operator: 'eq',
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
      { field: 'name', label: 'Nombre', sortable: true },
      { field: 'description', label: 'Descripción', sortable: true },
      { field: 'is_active', label: 'Estado', sortable: true },
      { field: 'created_at', label: 'Fecha de creación', sortable: true },
      { field: 'updated_at', label: 'Última actualización', sortable: true },
    ],
  }

  return (
    <CanAccess resource="roles" action="read">
      <PageBase
        title="Roles"
        subtitle="Gestiona los roles y permisos del sistema"
        search={
          <SearchInput
            hasSidebarTriggerLeft
            placeholder="Buscar rol"
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
                <RoleCreateButton variant={'outline'} />
              </>
            }
          />
        }
      >
        <RoleList filterConfig={filters} orderByConfig={orderByConfig} />
      </PageBase>
    </CanAccess>
  )
}
