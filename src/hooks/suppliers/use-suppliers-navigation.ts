import { useMemo } from 'react'
import useSupplierList from './use-supplier-list'

export default function useSuppliersNavigation(currentId: string) {
  const { data: suppliers = [], isLoading } = useSupplierList({
    orders: [
      {
        field: 'name',
        direction: 'asc',
      },
    ],
  })

  const navigation = useMemo(() => {
    if (!suppliers.length || !currentId) {
      return {
        previous: null,
        next: null,
        current: null,
        currentIndex: -1,
        total: 0,
      }
    }

    const currentIndex = suppliers.findIndex(
      (supplier) => supplier.id === currentId
    )
    const current = currentIndex >= 0 ? suppliers[currentIndex] : null
    const previous = currentIndex > 0 ? suppliers[currentIndex - 1] : null
    const next =
      currentIndex < suppliers.length - 1 ? suppliers[currentIndex + 1] : null

    return {
      previous,
      next,
      current,
      currentIndex,
      total: suppliers.length,
    }
  }, [suppliers, currentId])

  return {
    ...navigation,
    isLoading,
  }
}
