import { PetList } from '@/components/pets/pet-list'
import { PetCreateButton } from '@/components/pets/pet-create-button'
import { PetImportButton } from '@/components/pets/pet-import-button'
import { SearchInput } from '@/components/ui/search-input'
import PageBase from '@/components/page-base'
import { Filters } from '@/components/ui/filters'
import { FilterConfig } from '@/components/ui/filters'
import { OrderBy } from '@/components/ui/order-by'
import { OrderByConfig } from '@/components/ui/order-by'
import { CustomerSelect } from '@/components/customers/customer-select'
import { SpeciesSelect } from '@/components/species/species-select'
import CanAccess from '@/components/ui/can-access'

export default function PetsPage() {
  // Configuración de filtros
  const filters: FilterConfig[] = [
    {
      field: 'is_active',
      label: 'Estado',
      placeholder: 'Selecciona estado',
      operator: 'eq',
    },
    {
      field: 'customer_id',
      label: 'Cliente',
      operator: 'eq',
      component: CustomerSelect,
    },
    {
      field: 'species_id',
      label: 'Especie',
      operator: 'in',
      component: <SpeciesSelect multiple />,
    },
    {
      field: 'sex',
      label: 'Género',
      placeholder: 'Selecciona género',
      operator: 'eq',
      options: [
        { value: 'M', label: 'Macho' },
        { value: 'F', label: 'Hembra' },
      ],
    },
  ]

  const orderByConfig: OrderByConfig = {
    columns: [
      { field: 'name', label: 'Nombre', sortable: true },
      { field: 'customer_id', label: 'Cliente', sortable: true },
      { field: 'species_id', label: 'Especie', sortable: true },
      { field: 'sex', label: 'Género', sortable: true },
      { field: 'birth_date', label: 'Fecha de nacimiento', sortable: true },
      { field: 'is_active', label: 'Estado', sortable: true },
      { field: 'created_at', label: 'Fecha de registro', sortable: true },
    ],
  }

  return (
    <CanAccess resource="pets" action="read">
      <PageBase
        breadcrumbs={[{ label: 'Mascotas' }]}
        search={
          <SearchInput
            placeholder="Buscar por nombre o microchip"
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
            <PetImportButton variant="outline" />
            <PetCreateButton variant="default" />
          </>
        }
      >
        <PetList filterConfig={filters} orderByConfig={orderByConfig} />
      </PageBase>
    </CanAccess>
  )
}
