'use client'

import React, { useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Field } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { AppointmentWithRelations } from '@/types/appointment.types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'
import { ButtonGroup } from '@/components/ui/button-group'
import { Mail, Phone } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { EmailShareSection, WhatsAppShareSection } from './'
import { toWhatsAppText } from '@/components/ui/rich-minimal-editor/parsers'
import SummaryCard from './summary-card'
import { useIsMobile } from '@/hooks/use-mobile'

type Appointment = AppointmentWithRelations

interface AppointmentShareProps {
  appointment: Appointment
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AppointmentShare({
  appointment,
  open,
  onOpenChange,
}: AppointmentShareProps) {
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
  const appointmentTypeColor =
    (appointment.appointment_types as any)?.color || '#3B82F6'
  const startDate = new Date(appointment.scheduled_start)
  const endDate = new Date(appointment.scheduled_end)

  const presetHtml = `<p>Hola ${clientName || ''},</p><p>Te comparto los detalles de la cita médica de <strong>${petName}</strong>:</p><ul><li><strong>Fecha:</strong> ${format(startDate, 'dd/MM/yyyy', { locale: es })}</li><li><strong>Hora:</strong> ${format(startDate, 'HH:mm', { locale: es })} - ${format(endDate, 'HH:mm', { locale: es })}</li><li><strong>Tipo:</strong> ${appointmentTypeName}</li><li><strong>Personal:</strong> ${staffName}</li></ul><p>Por favor confirma tu asistencia. ¡Gracias!</p>`

  const [mode, setMode] = React.useState<'email' | 'whatsapp'>('email')

  // preset handled inside child

  const handleCopyShare = async () => {
    try {
      await navigator.clipboard.writeText(toWhatsAppText(presetHtml))
      toast.success('Información copiada')
    } catch {
      toast.error('No se pudo copiar')
    }
  }

  const emailRef = React.useRef<{ submit: () => void } | null>(null)
  const whatsappRef = React.useRef<{ submit: () => void } | null>(null)
  const handleSend = () => {
    if (mode === 'email') emailRef.current?.submit()
    else whatsappRef.current?.submit()
  }

  const handleModeChange = (next: 'email' | 'whatsapp') => setMode(next)

  const isMobile = useIsMobile()
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!w-full !max-w-2xl" side="right">
        <SheetHeader>
          <SheetTitle>Compartir Cita</SheetTitle>
          <SheetDescription>
            Elige el método y personaliza el mensaje antes de enviar.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-full">
          <div className="space-y-6 px-6">
            <SummaryCard
              petName={petName}
              clientName={clientName}
              startDate={startDate}
              endDate={endDate}
              appointmentTypeName={appointmentTypeName}
              staffName={staffName}
              typeColor={appointmentTypeColor}
              defaultOpen={!isMobile}
            />
            <div className="space-y-6">
              <Field orientation="vertical">
                <label className="text-sm font-medium">Método</label>
                <ButtonGroup>
                  <Button
                    type="button"
                    variant={mode === 'email' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleModeChange('email')}
                    aria-pressed={mode === 'email'}
                  >
                    <Mail className="w-4 h-4 mr-1" /> Email
                  </Button>
                  <Button
                    type="button"
                    variant={mode === 'whatsapp' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleModeChange('whatsapp')}
                    aria-pressed={mode === 'whatsapp'}
                  >
                    <Phone className="w-4 h-4 mr-1" /> WhatsApp
                  </Button>
                </ButtonGroup>
              </Field>

              <div className="space-y-4">
                {mode === 'email' ? (
                  <EmailShareSection
                    ref={emailRef}
                    shareText={presetHtml}
                    defaultEmail={client?.email || ''}
                    appointment={{
                      id: appointment.id,
                      title: `Cita: ${appointmentTypeName} - ${petName}`,
                      description: toWhatsAppText(presetHtml),
                      start: appointment.scheduled_start,
                      end: appointment.scheduled_end,
                    }}
                  />
                ) : (
                  <WhatsAppShareSection
                    ref={whatsappRef}
                    defaultPhone={client?.phone || ''}
                    defaultMessage={presetHtml}
                  />
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
        <SheetFooter>
          <Field orientation="horizontal">
            <Button variant="outline" onClick={handleCopyShare}>
              Copiar
            </Button>
            <Button onClick={handleSend}>Enviar</Button>
          </Field>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default AppointmentShare
