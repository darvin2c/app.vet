import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { CalendarDays, Clock, AlertTriangle } from 'lucide-react'
import { useSurgeryList } from '@/hooks/surgeries/use-surgery-list'
import { Tables } from '@/types/supabase.types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

import { SurgeryCreateButton } from '@/components/surgeries/surgery-create-button'
import { SurgeryActions } from '@/components/surgeries/surgery-actions'

type Surgery = Tables<'surgeries'>

interface PetSurgeriesProps {
  petId: string
}

export function PetSurgeries({ petId }: PetSurgeriesProps) {
  const { data: surgeries = [], isLoading } = useSurgeryList(petId)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Cirugías</h3>
          <Skeleton className="h-9 w-32" />
        </div>
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
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Cirugías</h3>
          <SurgeryCreateButton petId={petId} />
        </div>
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
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Cirugías</h3>
        <SurgeryCreateButton petId={petId} />
      </div>
      {surgeries.map((surgery) => (
        <Card key={surgery.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">Cirugía</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">Cirugía</Badge>
                </div>
                <Badge variant="secondary">
                  Cirugía
                </Badge>
              </div>
              <SurgeryActions surgery={surgery} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Fecha:</strong> No especificada
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

            </div>

            {surgery.surgeon_notes && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Notas del Cirujano</h4>
                  <p className="text-sm text-muted-foreground">
                    {surgery.surgeon_notes}
                  </p>
                </div>
              </>
            )}

            {surgery.complications && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2 text-destructive">
                    Complicaciones
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {surgery.complications}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
