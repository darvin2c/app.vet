'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Stethoscope,
  Calendar,
  FileText,
  Paperclip,
  Package,
  Edit,
  Eye,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Tables } from '@/types/supabase.types'
import { TreatmentEdit } from './treatment-edit'
import { AttachmentCreateButton } from '@/components/attachments/attachment-create-button'

interface TreatmentQuickActionsProps {
  treatment: Tables<'treatments'>
  onViewDetails?: () => void
  compact?: boolean
}

export function TreatmentQuickActions({
  treatment,
  onViewDetails,
  compact = false,
}: TreatmentQuickActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default'
      case 'draft':
        return 'secondary'
      case 'cancelled':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-3 w-3" />
      case 'draft':
        return <Clock className="h-3 w-3" />
      case 'cancelled':
        return <XCircle className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'vaccination':
        return 'Vacunación'
      case 'surgery':
        return 'Cirugía'
      case 'grooming':
        return 'Peluquería'
      case 'hospitalization':
        return 'Hospitalización'
      case 'deworming':
        return 'Desparasitación'
      case 'boarding':
        return 'Hospedaje'
      case 'training':
        return 'Entrenamiento'
      default:
        return type || 'Sin tipo'
    }
  }

  if (compact) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-medium truncate">{getTypeLabel(treatment.treatment_type)}</h4>
                <Badge
                  variant={getStatusVariant(treatment.status)}
                  className="ml-auto"
                >
                  {getStatusIcon(treatment.status)}
                  <span className="ml-1">{treatment.status}</span>
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(treatment.treatment_date), 'dd MMM yyyy', {
                    locale: es,
                  })}
                </span>
                <span>{getTypeLabel(treatment.treatment_type)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditOpen(true)}
                  className="h-7 px-2"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </Button>

                {onViewDetails && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onViewDetails}
                    className="h-7 px-2"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Ver
                  </Button>
                )}

                <AttachmentCreateButton
                  treatmentId={treatment.id}
                  variant="outline"
                  size="sm"
                  showIcon={false}
                >
                  <Paperclip className="h-3 w-3 mr-1" />
                  Adjuntar
                </AttachmentCreateButton>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-muted-foreground" />
              {getTypeLabel(treatment.treatment_type)}
            </CardTitle>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(new Date(treatment.treatment_date), 'dd MMM yyyy', {
                  locale: es,
                })}
              </span>
              <Badge variant={getStatusVariant(treatment.status)}>
                {getStatusIcon(treatment.status)}
                <span className="ml-1">{treatment.status}</span>
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="text-sm">
            <p className="text-muted-foreground mb-2">Información del tratamiento:</p>
            <div className="space-y-1">
              <p>
                <span className="font-medium">Tipo:</span> {getTypeLabel(treatment.treatment_type)}
              </p>
              <p>
                <span className="font-medium">Estado:</span> {treatment.status}
              </p>
              <p>
                <span className="font-medium">Fecha:</span>{' '}
                {format(new Date(treatment.treatment_date), 'dd/MM/yyyy', {
                  locale: es,
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditOpen(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar Tratamiento
            </Button>

            {onViewDetails && (
              <Button variant="outline" size="sm" onClick={onViewDetails}>
                <Eye className="h-4 w-4 mr-2" />
                Ver Detalles
              </Button>
            )}

            <AttachmentCreateButton
              treatmentId={treatment.id}
              variant="outline"
              size="sm"
              showIcon={false}
            >
              <Paperclip className="h-4 w-4 mr-2" />
              Adjuntar Archivo
            </AttachmentCreateButton>

            <Button variant="outline" size="sm">
              <Package className="h-4 w-4 mr-2" />
              Agregar Producto
            </Button>
          </div>
        </div>
      </CardContent>

      <TreatmentEdit
        treatment={treatment}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </Card>
  )
}
