import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Stethoscope, Calendar, User, FileText, Paperclip } from 'lucide-react'
import { Tables } from '@/types/supabase.types'
import { TreatmentCreateButton } from '@/components/treatments/treatment-create-button'
import { TreatmentActions } from '@/components/treatments/treatment-actions'
import { AttachmentList } from '@/components/attachments/attachment-list'
import { AttachmentCreateButton } from '@/components/attachments/attachment-create-button'

interface PetTreatment extends Tables<'treatments'> {
  veterinarian?: {
    first_name: string
    last_name: string
  }
}

interface PetTreatmentsListProps {
  treatments: PetTreatment[]
  isLoading: boolean
  petId: string
}

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

const getStatusLabel = (status: string) => {
  return status || 'Sin estado'
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

export function PetTreatmentsList({
  treatments,
  isLoading,
  petId,
}: PetTreatmentsListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Historial de Tratamientos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded" />
                <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (treatments.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Historial de Tratamientos
          </CardTitle>
          <TreatmentCreateButton />
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Stethoscope className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">
              No hay tratamientos registrados
            </h3>
            <p className="text-muted-foreground">
              Los tratamientos aparecerán aquí una vez que sean registrados.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5" />
          Historial de Tratamientos
        </CardTitle>
        <TreatmentCreateButton />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {treatments.map((treatment) => (
            <Card key={treatment.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-semibold">{treatment.reason}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(treatment.treatment_date), 'PPP', {
                          locale: es,
                        })}
                      </div>
                      {treatment.veterinarian && (
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {treatment.veterinarian.first_name}{' '}
                          {treatment.veterinarian.last_name}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusVariant(treatment.status)}>
                      {getStatusLabel(treatment.status)}
                    </Badge>
                    <TreatmentActions treatment={treatment} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Tipo:</span>
                    <span>{getTypeLabel(treatment.treatment_type)}</span>
                  </div>

                  {treatment.diagnosis && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        Diagnóstico:
                      </div>
                      <p className="text-sm text-muted-foreground pl-6">
                        {treatment.diagnosis}
                      </p>
                    </div>
                  )}

                  {treatment.notes && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        Notas:
                      </div>
                      <p className="text-sm text-muted-foreground pl-6">
                        {treatment.notes}
                      </p>
                    </div>
                  )}

                  {/* Archivos adjuntos */}
                  <div className="space-y-2 border-t pt-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                        Archivos Médicos
                      </div>
                      <AttachmentCreateButton
                        treatmentId={treatment.id}
                        size="sm"
                      />
                    </div>
                    <AttachmentList
                      treatmentId={treatment.id}
                      showFilters={false}
                      compact={true}
                      showCreateButton={false}
                      maxHeight="200px"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
