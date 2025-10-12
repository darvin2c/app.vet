import { PageBase } from '@/components/ui/page-base'
import { SupplierList } from '@/components/suppliers/supplier-list'
import { SupplierCreateButton } from '@/components/suppliers/supplier-create-button'

export default function SuppliersPage() {
  return (
    <PageBase
      title="Proveedores"
      subtitle="Gestiona los proveedores de tu clínica veterinaria"
    >
      <SupplierList />
    </PageBase>
  )
}
