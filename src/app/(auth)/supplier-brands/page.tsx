import PageBase from '@/components/page-base'
import CanAccess from '@/components/ui/can-access'
import { SupplierBrandList } from '@/components/supplier-brands/supplier-brand-list'

export default function SupplierBrandsPage() {
  return (
    <CanAccess resource="supplier-brands" action="read">
      <PageBase breadcrumbs={[{ label: 'Marcas de Proveedores' }]}>
        <SupplierBrandList />
      </PageBase>
    </CanAccess>
  )
}
