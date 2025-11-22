'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { phoneUtils } from '@/components/ui/phone-input'
import { Form } from '@/components/ui/form'
import { EmailShareSection, WhatsAppShareSection } from './'
import { toHtmlEmail } from '@/components/ui/rich-minimal-editor/parsers'

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
  const startDate = new Date(appointment.scheduled_start)
  const endDate = new Date(appointment.scheduled_end)

  const shareText = `Cita médica:\nMascota: ${petName}\nCliente: ${clientName}\nFecha: ${format(startDate, 'dd/MM/yyyy', { locale: es })}\nHora: ${format(startDate, 'HH:mm', { locale: es })} - ${format(endDate, 'HH:mm', { locale: es })}\nTipo: ${appointmentTypeName}\nPersonal: ${staffName}`
  const emailPreset = `<p>Hola ${clientName || ''},</p><p>Te comparto los detalles de la cita médica de <strong>${petName}</strong>:</p><ul><li><strong>Fecha:</strong> ${format(startDate, 'dd/MM/yyyy', { locale: es })}</li><li><strong>Hora:</strong> ${format(startDate, 'HH:mm', { locale: es })} - ${format(endDate, 'HH:mm', { locale: es })}</li><li><strong>Tipo:</strong> ${appointmentTypeName}</li><li><strong>Personal:</strong> ${staffName}</li></ul><p>Por favor confirma tu asistencia. ¡Gracias!</p>`

  const schema = z
    .object({
      mode: z.union([z.literal('email'), z.literal('whatsapp')]),
      email: z.string().optional().or(z.literal('')),
      subject: z.string().optional().or(z.literal('')),
      email_body: z.string().optional().or(z.literal('')),
      phone: z.string().optional().or(z.literal('')),
      message_html: z.string().optional().or(z.literal('')),
      message: z.string().optional().or(z.literal('')),
    })
    .superRefine((val, ctx) => {
      if (val.mode === 'email') {
        if (
          !val.email ||
          !z.email('Formato de email inválido').safeParse(val.email).success
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Formato de email inválido',
            path: ['email'],
          })
        }
        if (
          !val.subject ||
          !z.string().nonempty('El campo es requerido').safeParse(val.subject)
            .success
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'El campo es requerido',
            path: ['subject'],
          })
        }
        if (
          !val.email_body ||
          !z
            .string()
            .nonempty('El cuerpo no debe estar vacío')
            .safeParse(val.email_body).success
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'El cuerpo no debe estar vacío',
            path: ['email_body'],
          })
        }
      }
      if (val.mode === 'whatsapp') {
        if (!val.phone || !phoneUtils.validate(val.phone)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Ingresa un número de WhatsApp válido',
            path: ['phone'],
          })
        }
      }
    })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      mode: 'email',
      email: client?.email || '',
      subject: `Detalles de Cita Médica`,
      email_body: emailPreset,
      phone: '',
      message: '',
    },
  })

  useEffect(() => {
    const preset = `<p>Hola ${clientName},</p><p>Te comparto los detalles de la cita médica de <strong>${petName}</strong>:</p><ul><li><strong>Fecha:</strong> ${format(startDate, 'dd/MM/yyyy', { locale: es })}</li><li><strong>Hora:</strong> ${format(startDate, 'HH:mm', { locale: es })} - ${format(endDate, 'HH:mm', { locale: es })}</li><li><strong>Tipo:</strong> ${appointmentTypeName}</li><li><strong>Personal:</strong> ${staffName}</li></ul><p>Por favor confirma tu asistencia. ¡Gracias!</p>`
    if (form.getValues('mode') === 'whatsapp') {
      form.setValue('message', preset, { shouldValidate: true })
    }
  }, [appointment.id])

  const handleCopyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      toast.success('Información copiada')
    } catch {
      toast.error('No se pudo copiar')
    }
  }

  const handleSend = form.handleSubmit((values) => {
    if (values.mode === 'email') {
      const subject = encodeURIComponent(
        values.subject || 'Detalles de Cita Médica'
      )
      const bodyHtml = toHtmlEmail(values.email_body || shareText)
      const body = encodeURIComponent(bodyHtml)
      window.open(
        `mailto:${values.email}?subject=${subject}&body=${body}`,
        '_blank'
      )
    } else {
      const base = 'https://wa.me/'
      const text = encodeURIComponent(values.message || shareText)
      const url = `${base}${values.phone}?text=${text}`
      window.open(url, '_blank')
    }
  })

  const handleModeChange = (next: 'email' | 'whatsapp') => {
    form.setValue('mode', next, { shouldValidate: true })
    if (next === 'email') {
      form.setValue('phone', '')
      form.setValue('message', '')
      form.setValue('email_body', emailPreset)
    } else {
      form.setValue('email', '')
      form.setValue('subject', 'Detalles de Cita Médica')
      form.setValue('email_body', '')
      const preset = `<p>Hola ${clientName},</p><p>Te comparto los detalles de la cita médica de <strong>${petName}</strong>:</p><ul><li><strong>Fecha:</strong> ${format(startDate, 'dd/MM/yyyy', { locale: es })}</li><li><strong>Hora:</strong> ${format(startDate, 'HH:mm', { locale: es })} - ${format(endDate, 'HH:mm', { locale: es })}</li><li><strong>Tipo:</strong> ${appointmentTypeName}</li><li><strong>Personal:</strong> ${staffName}</li></ul><p>Por favor confirma tu asistencia. ¡Gracias!</p>`
      form.setValue('message', preset, { shouldValidate: true })
    }
  }

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
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="text-sm font-medium mb-2">Resumen de la Cita</div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Mascota</div>
                  <div className="font-semibold">{petName}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Cliente</div>
                  <div className="font-semibold">{clientName}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Fecha</div>
                  <div className="font-semibold">
                    {format(startDate, 'dd/MM/yyyy', { locale: es })}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Horario</div>
                  <div className="font-semibold">
                    {format(startDate, 'HH:mm', { locale: es })} -{' '}
                    {format(endDate, 'HH:mm', { locale: es })}
                  </div>
                </div>
              </div>
            </div>
            <Form {...form}>
              <form className="space-y-6">
                <Field orientation="vertical">
                  <label className="text-sm font-medium">Método</label>
                  <ButtonGroup>
                    <Button
                      type="button"
                      variant={
                        form.watch('mode') === 'email' ? 'default' : 'outline'
                      }
                      size="sm"
                      onClick={() => handleModeChange('email')}
                      aria-pressed={form.watch('mode') === 'email'}
                    >
                      <Mail className="w-4 h-4 mr-1" /> Email
                    </Button>
                    <Button
                      type="button"
                      variant={
                        form.watch('mode') === 'whatsapp'
                          ? 'default'
                          : 'outline'
                      }
                      size="sm"
                      onClick={() => handleModeChange('whatsapp')}
                      aria-pressed={form.watch('mode') === 'whatsapp'}
                    >
                      <Phone className="w-4 h-4 mr-1" /> WhatsApp
                    </Button>
                  </ButtonGroup>
                </Field>

                <div className="space-y-4">
                  {form.watch('mode') === 'email' ? (
                    <EmailShareSection form={form} shareText={shareText} />
                  ) : (
                    <WhatsAppShareSection form={form} />
                  )}
                </div>
              </form>
            </Form>
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
