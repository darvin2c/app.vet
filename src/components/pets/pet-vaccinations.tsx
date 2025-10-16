import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { CalendarDays, Syringe, User } from 'lucide-react'
import { usePetVaccinations } from '@/hooks/pets/use-pet-vaccinations'
import { Tables } from '@/types/supabase.types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { VaccinationCreateButton } from '@/components/vaccinations/vaccination-create-button'
import { VaccinationActions } from '@/components/vaccinations/vaccination-actions'

type Vaccination = Tables<'vaccinations'> & {
  medical_records: Tables<'medical_records'> | null
  staff: Tables<'staff'> | null
}

interface PetVaccinationsProps {
  petId: string
}

export function PetVaccinations({ petId }: PetVaccinationsProps) {
  const { data: vaccinations = [], isLoading } = usePetVaccinations(petId)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Vacunas</h3>
          <VaccinationCreateButton medicalRecordId="" />
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

  if (vaccinations.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Vacunas</h3>
          <VaccinationCreateButton medicalRecordId="" />
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Syringe className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              No hay vacunas registradas
            </h3>
            <p className="text-sm text-muted-foreground text-center">
              Este paciente no tiene vacunas en su historial médico.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Vacunas</h3>
        <VaccinationCreateButton medicalRecordId="" />
      </div>
      {vaccinations.map((vaccination) => (
        <Card key={vaccination.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">Vacuna</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">
                    {vaccination.medical_records?.status === 'completed'
                      ? 'Aplicada'
                      : vaccination.medical_records?.status === 'draft'
                        ? 'Borrador'
                        : 'Cancelada'}
                  </Badge>
                </div>
              </div>
              <VaccinationActions vaccination={vaccination} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Fecha de aplicación:</strong>{' '}
                  {vaccination.medical_records?.date
                    ? format(
                        new Date(vaccination.medical_records.date),
                        'PPP',
                        { locale: es }
                      )
                    : 'No especificada'}
                </span>
              </div>
              {vaccination.next_due_at && (
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Próxima dosis:</strong>{' '}
                    {format(new Date(vaccination.next_due_at), 'PPP', {
                      locale: es,
                    })}
                  </span>
                </div>
              )}
            </div>

            {vaccination.staff && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Veterinario:</strong> {vaccination.staff.full_name}
                </span>
              </div>
            )}

            {vaccination.dose && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Dosis</h4>
                  <p className="text-sm text-muted-foreground">
                    {vaccination.dose}
                  </p>
                </div>
              </>
            )}

            {vaccination.route && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Vía de administración</h4>
                  <p className="text-sm text-muted-foreground">
                    {vaccination.route}
                  </p>
                </div>
              </>
            )}

            {vaccination.site && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Sitio de aplicación</h4>
                  <p className="text-sm text-muted-foreground">
                    {vaccination.site}
                  </p>
                </div>
              </>
            )}

            {vaccination.adverse_event && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Eventos adversos</h4>
                  <p className="text-sm text-muted-foreground">
                    {vaccination.adverse_event}
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
