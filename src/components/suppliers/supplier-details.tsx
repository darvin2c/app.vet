'use client'

import { Database } from '@/types/supabase.types'
import SupplierDetailsHeader from './supplier-details-header'
import SupplierDetailsTabs from './supplier-details-tabs'

type Supplier = Database['public']['Tables']['suppliers']['Row']

interface SupplierDetailsProps {
  supplier: Supplier
}

export default function SupplierDetails({ supplier }: SupplierDetailsProps) {
  return (
    <div className="space-y-6">
      <SupplierDetailsHeader supplier={supplier} />
      <SupplierDetailsTabs supplier={supplier} />
    </div>
  )
}
