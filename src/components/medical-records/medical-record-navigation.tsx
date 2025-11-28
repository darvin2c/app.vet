'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Stethoscope,
  FileText,
  Package,
  Paperclip,
  Calendar,
  Activity,
  ClipboardList,
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Tables } from '@/types/supabase.types'
import { MedicalRecordActions } from './medical-record-actions'
import { AttachmentList } from '@/components/attachments/attachment-list'
import { AttachmentCreateButton } from '@/components/attachments/attachment-create-button'

interface MedicalRecordNavigationProps {
  medicalRecord: Tables<'clinical_records'>
  petName?: string
  vetName?: string
}

export function MedicalRecordNavigation({
  medicalRecord,
  petName,
  vetName,
}: MedicalRecordNavigationProps) {
  const [activeTab, setActiveTab] = useState('overview')

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

  return (
    <div className="space-y-6">
      {/* Header del registro médico */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" />
                    {getTypeLabel(medicalRecord.record_type)}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(medicalRecord.record_date), 'PPP', {
                        locale: es,
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="h-4 w-4" />
                      {getTypeLabel(medicalRecord.record_type)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge>{getTypeLabel(medicalRecord.record_type)}</Badge>
              <MedicalRecordActions medicalRecord={medicalRecord} />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Navegación por pestañas */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Resumen
          </TabsTrigger>
          <TabsTrigger value="attachments" className="flex items-center gap-2">
            <Paperclip className="h-4 w-4" />
            Archivos
          </TabsTrigger>
          <TabsTrigger value="items" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Items
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Notas
          </TabsTrigger>
        </TabsList>

        {/* Contenido de las pestañas */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Fecha del Registro
                  </label>
                  <p className="text-sm">
                    {format(new Date(medicalRecord.record_date), 'PPP', {
                      locale: es,
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Tipo de Registro Médico
                  </label>
                  <p className="text-sm">
                    {getTypeLabel(medicalRecord.record_type)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Estado
                  </label>
                  <div className="mt-1">
                    <Badge>{getTypeLabel(medicalRecord.record_type)}</Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Veterinario
                  </label>
                  <p className="text-sm">
                    {medicalRecord.vet_id || 'No asignado'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attachments" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2">
                <Paperclip className="h-5 w-5" />
                Archivos Médicos
              </CardTitle>
              <AttachmentCreateButton medicalRecordId={medicalRecord.id} />
            </CardHeader>
            <CardContent>
              <AttachmentList
                medicalRecordId={medicalRecord.id}
                showFilters={true}
                compact={false}
                showCreateButton={false}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Items del Registro Médico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4" />
                <p>Los items del registro médico aparecerán aquí</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Notas del Registro Médico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4" />
                <p>Las notas del registro médico aparecerán aquí</p>
                <p className="text-sm mt-2">
                  Esta funcionalidad se integrará próximamente.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
