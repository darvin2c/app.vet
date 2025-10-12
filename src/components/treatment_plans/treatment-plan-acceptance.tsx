'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { TreatmentPlanItemStatusBadge } from './treatment-plan-status-badge'
import { TreatmentPlanWithRelations } from '@/hooks/treatment-plans/use-treatment-plans'
import { useUpdateTreatmentPlanItemStatus } from '@/hooks/treatment-plans/use-treatment-plan-items'
import { formatCurrency } from '@/lib/utils'
import {
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  AlertCircle,
  DollarSign,
} from 'lucide-react'
import { toast } from 'sonner'

interface TreatmentPlanAcceptanceProps {
  treatmentPlan: TreatmentPlanWithRelations
  onUpdate?: () => void
}

export function TreatmentPlanAcceptance({
  treatmentPlan,
  onUpdate,
}: TreatmentPlanAcceptanceProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [rejectionNotes, setRejectionNotes] = useState<Record<string, string>>(
    {}
  )
  const updateItemStatus = useUpdateTreatmentPlanItemStatus()

  const items = treatmentPlan.treatment_plan_items || []
  const pendingItems = items.filter((item) => item.status === 'planned')

  if (pendingItems.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mb-4" />
          <h4 className="text-lg font-medium mb-2">Plan Procesado</h4>
          <p className="text-muted-foreground">
            Todos los procedimientos han sido evaluados
          </p>
        </CardContent>
      </Card>
    )
  }

  const handleItemToggle = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleAcceptSelected = async () => {
    if (selectedItems.length === 0) {
      toast.error('Selecciona al menos un procedimiento para aceptar')
      return
    }

    try {
      for (const itemId of selectedItems) {
        await updateItemStatus.mutateAsync({
          id: itemId,
          status: 'accepted',
        })
      }

      setSelectedItems([])
      onUpdate?.()
      toast.success(`${selectedItems.length} procedimiento(s) aceptado(s)`)
    } catch (error) {
      toast.error('Error al aceptar procedimientos')
    }
  }

  const handleRejectItem = async (itemId: string) => {
    const notes = rejectionNotes[itemId]

    try {
      await updateItemStatus.mutateAsync({
        id: itemId,
        status: 'rejected',
        notes: notes || undefined,
      })

      setRejectionNotes((prev) => {
        const newNotes = { ...prev }
        delete newNotes[itemId]
        return newNotes
      })

      onUpdate?.()
      toast.success('Procedimiento rechazado')
    } catch (error) {
      toast.error('Error al rechazar procedimiento')
    }
  }

  const selectedTotal = selectedItems.reduce((sum, itemId) => {
    const item = items.find((i) => i.id === itemId)
    return sum + (item?.total || 0)
  }, 0)

  const totalPending = pendingItems.reduce(
    (sum, item) => sum + (item.total || 0),
    0
  )

  return (
    <div className="space-y-6">
      {/* Resumen de Aceptación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            Aceptación de Procedimientos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">
                {pendingItems.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Pendientes de Evaluación
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {selectedItems.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Seleccionados para Aceptar
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(selectedTotal)}
              </div>
              <div className="text-sm text-muted-foreground">
                Valor Seleccionado
              </div>
            </div>
          </div>

          {selectedItems.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <Button
                onClick={handleAcceptSelected}
                disabled={updateItemStatus.isPending}
                className="w-full"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Aceptar {selectedItems.length} Procedimiento(s) -{' '}
                {formatCurrency(selectedTotal)}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de Procedimientos Pendientes */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Procedimientos por Evaluar</h3>

        {pendingItems.map((item) => {
          const procedure = (item as any).procedures
          const isSelected = selectedItems.includes(item.id)

          return (
            <Card
              key={item.id}
              className={isSelected ? 'ring-2 ring-primary' : ''}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleItemToggle(item.id)}
                    />
                    <div>
                      <CardTitle className="text-base">
                        {procedure?.name || 'Procedimiento no encontrado'}
                      </CardTitle>
                      {procedure?.code && (
                        <div className="text-sm text-muted-foreground font-mono">
                          {procedure.code}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TreatmentPlanItemStatusBadge status={item.status as any} />
                    <Badge variant="outline" className="text-xs">
                      Prioridad:{' '}
                      {(item as any).priority === 1
                        ? 'Alta'
                        : (item as any).priority === 2
                          ? 'Media'
                          : 'Baja'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Detalles del Procedimiento */}
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Cantidad</div>
                      <div className="text-sm text-muted-foreground">
                        {item.quantity}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Precio Unit.</div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(item.unit_price || 0)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Total</div>
                      <div className="text-sm font-semibold text-green-600">
                        {formatCurrency(item.total || 0)}
                      </div>
                    </div>
                  </div>

                  {(procedure as any)?.description && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Descripción</div>
                        <div className="text-sm text-muted-foreground">
                          {(procedure as any).description}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Notas del Item */}
                {(item as any).description && (
                  <div className="p-3 bg-blue-50 rounded-md">
                    <div className="text-sm font-medium mb-1">Notas</div>
                    <div className="text-sm text-muted-foreground">
                      {(item as any).description}
                    </div>
                  </div>
                )}

                {/* Acciones de Rechazo */}
                <div className="pt-3 border-t">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <Textarea
                        placeholder="Motivo del rechazo (opcional)..."
                        value={rejectionNotes[item.id] || ''}
                        onChange={(e) =>
                          setRejectionNotes((prev) => ({
                            ...prev,
                            [item.id]: e.target.value,
                          }))
                        }
                        className="min-h-[60px]"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRejectItem(item.id)}
                      disabled={updateItemStatus.isPending}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Rechazar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Resumen Final */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              <strong>Total pendiente:</strong> {formatCurrency(totalPending)} •
              <strong> Seleccionado:</strong> {formatCurrency(selectedTotal)}
            </p>
            <p className="mt-1">
              Selecciona los procedimientos que deseas aceptar y haz clic en
              "Aceptar" o rechaza individualmente cada uno.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
