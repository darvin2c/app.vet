import PageBase from '@/components/page-base'
import { ProductMovementList } from '@/components/product-movements/product-movement-list'

export default function Kardex() {
  return (
    <PageBase
      title="Kardex"
      subtitle="Mantén un control detallado de tu inventario"
    >
      <ProductMovementList />
    </PageBase>
  )
}
