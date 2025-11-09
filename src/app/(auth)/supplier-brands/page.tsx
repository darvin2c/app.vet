import PageBase from '@/components/page-base'
import CanAccess from '@/components/ui/can-access'
import { SupplierBrandList } from '@/components/supplier-brands/supplier-brand-list'

export default function SupplierBrandsPage() {
  return (
    <CanAccess resource="supplier-brands" action="read">
      <PageBase
        title="Marcas de Proveedores"
        subtitle="Gestiona las asignaciones de marcas a proveedores"
      >
        <SupplierBrandList />
      </PageBase>
    </CanAccess>
  )
}
