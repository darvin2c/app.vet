import { UserList } from '@/components/users/user-list'
import { SearchInput } from '@/components/ui/search-input'
import { OrderByConfig } from '@/components/ui/order-by'
import { FilterConfig } from '@/components/ui/filters'
import { OrderBy } from '@/components/ui/order-by'
import { Filters } from '@/components/ui/filters'
import PageBase from '@/components/page-base'
import CanAccess from '@/components/ui/can-access'
import { UserInviteCreateButton } from '@/components/users/user-invite-create-button'

export default function UsersPage() {
  // Configuración de filtros
  const filters: FilterConfig[] = [
    {
      field: 'is_superuser',
      label: 'Super Administrador',
      placeholder: 'Selecciona estado',
      operator: 'eq',
    },
    {
      field: 'role_id',
      label: 'Rol Asignado',
      placeholder: 'Selecciona rol',
      operator: 'eq',
      options: [], // Se cargarán dinámicamente desde el hook
    },
    {
      field: 'created_at',
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
    <CanAccess resource="users" action="read">
      <PageBase
        breadcrumbs={[{ label: 'Usuarios' }]}
        search={
          <SearchInput
            placeholder="Buscar usuario por nombre o email"
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
        actions={<UserInviteCreateButton variant="default" />}
      >
        <UserList filterConfig={filters} orderByConfig={orderByConfig} />
      </PageBase>
    </CanAccess>
  )
}
