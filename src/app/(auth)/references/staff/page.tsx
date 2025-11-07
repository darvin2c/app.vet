import type { Metadata } from 'next'
import PageBase from '@/components/page-base'
import { StaffList } from '@/components/staff/staff-list'
import { StaffCreateButton } from '@/components/staff/staff-create-button'
import { SearchInput } from '@/components/ui/search-input'
import { ButtonGroup } from '@/components/ui/button-group'
import { Filters } from '@/components/ui/filters'
import { OrderBy } from '@/components/ui/order-by'
import type { FilterConfig } from '@/components/ui/filters'
import type { OrderByConfig } from '@/components/ui/order-by'
import { StaffImportButton } from '@/components/staff/staff-import-button'

export default function StaffPage() {
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
      { field: 'first_name', label: 'Nombre', sortable: true },
      { field: 'last_name', label: 'Apellido', sortable: true },
      { field: 'email', label: 'Email', sortable: true },
      { field: 'created_at', label: 'Fecha de Creación', sortable: true },
    ],
  }

  return (
    <PageBase
      title="Personal"
      subtitle="Gestiona el personal de la clínica veterinaria"
      search={
        <SearchInput
          hasSidebarTriggerLeft
          placeholder="Buscar personal..."
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
              <StaffImportButton variant="ghost" />
              <StaffCreateButton variant="ghost" />
            </ButtonGroup>
          }
        />
      }
    >
      <StaffList filterConfig={filters} orderByConfig={orderByConfig} />
    </PageBase>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Personal',
    description:
      'Administra el personal de la clínica: información, estados y roles.',
  }
}
