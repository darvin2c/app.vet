'use client'

import useStaffSpecialties from '@/hooks/staff-specialties/use-staff-specialty-list'
import { StaffSpecialtyFilters } from '@/schemas/staff-specialties.schema'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import { Empty } from '@/components/ui/empty'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StaffSpecialtyActions } from './staff-specialty-actions'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { User, GraduationCap } from 'lucide-react'

interface StaffSpecialtyListProps {
  filters?: StaffSpecialtyFilters
}

export function StaffSpecialtyList({ filters }: StaffSpecialtyListProps) {
  const { data: staffSpecialties, isLoading } = useStaffSpecialties(filters)

  if (isLoading) {
    return <TableSkeleton />
  }

  if (!staffSpecialties || staffSpecialties.length === 0) {
    return (
      <Empty
        title="No hay asignaciones"
        description="No se encontraron asignaciones de especialidades con los filtros aplicados."
      />
    )
  }

  return (
    <div className="grid gap-4">
      {staffSpecialties.map((staffSpecialty) => (
        <Card key={`${staffSpecialty.staff_id}-${staffSpecialty.specialty_id}`} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                {staffSpecialty.staff?.full_name}
              </CardTitle>
              <StaffSpecialtyActions staffSpecialty={staffSpecialty} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Especialidad:</span>
                <div className="mt-1 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-green-600" />
                  <span className="font-medium">{staffSpecialty.specialties?.name}</span>
                  <Badge variant={staffSpecialty.specialties?.is_active ? 'default' : 'secondary'}>
                    {staffSpecialty.specialties?.is_active ? 'Activa' : 'Inactiva'}
                  </Badge>
                </div>
              </div>
              
              <div>
                <span className="font-medium text-muted-foreground">Estado del Staff:</span>
                <div className="mt-1">
                  <Badge variant={staffSpecialty.staff?.is_active ? 'default' : 'secondary'}>
                    {staffSpecialty.staff?.is_active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </div>
              
              {staffSpecialty.staff?.email && (
                <div>
                  <span className="font-medium text-muted-foreground">Email:</span>
                  <p className="mt-1">{staffSpecialty.staff.email}</p>
                </div>
              )}
              
              <div>
                <span className="font-medium text-muted-foreground">Asignado:</span>
                <p className="mt-1">
                  {format(new Date(staffSpecialty.created_at), 'dd/MM/yyyy', { locale: es })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}