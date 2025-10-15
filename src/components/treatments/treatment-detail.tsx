'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AttachmentList } from '@/components/attachments/attachment-list'
import { AttachmentCreateButton } from '@/components/attachments/attachment-create-button'
import { TreatmentEdit } from './treatment-edit'
import {
  Calendar,
  User,
  FileText,
  Stethoscope,
  Edit,
  Paperclip,
  Activity,
  Clock,
} from 'lucide-react'

import { Tables } from '@/types/supabase.types'

interface TreatmentDetailProps {
  treatment: Tables<'treatments'>
  petName?: string
  vetName?: string
}

export function TreatmentDetail({
  treatment,
  petName,
  vetName,
}: TreatmentDetailProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado'
      case 'draft':
        return 'Borrador'
      case 'cancelled':
        return 'Cancelado'
      default:
        return status
    }
  }

  const getTreatmentTypeText = (type: string) => {
    switch (type) {
      case 'consultation':
        return 'Consulta'
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
        return type
    }
  }

  return (
    <div className="space-y-6">
      {/* Header del tratamiento */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl">{getTreatmentTypeText(treatment.treatment_type)}</CardTitle>
                <Badge className={getStatusColor(treatment.status)}>
                  {getStatusText(treatment.status)}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Stethoscope className="h-4 w-4" />
                  {getTreatmentTypeText(treatment.treatment_type)}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(treatment.treatment_date), 'PPP', {
                    locale: es,
                  })}
                </div>
                {vetName && (
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {vetName}
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditDialog(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">
                Mascota
              </h4>
              <p className="text-sm">{petName || treatment.pet_id}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">
                Veterinario
              </h4>
              <p className="text-sm">{vetName || treatment.vet_id}</p>
            </div>
          </div>

          <Separator />

          {/* Timestamps */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Creado:{' '}
              {format(new Date(treatment.created_at), 'PPp', { locale: es })}
            </div>
            {treatment.updated_at !== treatment.created_at && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Actualizado:{' '}
                {format(new Date(treatment.updated_at), 'PPp', { locale: es })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs para contenido adicional */}
      <Tabs defaultValue="attachments" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="attachments" className="flex items-center gap-2">
            <Paperclip className="h-4 w-4" />
            Archivos médicos
          </TabsTrigger>
          <TabsTrigger value="items">Productos/Servicios</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="attachments" className="space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Archivos médicos</CardTitle>
                <AttachmentCreateButton
                  treatmentId={treatment.id}
                  variant="outline"
                  size="sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              <AttachmentList
                treatmentId={treatment.id}
                showFilters={false}
                compact
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Productos y servicios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>
                  Los productos y servicios del tratamiento aparecerán aquí.
                </p>
                <p className="text-sm mt-2">
                  Esta funcionalidad se integrará próximamente.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Historial de cambios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>El historial de cambios del tratamiento aparecerá aquí.</p>
                <p className="text-sm mt-2">
                  Esta funcionalidad se integrará próximamente.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de edición */}
      <TreatmentEdit
        treatment={treatment}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />
    </div>
  )
}
