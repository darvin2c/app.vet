import type { Metadata } from 'next'
import PageBase from '@/components/page-base'
import { SpeciesList } from '@/components/species/species-list'
import { SpeciesCreateButton } from '@/components/species/species-create-button'
import { SearchInput } from '@/components/ui/search-input'
import { Filters } from '@/components/ui/filters'
import { OrderBy } from '@/components/ui/order-by'
import type { FilterConfig } from '@/components/ui/filters'
import type { OrderByConfig } from '@/components/ui/order-by'
import { SpeciesImportButton } from '@/components/species/species-import-button'
import CanAccess from '@/components/ui/can-access'

export default function SpeciesPage() {
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
    <CanAccess resource="species" action="read">
      <PageBase
        breadcrumbs={[
          { label: 'Referencias', href: '/references' },
          { label: 'Especies' },
        ]}
        search={
          <SearchInput
            placeholder="Buscar especies..."
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
            <SpeciesImportButton variant="outline" />
            <SpeciesCreateButton variant="default" />
          </>
        }
      >
        <SpeciesList filterConfig={filters} orderByConfig={orderByConfig} />
      </PageBase>
    </CanAccess>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Especies',
    description:
      'Gestiona el catálogo de especies de animales para tus registros clínicos.',
  }
}
