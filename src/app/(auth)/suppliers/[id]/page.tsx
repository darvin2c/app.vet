import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import PageBase from '@/components/page-base'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import SupplierDetailsClient from './supplier-details-client'

interface SupplierPageProps {
  params: {
    id: string
  }
}

export default function SupplierPage({ params }: SupplierPageProps) {
  if (!params.id) {
    notFound()
  }

  return (
    <PageBase
      breadcrumbs={[
        { label: 'Proveedores', href: '/suppliers' },
        { label: 'Detalle' },
      ]}
    >
      <Suspense fallback={<TableSkeleton />}>
        <SupplierDetailsClient id={params.id} />
      </Suspense>
    </PageBase>
  )
}
