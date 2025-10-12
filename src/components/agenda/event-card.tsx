'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  Calendar,
  Clock,
  User,
  UserCheck,
  FileText,
  Edit,
  Trash2,
  Share2,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { AppointmentEdit } from '@/components/appointments/appointment-edit'
import { AppointmentDelete } from '@/components/appointments/appointment-delete'
import { toast } from 'sonner'
import { AppointmentWithRelations } from '@/types/appointment.types'

type Appointment = AppointmentWithRelations

interface EventCardProps {
  appointment: Appointment
  children: React.ReactNode
}

const STATUS_LABELS = {
  scheduled: 'Programada',
  confirmed: 'Confirmada',
  in_progress: 'En Progreso',
  completed: 'Completada',
  cancelled: 'Cancelada',
  no_show: 'No Asistió',
} as const

const STATUS_VARIANTS = {
  scheduled: 'secondary',
  confirmed: 'default',
  in_progress: 'default',
  completed: 'default',
  cancelled: 'destructive',
  no_show: 'destructive',
} as const

export function EventCard({ appointment, children }: EventCardProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const pet = appointment.pets
  const client = pet?.clients
  
  const petName = pet?.name || 'Mascota no especificada'
  const clientName = client
    ? `${client.first_name} ${client.last_name}`
    : 'Cliente no especificado'

  const staffName = appointment.staff
    ? appointment.staff.full_name
    : 'Personal no asignado'

  const appointmentTypeName = appointment.appointment_types?.name || 'Sin tipo'
  const appointmentTypeColor = appointment.appointment_types?.color || '#3B82F6'

  const startDate = new Date(appointment.scheduled_start)
  const endDate = new Date(appointment.scheduled_end)

  const handleShare = async () => {
    try {
      const shareText = `Cita médica:
Mascota: ${petName}
Cliente: ${clientName}
Fecha: ${format(startDate, 'dd/MM/yyyy', { locale: es })}
Hora: ${format(startDate, 'HH:mm', { locale: es })} - ${format(endDate, 'HH:mm', { locale: es })}
Tipo: ${appointmentTypeName}
Personal: ${staffName}`

      if (navigator.share) {
        await navigator.share({
          title: 'Cita Médica',
          text: shareText,
        })
      } else {
        await navigator.clipboard.writeText(shareText)
        toast.success('Información de la cita copiada al portapapeles')
      }
    } catch (error) {
      console.error('Error sharing appointment:', error)
      toast.error('Error al compartir la cita')
    }
  }

  const handleEditSuccess = () => {
    setEditOpen(false)
  }

  const handleDeleteSuccess = () => {
    setDeleteOpen(false)
  }

  return (
    <>
      <HoverCard openDelay={300} closeDelay={100}>
        <HoverCardTrigger asChild>{children}</HoverCardTrigger>
        <HoverCardContent className="w-96 p-0" side="top" align="start">
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-xl font-semibold">
                    Detalles de la Cita
                  </CardTitle>
                  <Badge
                    variant={
                      STATUS_VARIANTS[
                        appointment.status as keyof typeof STATUS_VARIANTS
                      ]
                    }
                    className="w-fit"
                  >
                    {
                      STATUS_LABELS[
                        appointment.status as keyof typeof STATUS_LABELS
                      ]
                    }
                  </Badge>
                </div>
                <div
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: appointmentTypeColor }}
                  title={appointmentTypeName}
                />
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Información de la Mascota y Cliente */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <User className="h-4 w-4" />
                  Información de la Mascota
                </div>
                <div className="pl-6 space-y-2">
                  <div className="font-medium text-base">{petName}</div>
                  <div className="text-sm text-muted-foreground">
                    Cliente: {clientName}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Información de la Cita */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Información de la Cita
                </div>
                <div className="pl-6 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Fecha</div>
                      <div className="font-medium">
                        {format(startDate, "EEEE, dd 'de' MMMM 'de' yyyy", {
                          locale: es,
                        })}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Horario
                      </div>
                      <div className="font-medium flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(startDate, 'HH:mm', { locale: es })} -{' '}
                        {format(endDate, 'HH:mm', { locale: es })}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Tipo de Cita
                      </div>
                      <div className="font-medium flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: appointmentTypeColor }}
                        />
                        {appointmentTypeName}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Personal Médico
                      </div>
                      <div className="font-medium flex items-center gap-1">
                        <UserCheck className="h-3 w-3" />
                        {staffName}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Motivo de la cita */}
              {appointment.reason && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      Motivo de la Cita
                    </div>
                    <div className="pl-6">
                      <div className="text-sm bg-muted/50 rounded-lg p-3">
                        {appointment.reason}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Notas */}
              {appointment.notes && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      Notas
                    </div>
                    <div className="pl-6">
                      <div className="text-sm bg-muted/50 rounded-lg p-3">
                        {appointment.notes}
                      </div>
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Botones de Acción */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <ResponsiveButton
                  variant="outline"
                  onClick={() => setEditOpen(true)}
                  icon={Edit}
                  className="flex-1"
                >
                  Editar Cita
                </ResponsiveButton>
                <ResponsiveButton
                  variant="outline"
                  onClick={handleShare}
                  icon={Share2}
                  className="flex-1"
                >
                  Compartir
                </ResponsiveButton>
                <ResponsiveButton
                  variant="outline"
                  onClick={() => setDeleteOpen(true)}
                  icon={Trash2}
                  className="flex-1 text-destructive hover:text-destructive"
                >
                  Eliminar
                </ResponsiveButton>
              </div>
            </CardContent>
          </Card>
        </HoverCardContent>
      </HoverCard>

      {/* Modales de Edición y Eliminación */}
      <AppointmentEdit
        appointment={appointment}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={handleEditSuccess}
      />

      <AppointmentDelete
        appointment={appointment}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onSuccess={handleDeleteSuccess}
      />
    </>
  )
}
