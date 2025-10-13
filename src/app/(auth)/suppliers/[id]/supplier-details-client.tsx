'use client'

import { notFound } from 'next/navigation'
import useSupplierById from '@/hooks/suppliers/use-supplier-by-id'
import SupplierDetails from '@/components/suppliers/supplier-details'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'

interface SupplierDetailsClientProps {
  id: string
}

export default function SupplierDetailsClient({
  id,
}: SupplierDetailsClientProps) {
  const { data: supplier, isLoading, error } = useSupplierById(id)

  if (isLoading) {
    return <TableSkeleton />
  }

  if (error) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Error al cargar el proveedor</EmptyTitle>
          <EmptyDescription>
            Ocurrió un error al cargar la información del proveedor. Por favor,
            intenta nuevamente.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (!supplier) {
    notFound()
  }

  return <SupplierDetails supplier={supplier} />
}
