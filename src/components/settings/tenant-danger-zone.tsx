'use client'

import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'
import { useTenantDetail } from '@/hooks/tenants/use-tenant-detail'
import TenantDeleteConfirmation from './tenant-delete-confirmation'
import TenantDeactivateConfirmation from './tenant-deactivate-confirmation'
import { Loader2 } from 'lucide-react'

export function TenantDangerZone() {
  const { data: tenant, isLoading } = useTenantDetail()

  if (isLoading) {
    return (
      <Card className="border-destructive">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Zona de Peligro
        </CardTitle>
        <CardDescription>
          Las acciones en esta sección son irreversibles. Procede con extrema
          precaución.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Warning Section */}
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <h4 className="font-medium text-destructive mb-2">
            ⚠️ Advertencia Importante
          </h4>
          <ul className="text-sm text-destructive/80 space-y-1">
            <li>• Se eliminarán TODOS los datos de la organización</li>
            <li>• Se perderán todos los historiales médicos</li>
            <li>• Se eliminarán todas las citas y registros</li>
            <li>• Los usuarios perderán acceso inmediatamente</li>
            <li>• Esta acción NO se puede deshacer</li>
          </ul>
        </div>

        {/* Alternative Actions */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex">
          <div className="grow">
            <h4 className="font-medium text-blue-900 mb-2">
              ¿Consideraste estas alternativas?
            </h4>
            <div className="space-y-2 text-sm text-blue-800">
              <p>
                • <strong>Exportar datos:</strong> Descarga una copia de
                seguridad antes de eliminar
              </p>
              <p>
                • <strong>Desactivar temporalmente:</strong> Suspende la cuenta
                sin eliminar datos
              </p>
              <p>
                • <strong>Transferir propiedad:</strong> Cambia el propietario
                de la organización
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <TenantDeactivateConfirmation />
          </div>
        </div>

        {/* Delete Section */}
        <div className="space-y-4 pt-4 border-t border-destructive/20">
          <h4 className="font-medium text-destructive">
            Eliminar Organización
          </h4>
          <TenantDeleteConfirmation />
        </div>
      </CardContent>
    </Card>
  )
}
