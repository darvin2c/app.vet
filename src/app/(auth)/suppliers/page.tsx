import { SupplierList } from '@/components/suppliers/supplier-list'
import { SupplierCreateButton } from '@/components/suppliers/supplier-create-button'
import { SupplierImportButton } from '@/components/suppliers/supplier-import-button'
import { SearchInput } from '@/components/ui/search-input'
import PageBase from '@/components/page-base'
import { Filters } from '@/components/ui/filters'
import { ButtonGroup } from '@/components/ui/button-group'
import { FilterConfig } from '@/components/ui/filters'
import { OrderBy } from '@/components/ui/order-by'
import { OrderByConfig } from '@/components/ui/order-by'
import CanAccess from '@/components/ui/can-access'

export default function SuppliersPage() {
  // Configuración de filtros
  const filters: FilterConfig[] = [
    {
      field: 'is_active',
      label: 'Estado',
      placeholder: 'Selecciona estado',
      operator: 'eq',
    },
    {
      field: 'created_at',
      label: 'Fecha de creación',
      placeholder: 'Selecciona rango de fechas',
      operator: 'gte',
    },
  ]

  const orderByConfig: OrderByConfig = {
    columns: [
      {
        field: 'name',
        label: 'Nombre',
      },
      {
        field: 'contact_person',
        label: 'Persona de contacto',
      },
      {
        field: 'created_at',
        label: 'Fecha de creación',
      },
    ],
  }

  return (
    <CanAccess resource="suppliers" action="read">
      <PageBase
        title="Proveedores"
        subtitle="Gestiona los proveedores de tu clínica veterinaria"
        search={
          <SearchInput
            hasSidebarTriggerLeft
            placeholder="Buscar proveedores..."
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
                <SupplierImportButton variant="outline" />
                <SupplierCreateButton variant="outline" />
              </>
            }
          />
        }
      >
        <SupplierList filterConfig={filters} orderByConfig={orderByConfig} />
      </PageBase>
    </CanAccess>
  )
}
