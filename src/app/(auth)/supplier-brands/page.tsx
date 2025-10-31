import PageBase from '@/components/page-base'
import { SupplierBrandList } from '@/components/supplier-brands/supplier-brand-list'

export default function SupplierBrandsPage() {
  return (
    <PageBase
      title="Marcas de Proveedores"
      subtitle="Gestiona las asignaciones de marcas a proveedores"
    >
      <SupplierBrandList />
    </PageBase>
  )
}
