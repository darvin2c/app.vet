'use client'

import { useState } from 'react'
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
import { RichMinimalEditor } from '@/components/ui/rich-minimal-editor'
import PhoneInput, { phoneUtils } from '@/components/ui/phone-input'

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
  const [mode, setMode] = useState<'email' | 'whatsapp'>('email')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [waText, setWaText] = useState('')

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
  const startDate = new Date(appointment.scheduled_start)
  const endDate = new Date(appointment.scheduled_end)

  const shareText = `Cita médica:\nMascota: ${petName}\nCliente: ${clientName}\nFecha: ${format(startDate, 'dd/MM/yyyy', { locale: es })}\nHora: ${format(startDate, 'HH:mm', { locale: es })} - ${format(endDate, 'HH:mm', { locale: es })}\nTipo: ${appointmentTypeName}\nPersonal: ${staffName}`

  const handleCopyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      toast.success('Información copiada')
    } catch {
      toast.error('No se pudo copiar')
    }
  }

  const handleSend = () => {
    if (mode === 'email') {
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        toast.error('Ingresa un correo válido')
        return
      }
      const subject = encodeURIComponent('Detalles de Cita Médica')
      const body = encodeURIComponent(shareText)
      window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank')
    } else {
      console.log(phone)
      if (!phone || !phoneUtils.validate(phone)) {
        toast.error('Ingresa un número de WhatsApp válido')
        return
      }
      const base = 'https://wa.me/'
      const parser = document.createElement('div')
      parser.innerHTML = waText || shareText
      const plain = parser.textContent || parser.innerText || ''
      const text = encodeURIComponent(plain)
      const url = `${base}${phone}?text=${text}`
      window.open(url, '_blank')
    }
  }

  const handleModeChange = (next: 'email' | 'whatsapp') => {
    setMode(next)
    if (next === 'email') setPhone('')
    else {
      setEmail('')
      setWaText(
        `<p>Hola ${clientName},</p><p>Te comparto los detalles de la cita médica de <strong>${petName}</strong>:</p><ul><li><strong>Fecha:</strong> ${format(startDate, 'dd/MM/yyyy', { locale: es })}</li><li><strong>Hora:</strong> ${format(startDate, 'HH:mm', { locale: es })} - ${format(endDate, 'HH:mm', { locale: es })}</li><li><strong>Tipo:</strong> ${appointmentTypeName}</li><li><strong>Personal:</strong> ${staffName}</li></ul><p>Por favor confirma tu asistencia. ¡Gracias!</p>`
      )
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!w-full !max-w-xl" side="right">
        <SheetHeader>
          <SheetTitle>Compartir Cita</SheetTitle>
          <SheetDescription>
            Envía los detalles por correo o WhatsApp.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-full">
          <div className="space-y-4 px-6">
            <div className="rounded-md border p-3 text-sm whitespace-pre-wrap bg-muted/50">
              {shareText}
            </div>
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
            {mode === 'email' ? (
              <Field orientation="vertical">
                <label className="text-sm font-medium">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@correo.com"
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                />
              </Field>
            ) : (
              <>
                <Field orientation="vertical">
                  <label className="text-sm font-medium">WhatsApp</label>
                  <PhoneInput
                    value={phone}
                    onChange={(val) => setPhone(val)}
                    defaultCountry="PE"
                    showCountrySelect
                  />
                </Field>
                <Field orientation="vertical">
                  <label className="text-sm font-medium">Mensaje</label>
                  <RichMinimalEditor value={waText} onChange={setWaText} />
                </Field>
              </>
            )}
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
