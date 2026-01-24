import { PaymentList } from '@/components/payments/payment-list'
import { PaymentCreateButton } from '@/components/payments/payment-create-button'
import { PaymentImportButton } from '@/components/payments/payment-import-button'
import { SearchInput } from '@/components/ui/search-input'
import PageBase from '@/components/page-base'
import { Filters, FilterConfig } from '@/components/ui/filters'
import { OrderBy } from '@/components/ui/order-by'
import { OrderByConfig } from '@/components/ui/order-by'
import CanAccess from '@/components/ui/can-access'

export default function PaymentsPage() {
  // Configuración de filtros
  const filters: FilterConfig[] = [
    {
      field: 'payment_method_id',
      label: 'Método de Pago',
      placeholder: 'Selecciona método',
      operator: 'eq',
      options: [], // Se llenarían desde la base de datos
    },
    {
      field: 'payment_date',
      label: 'Fecha de Pago',
      placeholder: 'Selecciona rango de fechas',
      operator: 'gte',
    },
    {
      field: 'amount',
      label: 'Monto',
      placeholder: 'Monto mínimo',
      operator: 'gte',
    },
  ]

  const orderByConfig: OrderByConfig = {
    columns: [
      { field: 'payment_date', label: 'Fecha de Pago', sortable: true },
      { field: 'amount', label: 'Monto', sortable: true },
      {
        field: 'payment_methods.name',
        label: 'Método de Pago',
        sortable: true,
      },
      { field: 'customers.first_name', label: 'Cliente', sortable: true },
      { field: 'orders.order_number', label: 'Orden', sortable: true },
      { field: 'created_at', label: 'Fecha de Registro', sortable: true },
    ],
  }

  return (
    <CanAccess resource="payments" action="read">
      <PageBase
        title="Pagos"
        subtitle="Gestiona los pagos de tus clientes"
        search={
          <SearchInput
            placeholder="Buscar pago por referencia, notas o cliente"
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
            <PaymentImportButton variant="outline" />
            <PaymentCreateButton variant="default" />
          </>
        }
      >
        <PaymentList filterConfig={filters} orderByConfig={orderByConfig} />
      </PageBase>
    </CanAccess>
  )
}
