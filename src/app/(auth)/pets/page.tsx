import { PetList } from '@/components/pets/pet-list'
import { PetCreateButton } from '@/components/pets/pet-create-button'
import { PetImportButton } from '@/components/pets/pet-import-button'
import { SearchInput } from '@/components/ui/search-input'
import PageBase from '@/components/page-base'
import { Filters } from '@/components/ui/filters'
import { ButtonGroup } from '@/components/ui/button-group'
import { FilterConfig } from '@/components/ui/filters'
import { OrderBy } from '@/components/ui/order-by'
import { OrderByConfig } from '@/components/ui/order-by'
import { CustomerSelect } from '@/components/customers/customer-select'

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
      field: 'client_id',
      label: 'Cliente',
      operator: 'eq',
      component: CustomerSelect,
    },
    {
      field: 'species_id',
      label: 'Especie',
      placeholder: 'Selecciona especie',
      operator: 'eq',
      options: [
        { value: 'perro', label: 'Perro' },
        { value: 'gato', label: 'Gato' },
        { value: 'ave', label: 'Ave' },
        { value: 'reptil', label: 'Reptil' },
        { value: 'otro', label: 'Otro' },
      ],
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
    {
      field: 'created_at',
      label: 'Fecha de registro',
      placeholder: 'Selecciona rango de fechas',
      operator: 'gte',
    },
  ]

  const orderByConfig: OrderByConfig = {
    columns: [
      { field: 'name', label: 'Nombre', sortable: true },
      { field: 'client_id', label: 'Cliente', sortable: true },
      { field: 'species_id', label: 'Especie', sortable: true },
      { field: 'sex', label: 'Género', sortable: true },
      { field: 'birth_date', label: 'Fecha de nacimiento', sortable: true },
      { field: 'is_active', label: 'Estado', sortable: true },
      { field: 'created_at', label: 'Fecha de registro', sortable: true },
    ],
  }

  return (
    <PageBase
      title="Mascotas"
      subtitle="Gestiona las mascotas registradas en el sistema"
      search={
        <SearchInput
          hasSidebarTriggerLeft
          placeholder="Buscar por nombre o microchip"
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
              <PetImportButton variant="ghost" />
              <PetCreateButton variant="ghost" />
            </ButtonGroup>
          }
        />
      }
    >
      <PetList filterConfig={filters} orderByConfig={orderByConfig} />
    </PageBase>
  )
}
