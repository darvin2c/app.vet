'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'
import { useTenantUpdate } from '@/hooks/tenants/use-tenant-update'
import { AlertConfirmation } from '@/components/ui/alert-confirmation'

export default function TenantIsInactive() {
  const { currentTenant } = useCurrentTenantStore()
  const isInactive = !!currentTenant && currentTenant.is_active === false
  const { mutateAsync: updateTenant, isPending } = useTenantUpdate()
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false)

  if (!isInactive) return null

  const handleReactivate = async () => {
    await updateTenant({ is_active: true })
  }

  return (
    <div className="sticky top-0 z-50 w-full bg-destructive/10 border-b border-destructive/30">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </div>
          <div className="text-sm">
            <p className="font-medium">
              Cuenta inactiva
              {currentTenant?.name ? `: "${currentTenant.name}"` : ''}
            </p>
            <p className="text-muted-foreground">
              La cuenta del tenant está deshabilitada. Reactívala para continuar
              usando la aplicación.
            </p>
          </div>
        </div>
        <div>
          <Button
            variant="destructive"
            onClick={() => setIsConfirmOpen(true)}
            disabled={isPending}
          >
            {isPending ? 'Reactivando…' : 'Reactivar'}
          </Button>
        </div>
      </div>

      <AlertConfirmation
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleReactivate}
        title="Confirmar reactivación"
        description={
          <div className="space-y-2">
            <p>
              Esta acción reactivará la cuenta del tenant
              {currentTenant?.name ? ` "${currentTenant.name}"` : ''}.
            </p>
            <p>Para confirmar, escribe la palabra requerida.</p>
          </div>
        }
        confirmText="REACTIVAR"
        isLoading={isPending}
      />
    </div>
  )
}
