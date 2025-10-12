'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { ClientCreate } from './client-create'

export function ClientCreateButton() {
  const [showCreate, setShowCreate] = useState(false)

  return (
    <>
      <ResponsiveButton onClick={() => setShowCreate(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Nuevo Cliente
      </ResponsiveButton>

      <ClientCreate open={showCreate} onOpenChange={setShowCreate} />
    </>
  )
}
