import { PageBase } from '@/components/ui/page-base'
import { SupplierBrandList } from '@/components/supplier-brands/supplier-brand-list'
import { SupplierBrandCreateButton } from '@/components/supplier-brands/supplier-brand-create-button'

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
