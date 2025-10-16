import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Stethoscope, Calendar, User, FileText, Paperclip } from 'lucide-react'
import { Tables } from '@/types/supabase.types'
import { MedicalRecordCreateButton } from '@/components/medical-records/medical-record-create-button'
import { MedicalRecordActions } from '@/components/medical-records/medical-record-actions'
import { AttachmentList } from '@/components/attachments/attachment-list'
import { AttachmentCreateButton } from '@/components/attachments/attachment-create-button'

interface PetMedicalRecord extends Tables<'medical_records'> {
  veterinarian?: {
    first_name: string
    last_name: string
  }
}

interface PetMedicalRecordsListProps {
  medicalRecords: PetMedicalRecord[]
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

export function PetMedicalRecordsList({
  medicalRecords,
  isLoading,
  petId,
}: PetMedicalRecordsListProps) {
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

  if (medicalRecords.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Historial de Tratamientos
          </CardTitle>
          <MedicalRecordCreateButton petId={petId} />
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
        <MedicalRecordCreateButton petId={petId} />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {medicalRecords.map((medicalRecord) => (
            <Card key={medicalRecord.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-semibold">
                      {getTypeLabel(medicalRecord.type)}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(medicalRecord.date), 'PPP', {
                          locale: es,
                        })}
                      </div>
                      {medicalRecord.veterinarian && (
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {medicalRecord.veterinarian.first_name}{' '}
                          {medicalRecord.veterinarian.last_name}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusVariant(medicalRecord.status)}>
                      {getStatusLabel(medicalRecord.status)}
                    </Badge>
                    <MedicalRecordActions medicalRecord={medicalRecord} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Tipo:</span>
                    <span>{getTypeLabel(medicalRecord.type)}</span>
                  </div>

                  {/* Archivos adjuntos */}
                  <div className="space-y-2 border-t pt-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                        Archivos Médicos
                      </div>
                      <AttachmentCreateButton
                        medicalRecordId={medicalRecord.id}
                        size="sm"
                      />
                    </div>
                    <AttachmentList
                      medicalRecordId={medicalRecord.id}
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
