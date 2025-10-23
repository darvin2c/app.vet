'use client'

import React, { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react'
import { useTenantDetail } from '@/hooks/tenants/use-tenant-detail'
import { useTenantDelete } from '@/hooks/tenants/use-tenant-delete'
import {
  TenantDeletionSchema,
  type TenantDeletion,
} from '@/schemas/tenant-settings.schema'

export function TenantDangerZone() {
  const { data: tenant, isLoading } = useTenantDetail()
  const deleteTenant = useTenantDelete()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(TenantDeletionSchema),
    defaultValues: {
      confirmation_text: '',
      understand_consequences: false,
    },
  })

  const onSubmit: SubmitHandler<TenantDeletion> = async (data) => {
    if (!tenant) return

    try {
      await deleteTenant.mutateAsync(data.confirmation_text)
      setIsDeleteDialogOpen(false)
      form.reset()
    } catch (error) {
      console.error('Error deleting tenant:', error)
    }
  }

  if (isLoading) {
    return (
      <Card className="border-destructive">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  const confirmationText = `eliminar ${tenant?.name || 'organización'}`
  const isConfirmationValid =
    form.watch('confirmation_text') === confirmationText
  const hasAcceptedConsequences = form.watch('understand_consequences')
  const canDelete = isConfirmationValid && hasAcceptedConsequences

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

        {/* Data Impact */}
        <div className="space-y-3">
          <h4 className="font-medium">Datos que se eliminarán:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-muted rounded-lg">
              <h5 className="font-medium mb-1">Datos de Pacientes</h5>
              <p className="text-muted-foreground">
                Historiales médicos, vacunas, tratamientos
              </p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <h5 className="font-medium mb-1">Datos de Clientes</h5>
              <p className="text-muted-foreground">
                Información de contacto, mascotas
              </p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <h5 className="font-medium mb-1">Citas y Agenda</h5>
              <p className="text-muted-foreground">
                Todas las citas pasadas y futuras
              </p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <h5 className="font-medium mb-1">Datos Financieros</h5>
              <p className="text-muted-foreground">Facturas, pagos, reportes</p>
            </div>
          </div>
        </div>

        {/* Alternative Actions */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">
            ¿Consideraste estas alternativas?
          </h4>
          <div className="space-y-2 text-sm text-blue-800">
            <p>
              • <strong>Exportar datos:</strong> Descarga una copia de seguridad
              antes de eliminar
            </p>
            <p>
              • <strong>Desactivar temporalmente:</strong> Suspende la cuenta
              sin eliminar datos
            </p>
            <p>
              • <strong>Transferir propiedad:</strong> Cambia el propietario de
              la organización
            </p>
          </div>
          <div className="flex gap-2 mt-3">
            <Button variant="outline" size="sm">
              Exportar Datos
            </Button>
            <Button variant="outline" size="sm">
              Desactivar Cuenta
            </Button>
          </div>
        </div>

        {/* Delete Section */}
        <div className="space-y-4 pt-4 border-t border-destructive/20">
          <h4 className="font-medium text-destructive">
            Eliminar Organización
          </h4>

          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar Organización Permanentemente
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-destructive">
                  ¿Estás absolutamente seguro?
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-3">
                  <p>
                    Esta acción eliminará permanentemente la organización{' '}
                    <strong>&quot;{tenant?.name}&quot;</strong> y todos sus
                    datos asociados.
                  </p>
                  <p className="text-destructive font-medium">
                    Esta acción NO se puede deshacer.
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>

              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Confirmation Checkbox */}
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="understand_consequences"
                    {...form.register('understand_consequences')}
                    className="mt-1"
                  />
                  <label htmlFor="understand_consequences" className="text-sm">
                    Entiendo que esta acción eliminará permanentemente todos los
                    datos y no se puede deshacer.
                  </label>
                </div>

                {/* Confirmation Text */}
                <Field>
                  <FieldLabel htmlFor="confirmation_text">
                    Para confirmar, escribe:{' '}
                    <code className="bg-muted px-1 rounded">
                      {confirmationText}
                    </code>
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id="confirmation_text"
                      {...form.register('confirmation_text')}
                      placeholder={confirmationText}
                      className="font-mono"
                    />
                    <FieldError
                      errors={[form.formState.errors.confirmation_text]}
                    />
                  </FieldContent>
                </Field>

                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={() => {
                      form.reset()
                      setIsDeleteDialogOpen(false)
                    }}
                  >
                    Cancelar
                  </AlertDialogCancel>
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={!canDelete || deleteTenant.isPending}
                  >
                    {deleteTenant.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Eliminando...
                      </>
                    ) : (
                      'Eliminar Permanentemente'
                    )}
                  </Button>
                </AlertDialogFooter>
              </form>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}
