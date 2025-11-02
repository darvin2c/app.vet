'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { CustomerCreate } from './customer-create'
import { Tables } from '@/types/supabase.types'

export type CustomerCreateButtonProps = {
  onSuccess?: (customer: Tables<'customers'>) => void
  children?: React.ReactNode
} & ResponsiveButtonProps

export function CustomerCreateButton({
  onSuccess,
  children,
  ...props
}: CustomerCreateButtonProps) {
  const [showCreate, setShowCreate] = useState(false)

  return (
    <>
      <ResponsiveButton onClick={() => setShowCreate(true)} {...props}>
        {children || (
          <>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Cliente
          </>
        )}
      </ResponsiveButton>

      <CustomerCreate
        open={showCreate}
        onOpenChange={setShowCreate}
        onCustomerCreated={onSuccess}
      />
    </>
  )
}
