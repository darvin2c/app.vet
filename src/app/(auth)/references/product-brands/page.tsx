import PageBase from '@/components/page-base'
import { ProductBrandList } from '@/components/product-brands/product-brand-list'
import { SearchInput } from '@/components/ui/search-input'
import { Tag } from 'lucide-react'

export default function ProductBrandsPage() {
  return (
    <PageBase
      title="Marcas de Productos"
      subtitle="Gestiona las marcas de productos registradas en el sistema"
      search={
        <SearchInput placeholder="Buscar marcas de productos..." size="lg" />
      }
    >
      <ProductBrandList />
    </PageBase>
  )
}
