'use client'

import { useState } from 'react'
import useCustomerDelete from '@/hooks/customers/use-customer-delete'
import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { Tables } from '@/types/supabase.types'

type Customer = Tables<'customers'>

interface CustomerDeleteProps {
  customer: Customer
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomerDelete({
  customer,
  open,
  onOpenChange,
}: CustomerDeleteProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const deleteCustomer = useCustomerDelete()

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteCustomer.mutateAsync(customer.id)
      onOpenChange(false)
    } catch (error) {
      // Error ya manejado en el hook
    } finally {
      setIsDeleting(false)
    }
  }

  const fullName = `${customer.first_name} ${customer.last_name}`
  const confirmationWord = fullName.toLowerCase()

  return (
    <AlertConfirmation
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Eliminar Cliente"
      description={`Esta acción eliminará permanentemente al cliente ${fullName} y todos sus datos asociados.`}
      confirmText={confirmationWord}
      onConfirm={handleDelete}
      isLoading={isDeleting}
    />
  )
}
