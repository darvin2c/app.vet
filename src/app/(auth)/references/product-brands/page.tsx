import { ReferencePageLayout } from '@/components/references/reference-page-layout'
import { ProductBrandList } from '@/components/product-brands/product-brand-list'
import { SearchInput } from '@/components/ui/search-input'
import { Tag } from 'lucide-react'

export default function ProductBrandsPage() {
  return (
    <ReferencePageLayout
      title="Marcas de Productos"
      subtitle="Gestiona las marcas de productos registradas en el sistema"
      icon={Tag}
      search={
        <SearchInput placeholder="Buscar marcas de productos..." size="lg" />
      }
    >
      <ProductBrandList />
    </ReferencePageLayout>
  )
}
