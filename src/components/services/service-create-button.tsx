'use client'

import { Plus } from 'lucide-react'
import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { useState } from 'react'
import { ServiceCreate } from './service-create'
import CanAccess from '@/components/ui/can-access'

export function ServiceCreateButton({
  children,
  ...props
}: ResponsiveButtonProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  return (
    <CanAccess resource="services" action="create">
      <ResponsiveButton
        icon={Plus}
        onClick={() => setShowCreateDialog(true)}
        tooltip="Crear Servicio"
        {...props}
      >
        {children || 'Crear Servicio'}
      </ResponsiveButton>

      <ServiceCreate
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </CanAccess>
  )
}
