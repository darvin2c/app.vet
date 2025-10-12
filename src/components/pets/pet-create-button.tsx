'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PetCreate } from './pet-create'

interface PetCreateButtonProps {
  clientId?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

export function PetCreateButton({ 
  clientId, 
  variant = 'default', 
  size = 'default' 
}: PetCreateButtonProps) {
  const [showCreate, setShowCreate] = useState(false)

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setShowCreate(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Nueva Mascota
      </Button>

      <PetCreate
        open={showCreate}
        onOpenChange={setShowCreate}
        clientId={clientId}
      />
    </>
  )
}