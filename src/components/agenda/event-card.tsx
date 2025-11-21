'use client'

import { useState, useEffect } from 'react'
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
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { AppointmentEdit } from '@/components/appointments/appointment-edit'
import { AppointmentDelete } from '@/components/appointments/appointment-delete'
import { AppointmentWithRelations } from '@/types/appointment.types'
import useAppointmentStatus from '@/hooks/appointments/use-appointment-status'
import dayjs from '@/lib/dayjs'
import { AppointmentShare } from '@/components/appointments/appointment-share'
import useAgendaInteractionStore from '@/hooks/agenda/use-agenda-interaction-store'

type Appointment = AppointmentWithRelations

interface EventCardProps {
  appointment: Appointment
  children: React.ReactNode
}

export function EventCard({ appointment, children }: EventCardProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const { setDragBlocked } = useAgendaInteractionStore()

  const pet = appointment.pets
  const client = pet?.customers

  const petName = pet?.name || 'Mascota no especificada'
  const clientName = client
    ? `${client.first_name} ${client.last_name}`
    : 'Cliente no especificado'

  const staffName = appointment.staff
    ? `${appointment.staff.first_name} ${appointment.staff.last_name}`
    : 'Personal no asignado'

  const appointmentTypeName = appointment.appointment_types?.name || 'Sin tipo'
  const appointmentTypeColor = appointment.appointment_types?.color || '#3B82F6'

  const startDate = new Date(appointment.scheduled_start)
  const endDate = new Date(appointment.scheduled_end)
  const isPast = dayjs(endDate).isBefore(dayjs())
  const { statusList, getStatus } = useAppointmentStatus()
  const statusColor =
    statusList.find((s) => s.value === appointment.status)?.color || '#64748b'
  const statusLabel = getStatus(appointment.status)

  const handleEditSuccess = () => {
    setEditOpen(false)
  }

  const handleDeleteSuccess = () => {
    setDeleteOpen(false)
  }

  useEffect(() => {
    setDragBlocked(editOpen || shareOpen)
  }, [editOpen, shareOpen, setDragBlocked])

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <span
            role="button"
            tabIndex={0}
            onClick={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setOpen(true)
            }}
            aria-haspopup="dialog"
            aria-expanded={open}
          >
            {children}
          </span>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0" side="top" align="start">
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-xl font-semibold">
                    Detalles de la Cita
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge
                      className="w-fit"
                      style={{
                        backgroundColor: statusColor,
                        color: '#fff',
                        ...(isPast
                          ? {
                              backgroundImage:
                                'repeating-linear-gradient(135deg, rgba(255,255,255,0.35) 0px, rgba(255,255,255,0.35) 2px, transparent 2px, transparent 6px)',
                              opacity: 0.9,
                            }
                          : {}),
                      }}
                    >
                      {statusLabel}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ButtonGroup>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditOpen(true)}
                      aria-label="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShareOpen(true)}
                      aria-label="Compartir"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteOpen(true)}
                      aria-label="Eliminar"
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </ButtonGroup>
                </div>
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
                        {isPast && (
                          <span
                            className="ml-2 text-xs px-2 py-0.5 rounded"
                            style={{
                              backgroundColor: `${statusColor}22`,
                              color: statusColor,
                            }}
                          >
                            Pasada
                          </span>
                        )}
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
                          className="w-3 h-3 rounded-full"
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
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>

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

      <AppointmentShare
        appointment={appointment}
        open={shareOpen}
        onOpenChange={setShareOpen}
      />
    </>
  )
}
