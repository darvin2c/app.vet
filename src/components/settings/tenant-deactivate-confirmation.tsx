'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { Power } from 'lucide-react'
import { useTenantDetail } from '@/hooks/tenants/use-tenant-detail'
import { useTenantUpdate } from '@/hooks/tenants/use-tenant-update'

export default function TenantDeactivateConfirmation() {
  const { data: tenant } = useTenantDetail()
  const updateTenant = useTenantUpdate()
  const [isOpen, setIsOpen] = React.useState(false)

  const title = 'Desactivar cuenta temporalmente'
  const description = (
    <div className="space-y-3">
      <p>
        Esta acción desactivará la organización{' '}
        <strong>&quot;{tenant?.name}&quot;</strong> temporalmente. No se
        eliminarán datos, pero los usuarios perderán acceso mientras esté
        inactiva.
      </p>
      <p className="text-muted-foreground">
        Puedes reactivar la cuenta más adelante desde la configuración.
      </p>
    </div>
  )

  const handleConfirm = async () => {
    if (!tenant?.id) return
    await updateTenant.mutateAsync({ is_active: false })
  }

  return (
    <div>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <Power className="h-4 w-4 mr-2" />
        Desactivar Cuenta
      </Button>

      <AlertConfirmation
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        title={title}
        description={description}
        confirmText="DESACTIVAR"
        isLoading={updateTenant.isPending}
      />
    </div>
  )
}
