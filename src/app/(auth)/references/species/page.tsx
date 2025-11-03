import { SpeciesList } from '@/components/species/species-list'
import { SpeciesCreateButton } from '@/components/species/species-create-button'
import PageBase from '@/components/page-base'
import { SearchInput } from '@/components/ui/search-input'
import { ButtonGroup } from '@/components/ui/button-group'
import { Filters } from '@/components/ui/filters'
import { OrderBy } from '@/components/ui/order-by'
import { FilterConfig } from '@/components/ui/filters'
import { OrderByConfig } from '@/components/ui/order-by'

export default function SpeciesPage() {
  // Configuración de filtros
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
      { field: 'is_active', label: 'Estado', sortable: true },
    ],
  }

  return (
    <PageBase
      title="Especies"
      subtitle="Gestiona las especies de animales del sistema"
      search={
        <SearchInput
          hasSidebarTriggerLeft
          placeholder="Buscar especie"
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
