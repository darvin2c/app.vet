'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { CustomerCreate } from './customer-create'

export function CustomerCreateButton() {
  const [showCreate, setShowCreate] = useState(false)

  return (
    <>
      <ResponsiveButton onClick={() => setShowCreate(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Nuevo Cliente
      </ResponsiveButton>

      <CustomerCreate open={showCreate} onOpenChange={setShowCreate} />
    </>
  )
}