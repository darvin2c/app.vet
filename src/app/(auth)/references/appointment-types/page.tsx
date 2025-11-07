import { AppointmentTypeImportButton } from '@/components/appointment-types/appointment-type-import-button'
import { AppointmentTypeCreateButton } from '@/components/appointment-types/appointment-type-create-button'
import { AppointmentTypeList } from '@/components/appointment-types/appointment-type-list'
import type { FilterConfig } from '@/components/ui/filters'
import type { OrderByConfig } from '@/components/ui/order-by'
import { SearchInput } from '@/components/ui/search-input'
import { ButtonGroup } from '@/components/ui/button-group'
import PageBase from '@/components/page-base'
import { Filters } from '@/components/ui/filters'
import { OrderBy } from '@/components/ui/order-by'
import type { Metadata } from 'next'

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
      { field: 'duration_minutes', label: 'Duración', sortable: true },
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
              <Filters
                filters={filters}
                triggerProps={{
                  variant: 'ghost',
                }}
              />
              <OrderBy
                config={orderByConfig}
                triggerProps={{
                  variant: 'ghost',
                }}
              />
              <AppointmentTypeImportButton variant="ghost" />
              <AppointmentTypeCreateButton variant="ghost" />
            </ButtonGroup>
          }
        />
      }
    >
      <AppointmentTypeList
        filterConfig={filters}
        orderByConfig={orderByConfig}
      />
    </PageBase>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Tipos de Citas',
    description:
      'Gestiona y organiza los tipos de citas disponibles para la atención veterinaria.',
  }
}
