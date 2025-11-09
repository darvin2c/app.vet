'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'
import { useTenantUpdate } from '@/hooks/tenants/use-tenant-update'

/**
 * Bloquea toda la interfaz mientras el tenant esté inactivo.
 * - Modal sin opción de cierre mientras `currentTenant.is_active === false`.
 * - Ofrece acción para reactivar el tenant.
 * - Usa Dialog con overlay y sin botón de cerrar.
 */
export default function TenantIsInactiveModal() {
  const { currentTenant } = useCurrentTenantStore()
  const isInactive = !!currentTenant && currentTenant.is_active === false
  const { mutate: updateTenant, isPending } = useTenantUpdate()

  const handleReactivate = () => {
    if (!currentTenant?.id) return
    updateTenant({ is_active: true })
  }

  // Evita cerrar el modal por cualquier interacción externa o tecla Escape
  const preventClose = (e: Event) => {
    e.preventDefault()
  }

  return (
    <Dialog open={isInactive} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-lg"
        showCloseButton={false}
        onPointerDownOutside={preventClose}
        onInteractOutside={preventClose as any}
        onEscapeKeyDown={preventClose as any}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle>Cuenta inactiva</DialogTitle>
          </div>
          <DialogDescription>
            La cuenta del tenant
            {currentTenant?.name ? ` "${currentTenant.name}"` : ''} está
            inactiva. Para continuar usando la aplicación, debes reactivarla.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 text-sm">
          <p>
            Mientras la cuenta esté inactiva, todas las funcionalidades
            permanecerán bloqueadas.
          </p>
          <p>
            Puedes reactivar la cuenta ahora. Esta acción habilitará
            inmediatamente el acceso.
          </p>
        </div>

        <DialogFooter>
          <Button onClick={handleReactivate} disabled={isPending}>
            {isPending ? 'Reactivando…' : 'Reactivar cuenta'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
