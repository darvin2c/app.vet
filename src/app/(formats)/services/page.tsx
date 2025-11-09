'use client'

import PageBase from '@/components/page-base'
import { SearchInput } from '@/components/ui/search-input'
import { ButtonGroup } from '@/components/ui/button-group'
import { Filters } from '@/components/ui/filters'
import { OrderBy } from '@/components/ui/order-by'
import { ServiceCreateButton } from '@/components/services/service-create-button'
import { ServicesList } from '@/components/services/services-list'
import { FilterConfig } from '@/components/ui/filters/types'
import { OrderByConfig } from '@/components/ui/order-by/types'

export default function ServicesPage() {
  const filters: FilterConfig[] = [
    {
      field: 'is_active',
      label: 'Estado',
      operator: 'eq',
      options: [
        { value: 'true', label: 'Activo' },
        { value: 'false', label: 'Inactivo' },
      ],
    },
    {
      field: 'category_id',
      label: 'Categoría',
      operator: 'eq',
      options: [], // Se llenará dinámicamente
    },
    {
      field: 'brand_id',
      label: 'Marca',
      operator: 'eq',
      options: [], // Se llenará dinámicamente
    },
  ]

  const orderByConfig: OrderByConfig = {
    columns: [
      { field: 'name', label: 'Nombre' },
      { field: 'price', label: 'Precio' },
      { field: 'cost', label: 'Costo' },
      { field: 'created_at', label: 'Fecha de creación' },
      { field: 'updated_at', label: 'Última actualización' },
    ],
  }

  return (
    <PageBase
      title="Servicios"
      subtitle="Administra los servicios de tu negocio"
      search={
        <SearchInput
          hasSidebarTriggerLeft
          placeholder="Buscar servicios..."
          size="lg"
          suffix={
            <ButtonGroup>
              <Filters filters={filters} />
              <OrderBy config={orderByConfig} />
              <ServiceCreateButton />
            </ButtonGroup>
          }
        />
      }
    >
      <ServicesList filterConfig={filters} orderByConfig={orderByConfig} />
    </PageBase>
  )
}
