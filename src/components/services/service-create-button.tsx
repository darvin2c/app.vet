'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { ServiceCreate } from './service-create'

export function ServiceCreateButton({
  children,
  variant = 'default',
  size = 'default',
  className,
}: {
  children?: React.ReactNode
  variant?:
    | 'default'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setShowCreateDialog(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        {children || 'Crear Servicio'}
      </Button>

      <ServiceCreate
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </>
  )
}
