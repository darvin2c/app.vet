import PageBase from '@/components/page-base'
import { ProductBrandList } from '@/components/product-brands/product-brand-list'
import { ProductBrandCreateButton } from '@/components/product-brands/product-brand-create-button'

export default function ProductBrandsPage() {
  return (
    <PageBase
      title="Marcas de Productos"
      subtitle="Gestiona las marcas de productos registradas en el sistema"
    >
      <ProductBrandList />
    </PageBase>
  )
}
