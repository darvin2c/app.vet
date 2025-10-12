'use client'

import { useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Empty } from '@/components/ui/empty'
import { Calendar, Clock, Plus } from 'lucide-react'
import {
  usePatientAppointments,
  usePatientNextAppointment,
} from '@/hooks/patients/use-patient-appointments'
import { AppointmentItem } from '@/components/appointments/appointment-item'
import { AppointmentCreate } from '@/components/appointments/appointment-create'
import { AppointmentEdit } from '@/components/appointments/appointment-edit'
import { AppointmentDelete } from '@/components/appointments/appointment-delete'
import { AppointmentWithRelations } from '@/types/appointment.types'
import { isAfter, isBefore } from 'date-fns'

export default function PatientAppointmentsPage() {
  const params = useParams()
  const patientId = params.id as string

  // Estados para modales
  const [showAppointmentCreate, setShowAppointmentCreate] = useState(false)
  const [editingAppointment, setEditingAppointment] =
    useState<AppointmentWithRelations | null>(null)
  const [deletingAppointment, setDeletingAppointment] =
    useState<AppointmentWithRelations | null>(null)

  // Hooks para obtener datos
  const { data: appointments = [], isLoading } =
    usePatientAppointments(patientId)
  const { data: nextAppointment, isLoading: loadingNext } =
    usePatientNextAppointment(patientId)

  // Separar citas en próximas e historial
  const { upcomingAppointments, pastAppointments } = useMemo(() => {
    const now = new Date()

    const upcoming = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.start_time)
      return (
        isAfter(appointmentDate, now) &&
        ['scheduled', 'confirmed'].includes(appointment.status)
      )
    })

    const past = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.start_time)
      return (
        isBefore(appointmentDate, now) ||
        ['completed', 'cancelled', 'no_show'].includes(appointment.status)
      )
    })

    return { upcomingAppointments: upcoming, pastAppointments: past }
  }, [appointments])

  // Handlers para acciones
  const handleNewAppointment = () => {
    setShowAppointmentCreate(true)
  }

  const handleEditAppointment = (appointment: AppointmentWithRelations) => {
    setEditingAppointment(appointment)
  }

  const handleDeleteAppointment = (appointment: AppointmentWithRelations) => {
    setDeletingAppointment(appointment)
  }

  const handleViewAppointment = (appointment: AppointmentWithRelations) => {
    // TODO: Implementar vista de detalles
    console.log('Ver detalles de cita:', appointment)
  }

  const handleSuccess = () => {
    // Refrescar datos después de crear/editar/eliminar
    setShowAppointmentCreate(false)
    setEditingAppointment(null)
    setDeletingAppointment(null)
  }

  // Componente de skeleton para carga
  const AppointmentsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-48 w-full" />
      ))}
    </div>
  )

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Citas</h2>
          <p className="text-muted-foreground">
            Gestiona las citas del paciente
          </p>
        </div>
        <Button onClick={handleNewAppointment}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Cita
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Próximas citas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Próximas Citas ({upcomingAppointments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <AppointmentsSkeleton />
            ) : upcomingAppointments.length === 0 ? (
              <Empty>
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">
                    No hay citas programadas
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Este paciente no tiene citas futuras programadas.
                  </p>
                  <Button onClick={handleNewAppointment} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Programar Cita
                  </Button>
                </div>
              </Empty>
            ) : (
              <div className="space-y-2">
                {upcomingAppointments.map((appointment) => (
                  <AppointmentItem
                    key={appointment.id}
                    appointment={appointment}
                    onEdit={handleEditAppointment}
                    onDelete={handleDeleteAppointment}
                    onView={handleViewAppointment}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Historial de citas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Historial de Citas ({pastAppointments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <AppointmentsSkeleton />
            ) : pastAppointments.length === 0 ? (
              <Empty>
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">
                    No hay citas anteriores
                  </h3>
                  <p className="text-muted-foreground">
                    Este paciente no tiene historial de citas registradas.
                  </p>
                </div>
              </Empty>
            ) : (
              <div className="space-y-2">
                {pastAppointments.map((appointment) => (
                  <AppointmentItem
                    key={appointment.id}
                    appointment={appointment}
                    onEdit={handleEditAppointment}
                    onDelete={handleDeleteAppointment}
                    onView={handleViewAppointment}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modales */}
      <AppointmentCreate
        open={showAppointmentCreate}
        onOpenChange={setShowAppointmentCreate}
        defaultPatientId={patientId}
      />

      {editingAppointment && (
        <AppointmentEdit
          open={!!editingAppointment}
          onOpenChange={(open) => !open && setEditingAppointment(null)}
          appointment={editingAppointment}
        />
      )}

      {deletingAppointment && (
        <AppointmentDelete
          open={!!deletingAppointment}
          onOpenChange={(open) => !open && setDeletingAppointment(null)}
          appointment={deletingAppointment}
        />
      )}
    </div>
  )
}
