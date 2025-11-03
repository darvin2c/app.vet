import PageBase from '@/components/page-base'
import { AppointmentTypeList } from '@/components/appointment-types/appointment-type-list'
import { AppointmentTypeCreateButton } from '@/components/appointment-types/appointment-type-create-button'
import { SearchInput } from '@/components/ui/search-input'
import { ButtonGroup } from '@/components/ui/button-group'
import { Filters } from '@/components/ui/filters'
import { OrderBy } from '@/components/ui/order-by'
import type { FilterConfig } from '@/components/ui/filters'
import type { OrderByConfig } from '@/components/ui/order-by'

export default function AppointmentTypesPage() {
  const filters: FilterConfig[] = [
    {
      key: 'is_active',
      field: 'is_active',
      label: 'Estado',
      type: 'boolean',
      operator: 'eq',
    },
  ]

  const orderByConfig: OrderByConfig = {
    columns: [
      { field: 'name', label: 'Nombre', sortable: true },
      { field: 'duration', label: 'Duración', sortable: true },
      { field: 'created_at', label: 'Fecha de Creación', sortable: true },
    ],
  }

  return (
    <PageBase
      title="Tipos de Citas"
      subtitle="Gestiona los tipos de citas disponibles"
      search={
        <SearchInput
          hasSidebarTriggerLeft
          placeholder="Buscar tipos de citas..."
          size="lg"
          suffix={
            <ButtonGroup>
              <Filters filters={filters} />
              <OrderBy config={orderByConfig} />
              <AppointmentTypeCreateButton />
            </ButtonGroup>
          }
        />
      }
    >
      <AppointmentTypeList filterConfig={filters} orderByConfig={orderByConfig} />
    </PageBase>
  )
}
