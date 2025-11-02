import { UserList } from '@/components/users/user-list'
import { ButtonGroup } from '@/components/ui/button-group'
import { SearchInput } from '@/components/ui/search-input'
import { OrderByConfig } from '@/components/ui/order-by'
import { FilterConfig } from '@/types/filters.types'
import { OrderBy } from '@/components/ui/order-by'
import { Filters } from '@/components/ui/filters'
import PageBase from '@/components/page-base'

export default function UsersPage() {
  // Configuración de filtros
  const filters: FilterConfig[] = [
    {
      key: 'is_superuser',
      field: 'is_superuser',
      type: 'boolean',
      label: 'Super Administrador',
      placeholder: 'Selecciona estado',
      operator: 'eq',
    },
    {
      key: 'role_id',
      field: 'role_id',
      type: 'select',
      label: 'Rol Asignado',
      placeholder: 'Selecciona rol',
      operator: 'eq',
      options: [], // Se cargarán dinámicamente desde el hook
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
      { field: 'email', label: 'Email', sortable: true },
      { field: 'phone', label: 'Teléfono', sortable: true },
      { field: 'is_superuser', label: 'Super Admin', sortable: true },
      { field: 'created_at', label: 'Fecha de registro', sortable: true },
      { field: 'updated_at', label: 'Última actualización', sortable: true },
    ],
  }

  return (
    <PageBase
      title="Usuarios"
      subtitle="Gestiona los usuarios y sus roles en el sistema"
      search={
        <SearchInput
          hasSidebarTriggerLeft
          placeholder="Buscar usuario por nombre o email"
          size="lg"
          suffix={
            <ButtonGroup>
              <Filters filters={filters} />
              <OrderBy config={orderByConfig} />
            </ButtonGroup>
          }
        />
      }
    >
      <UserList filterConfig={filters} orderByConfig={orderByConfig} />
    </PageBase>
  )
}
