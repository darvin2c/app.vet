import { ProductCategorySelect } from '@/components/product-categories/product-category-select'
import { ProductUnitSelect } from '@/components/product-units/product-unit-select'
import { ServiceImportButton } from '@/components/services/service-import-button'
import { ServiceCreateButton } from '@/components/services/service-create-button'
import { ServiceList } from '@/components/services/service-list'
import { SearchInput } from '@/components/ui/search-input'
import { OrderByConfig } from '@/components/ui/order-by'
import { FilterConfig } from '@/components/ui/filters'
import { OrderBy } from '@/components/ui/order-by'
import { Filters } from '@/components/ui/filters'
import PageBase from '@/components/page-base'

export default function ServicesPage() {
  // Configuración de filtros
  const filters: FilterConfig[] = [
    {
      field: 'is_active',
      label: 'Estado',
      placeholder: 'Selecciona estado',
      operator: 'eq',
    },
    {
      field: 'category_id',
      label: 'Categoría',
      operator: 'eq',
      component: ProductCategorySelect,
    },
    {
      field: 'unit_id',
      label: 'Unidad',
      operator: 'eq',
      component: ProductUnitSelect,
    },
    {
      field: 'created_at',
      label: 'Fecha de creación',
      placeholder: 'Selecciona rango de fechas',
      operator: 'gte',
    },
    {
      field: 'updated_at',
      label: 'Fecha de actualización',
      placeholder: 'Selecciona rango de fechas',
      operator: 'gte',
    },
  ]

  const orderByConfig: OrderByConfig = {
    columns: [
      { field: 'name', label: 'Nombre', sortable: true },
      { field: 'price', label: 'Precio', sortable: true },
      { field: 'category_id', label: 'Categoría', sortable: true },
      { field: 'unit_id', label: 'Unidad', sortable: true },
      { field: 'created_at', label: 'Fecha de creación', sortable: true },
      { field: 'is_active', label: 'Estado', sortable: true },
    ],
  }

  return (
    <PageBase
      title="Servicios"
      subtitle="Gestiona el catálogo de servicios"
      search={
        <SearchInput
          placeholder="Buscar servicio"
          size="lg"
          suffix={
            <>
              <Filters
                filters={filters}
                triggerProps={{ variant: 'outline' }}
              />
              <OrderBy
                config={orderByConfig}
                triggerProps={{ variant: 'outline' }}
              />
            </>
          }
        />
      }
      actions={
        <>
          <ServiceImportButton variant={'outline'} />
          <ServiceCreateButton variant={'default'} />
        </>
      }
    >
      <ServiceList filterConfig={filters} orderByConfig={orderByConfig} />
    </PageBase>
  )
}
