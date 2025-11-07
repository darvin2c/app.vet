import type { Metadata } from 'next'
import PageBase from '@/components/page-base'
import { SpecialtyList } from '@/components/specialties/specialty-list'
import { SpecialtyCreateButton } from '@/components/specialties/specialty-create-button'
import { SearchInput } from '@/components/ui/search-input'
import { ButtonGroup } from '@/components/ui/button-group'
import { Filters } from '@/components/ui/filters'
import { OrderBy } from '@/components/ui/order-by'
import type { FilterConfig } from '@/components/ui/filters'
import type { OrderByConfig } from '@/components/ui/order-by'
import { SpecialtyImportButton } from '@/components/specialties/specialty-import-button'

export default function SpecialtiesPage() {
  const filters: FilterConfig[] = [
    {
      field: 'is_active',
      label: 'Estado',
      operator: 'eq',
    },
  ]

  const orderByConfig: OrderByConfig = {
    columns: [
      { field: 'name', label: 'Nombre', sortable: true },
      { field: 'created_at', label: 'Fecha de Creación', sortable: true },
    ],
  }

  return (
    <PageBase
      title="Especialidades"
      subtitle="Gestiona las especialidades médicas disponibles"
      search={
        <SearchInput
          hasSidebarTriggerLeft
          placeholder="Buscar especialidades..."
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
              <SpecialtyImportButton variant="ghost" />
              <SpecialtyCreateButton variant="ghost" />
            </ButtonGroup>
          }
        />
      }
    >
      <SpecialtyList filterConfig={filters} orderByConfig={orderByConfig} />
    </PageBase>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Especialidades',
    description:
      'Configura y administra las especialidades médicas disponibles en la clínica.',
  }
}
