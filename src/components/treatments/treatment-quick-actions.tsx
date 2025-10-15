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
  const [showEdit, setShowEdit] = useState(false)

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Completado':
        return 'default'
      case 'En Progreso':
        return 'secondary'
      case 'Programado':
        return 'outline'
      case 'Cancelado':
        return 'destructive'
      case 'Borrador':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completado':
        return <CheckCircle className="h-4 w-4" />
      case 'En Progreso':
        return <Clock className="h-4 w-4" />
      case 'Programado':
        return <Calendar className="h-4 w-4" />
      case 'Cancelado':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'Consulta':
        return 'Consulta General'
      case 'Vacunación':
        return 'Vacunación'
      case 'Cirugía':
        return 'Cirugía'
      case 'Peluquería':
        return 'Peluquería'
      case 'Hospitalización':
        return 'Hospitalización'
      case 'Desparasitación':
        return 'Desparasitación'
      case 'Hospedaje':
        return 'Hospedaje'
      case 'Entrenamiento':
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
                <h4 className="font-medium truncate">{treatment.reason}</h4>
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
                  onClick={onViewDetails}
                  className="flex items-center gap-1"
                >
                  <Eye className="h-3 w-3" />
                  Ver
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEdit(true)}
                  className="flex items-center gap-1"
                >
                  <Edit className="h-3 w-3" />
                  Editar
                </Button>
                <AttachmentCreateButton
                  treatmentId={treatment.id}
                  size="sm"
                  variant="outline"
                >
                  <Paperclip className="h-3 w-3" />
                </AttachmentCreateButton>
              </div>
            </div>
          </div>
        </CardContent>

        {showEdit && (
          <TreatmentEdit
            treatment={treatment}
            open={showEdit}
            onOpenChange={setShowEdit}
          />
        )}
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              {treatment.reason}
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(new Date(treatment.treatment_date), 'PPP', {
                  locale: es,
                })}
              </div>
              <span>{getTypeLabel(treatment.treatment_type)}</span>
            </div>
          </div>
          <Badge
            variant={getStatusVariant(treatment.status)}
            className="flex items-center gap-1"
          >
            {getStatusIcon(treatment.status)}
            {treatment.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Información básica */}
        {treatment.diagnosis && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Diagnóstico
            </label>
            <p className="text-sm mt-1 p-2 bg-muted rounded">
              {treatment.diagnosis}
            </p>
          </div>
        )}

        {treatment.notes && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Notas
            </label>
            <p className="text-sm mt-1 p-2 bg-muted rounded line-clamp-3">
              {treatment.notes}
            </p>
          </div>
        )}

        {/* Acciones rápidas */}
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewDetails}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Ver Detalles
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEdit(true)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Editar
          </Button>

          <AttachmentCreateButton
            treatmentId={treatment.id}
            size="sm"
            variant="outline"
          >
            <Paperclip className="h-4 w-4" />
            Adjuntar
          </AttachmentCreateButton>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            disabled
          >
            <Package className="h-4 w-4" />
            Items
          </Button>
        </div>
      </CardContent>

      {showEdit && (
        <TreatmentEdit
          treatment={treatment}
          open={showEdit}
          onOpenChange={setShowEdit}
        />
      )}
    </Card>
  )
}
