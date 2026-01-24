import type { Metadata } from 'next'
import PageBase from '@/components/page-base'
import { SpecialtyList } from '@/components/specialties/specialty-list'
import { SpecialtyCreateButton } from '@/components/specialties/specialty-create-button'
import { SearchInput } from '@/components/ui/search-input'
import { Filters } from '@/components/ui/filters'
import { OrderBy } from '@/components/ui/order-by'
import type { FilterConfig } from '@/components/ui/filters'
import type { OrderByConfig } from '@/components/ui/order-by'
import { SpecialtyImportButton } from '@/components/specialties/specialty-import-button'
import CanAccess from '@/components/ui/can-access'

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
    <CanAccess resource="specialties" action="read">
      <PageBase
        breadcrumbs={[
          { label: 'Referencias', href: '/references' },
          { label: 'Especialidades' },
        ]}
        search={
          <SearchInput
            placeholder="Buscar especialidades..."
            suffix={
              <>
                <Filters
                  filters={filters}
                  triggerProps={{
                    variant: 'outline',
                  }}
                />
                <OrderBy
                  config={orderByConfig}
                  triggerProps={{
                    variant: 'outline',
                  }}
                />
              </>
            }
          />
        }
        actions={
          <>
            <SpecialtyImportButton variant="outline" />
            <SpecialtyCreateButton variant="default" />
          </>
        }
      >
        <SpecialtyList filterConfig={filters} orderByConfig={orderByConfig} />
      </PageBase>
    </CanAccess>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Especialidades',
    description:
      'Configura y administra las especialidades médicas disponibles en la clínica.',
  }
}
