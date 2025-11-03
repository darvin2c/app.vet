import PageBase from '@/components/page-base'
import { SpeciesList } from '@/components/species/species-list'
import { SpeciesCreateButton } from '@/components/species/species-create-button'
import { SearchInput } from '@/components/ui/search-input'
import { ButtonGroup } from '@/components/ui/button-group'
import { Filters } from '@/components/ui/filters'
import { OrderBy } from '@/components/ui/order-by'
import type { FilterConfig } from '@/components/ui/filters'
import type { OrderByConfig } from '@/components/ui/order-by'

export default function SpeciesPage() {
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
      { field: 'created_at', label: 'Fecha de Creación', sortable: true },
    ],
  }

  return (
    <PageBase
      title="Especies"
      subtitle="Gestiona las especies de animales"
      search={
        <SearchInput
          hasSidebarTriggerLeft
          placeholder="Buscar especies..."
          size="lg"
          suffix={
            <ButtonGroup>
              <Filters filters={filters} />
              <OrderBy config={orderByConfig} />
              <SpeciesCreateButton />
            </ButtonGroup>
          }
        />
      }
    >
      <SpeciesList filterConfig={filters} orderByConfig={orderByConfig} />
    </PageBase>
  )
}
