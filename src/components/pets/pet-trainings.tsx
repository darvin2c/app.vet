import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { CalendarDays, Target, BookOpen } from 'lucide-react'
import { useTrainingList } from '@/hooks/trainings/use-training-list'
import { Tables } from '@/types/supabase.types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

import { TrainingCreateButton } from '@/components/trainings/training-create-button'
import { TrainingActions } from '@/components/trainings/training-actions'

type Training = Tables<'trainings'>

interface PetTrainingsProps {
  petId: string
}

export function PetTrainings({ petId }: PetTrainingsProps) {
  const { data: trainings = [], isLoading } = useTrainingList(petId)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Entrenamientos</h3>
          <Skeleton className="h-9 w-40" />
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

  if (trainings.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Entrenamientos</h3>
          <TrainingCreateButton petId={petId} />
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              No hay entrenamientos registrados
            </h3>
            <p className="text-sm text-muted-foreground text-center">
              Este paciente no tiene entrenamientos en su historial.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Entrenamientos</h3>
        <TrainingCreateButton petId={petId} />
      </div>
      {trainings.map((training) => (
        <Card key={training.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">Entrenamiento</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">Entrenamiento</Badge>
                </div>
              </div>
              <TrainingActions training={training} />
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
            </div>

            {training.goal && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Objetivo
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {training.goal}
                  </p>
                </div>
              </>
            )}

            {(training.sessions_planned || training.sessions_completed) && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Progreso de Sesiones</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Sesiones planificadas:</strong>{' '}
                      {training.sessions_planned || 0}
                    </div>
                    <div>
                      <strong>Sesiones completadas:</strong>{' '}
                      {training.sessions_completed || 0}
                    </div>
                  </div>
                  {training.sessions_planned && training.sessions_completed && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min((training.sessions_completed / training.sessions_planned) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {Math.round(
                          (training.sessions_completed /
                            training.sessions_planned) *
                            100
                        )}
                        % completado
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {training.progress_notes && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Notas de Progreso</h4>
                  <p className="text-sm text-muted-foreground">
                    {training.progress_notes}
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
