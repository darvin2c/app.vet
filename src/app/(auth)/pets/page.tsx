import { PetList } from '@/components/pets/pet-list'
import { PetCreateButton } from '@/components/pets/pet-create-button'
import { SearchInput } from '@/components/ui/search-input'
import PageBase from '@/components/page-base'
import { Filters } from '@/components/ui/filters'
import { ButtonGroup } from '@/components/ui/button-group'
import { FilterConfig } from '@/types/filters.types'
import { OrderBy } from '@/components/ui/order-by'
import { OrderByConfig } from '@/types/order-by.types'
import { CustomerSelect } from '@/components/customers/customer-select'

export default function PetsPage() {
  // Configuración de filtros
  const filters: FilterConfig[] = [
    {
      key: 'is_active',
      field: 'is_active',
      type: 'boolean',
      label: 'Estado',
      placeholder: 'Selecciona estado',
      operator: 'eq',
    },
    {
      key: 'client_id',
      field: 'client_id',
      type: 'custom',
      label: 'Cliente',
      operator: 'eq',
      component: (
        <CustomerSelect
          placeholder="Selecciona cliente"
          onValueChange={() => {}}
        />
      ),
    },
    {
      key: 'species_id',
      field: 'species_id',
      type: 'select',
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
      key: 'sex',
      field: 'sex',
      type: 'select',
      label: 'Género',
      placeholder: 'Selecciona género',
      operator: 'eq',
      options: [
        { value: 'M', label: 'Macho' },
        { value: 'F', label: 'Hembra' },
      ],
    },
    {
      key: 'created_range',
      field: 'created_at',
      type: 'dateRange',
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
          hasSidebarTrigger
          placeholder="Buscar por nombre o microchip"
          size="lg"
          suffix={
            <ButtonGroup>
              <Filters filters={filters} />
              <OrderBy config={orderByConfig} />
              <PetCreateButton />
            </ButtonGroup>
          }
        />
      }
    >
      <PetList filterConfig={filters} orderByConfig={orderByConfig} />
    </PageBase>
  )
}
