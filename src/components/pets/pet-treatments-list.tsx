import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { CalendarDays, Stethoscope, User, FileText } from 'lucide-react'
import { usePetTreatments } from '@/hooks/pets/use-pet-treatments'
import { Tables } from '@/types/supabase.types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

type PetTreatment = Tables<'treatments'> & {
  staff: Tables<'staff'> | null
}

interface PetTreatmentsListProps {
  petId: string
}

export function PetTreatmentsList({ petId }: PetTreatmentsListProps) {
  const { data: treatments = [], isLoading } = usePetTreatments(petId)

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (treatments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Stethoscope className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            No hay tratamientos registrados
          </h3>
          <p className="text-sm text-muted-foreground text-center">
            Este paciente no tiene tratamientos en su historial médico.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {treatments.map((treatment) => (
        <Card key={treatment.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">
                  {treatment.reason || 'Tratamiento'}
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">
                    {treatment.status === 'completed' ? 'Completado' : 
                     treatment.status === 'draft' ? 'Borrador' : 'Cancelado'}
                  </Badge>
                  {treatment.treatment_type && (
                    <Badge variant="secondary">
                      {treatment.treatment_type}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Fecha:</strong>{' '}
                  {treatment.treatment_date
                    ? format(new Date(treatment.treatment_date), 'PPP', { locale: es })
                    : 'No especificada'}
                </span>
              </div>
            </div>

            {treatment.diagnosis && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Diagnóstico</h4>
                  <p className="text-sm text-muted-foreground">{treatment.diagnosis}</p>
                </div>
              </>
            )}

            {treatment.notes && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Notas del Tratamiento
                  </h4>
                  <p className="text-sm text-muted-foreground">{treatment.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}