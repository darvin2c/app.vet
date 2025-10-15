import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { CalendarDays, Clock, User, AlertTriangle } from 'lucide-react'
import { usePetSurgeries } from '@/hooks/pets/use-pet-surgeries'
import { Tables } from '@/types/supabase.types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

type Surgery = Tables<'surgeries'> & {
  treatments: Tables<'treatments'> | null
  staff: Tables<'staff'> | null
}

interface PetSurgeriesProps {
  petId: string
}

export function PetSurgeries({ petId }: PetSurgeriesProps) {
  const { data: surgeries = [], isLoading } = usePetSurgeries(petId)

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

  if (surgeries.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            No hay cirugías registradas
          </h3>
          <p className="text-sm text-muted-foreground text-center">
            Este paciente no tiene cirugías en su historial médico.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {surgeries.map((surgery) => (
        <Card key={surgery.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">
                  {surgery.treatments?.reason || 'Cirugía'}
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">
                    {surgery.treatments?.status === 'completed' ? 'Completada' : 
                     surgery.treatments?.status === 'cancelled' ? 'Cancelada' : 'Programada'}
                  </Badge>
                </div>
                <Badge variant="secondary">
                  {surgery.treatments?.treatment_type || 'Cirugía'}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Fecha:</strong>{' '}
                  {surgery.treatments?.treatment_date
                    ? format(new Date(surgery.treatments.treatment_date), 'PPP', { locale: es })
                    : 'No especificada'}
                </span>
              </div>
              {surgery.duration_min && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Duración:</strong> {surgery.duration_min} minutos
                  </span>
                </div>
              )}
              {surgery.staff && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Cirujano:</strong> {surgery.staff.full_name}
                  </span>
                </div>
              )}
            </div>

            {surgery.surgeon_notes && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Notas del Cirujano</h4>
                  <p className="text-sm text-muted-foreground">{surgery.surgeon_notes}</p>
                </div>
              </>
            )}

            {surgery.complications && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2 text-destructive">Complicaciones</h4>
                  <p className="text-sm text-muted-foreground">{surgery.complications}</p>
                </div>
              </>
            )}

            {surgery.treatments?.notes && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Notas del Tratamiento</h4>
                  <p className="text-sm text-muted-foreground">{surgery.treatments.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}