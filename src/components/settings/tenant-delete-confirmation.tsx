'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { Trash2 } from 'lucide-react'
import { useTenantDetail } from '@/hooks/tenants/use-tenant-detail'
import { useTenantDelete } from '@/hooks/tenants/use-tenant-delete'

export default function TenantDeleteConfirmation() {
  const { data: tenant } = useTenantDetail()
  const deleteTenant = useTenantDelete()
  const [isOpen, setIsOpen] = React.useState(false)

  const title = '¿Estás absolutamente seguro?'
  const description = (
    <div className="space-y-3">
      <p>
        Esta acción eliminará permanentemente la organización{' '}
        <strong>&quot;{tenant?.name}&quot;</strong> y todos sus datos asociados.
      </p>
      <p className="text-destructive font-medium">
        Esta acción NO se puede deshacer.
      </p>
    </div>
  )

  const handleConfirm = async () => {
    if (!tenant?.id) return
    await deleteTenant.mutateAsync(tenant.id)
  }

  return (
    <div>
      <Button
        variant="destructive"
        className="w-full"
        onClick={() => setIsOpen(true)}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Eliminar Organización Permanentemente
      </Button>

      <AlertConfirmation
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        title={title}
        description={description}
        confirmText="ELIMINAR"
        isLoading={deleteTenant.isPending}
      />
    </div>
  )
}
