'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { CustomerCreate } from './customer-create'
import { Tables } from '@/types/supabase.types'
import CanAccess from '@/components/ui/can-access'

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
    <CanAccess resource="customers" action="create">
      <ResponsiveButton
        icon={Plus}
        onClick={() => setShowCreate(true)}
        {...props}
      >
        {children || 'Nuevo'}
      </ResponsiveButton>

      <CustomerCreate
        open={showCreate}
        onOpenChange={setShowCreate}
        onCustomerCreated={onSuccess}
      />
    </CanAccess>
  )
}
