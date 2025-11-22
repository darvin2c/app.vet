'use client'

import { useEffect } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
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
import { RichMinimalEditor } from '@/components/ui/rich-minimal-editor'
import PhoneInput, { phoneUtils } from '@/components/ui/phone-input'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'

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

  const schema = z
    .object({
      mode: z.union([z.literal('email'), z.literal('whatsapp')]),
      email: z.string().optional().or(z.literal('')),
      subject: z.string().optional().or(z.literal('')),
      email_body: z.string().optional().or(z.literal('')),
      phone: z.string().optional().or(z.literal('')),
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
      email_body: shareText,
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
      const parser = document.createElement('div')
      parser.innerHTML = values.email_body || shareText
      const plainEmail = parser.textContent || parser.innerText || ''
      const body = encodeURIComponent(plainEmail)
      window.open(
        `mailto:${values.email}?subject=${subject}&body=${body}`,
        '_blank'
      )
    } else {
      const base = 'https://wa.me/'
      const parser = document.createElement('div')
      parser.innerHTML = values.message || shareText
      const plain = parser.textContent || parser.innerText || ''
      const text = encodeURIComponent(plain)
      const url = `${base}${values.phone}?text=${text}`
      window.open(url, '_blank')
    }
  })

  const handleModeChange = (next: 'email' | 'whatsapp') => {
    form.setValue('mode', next, { shouldValidate: true })
    if (next === 'email') {
      form.setValue('phone', '')
      form.setValue('message', '')
      form.setValue('email_body', shareText)
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
            <Form {...form}>
              <form className="space-y-4">
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

                {form.watch('mode') === 'email' ? (
                  <EmailShareSection form={form} shareText={shareText} />
                ) : (
                  <WhatsAppShareSection form={form} />
                )}
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

function EmailShareSection({
  form,
  shareText,
}: {
  form: UseFormReturn<any>
  shareText: string
}) {
  return (
    <>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Correo electrónico</FormLabel>
            <FormControl>
              <input
                type="email"
                placeholder="usuario@correo.com"
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="subject"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Asunto</FormLabel>
            <FormControl>
              <input
                type="text"
                placeholder="Detalles de Cita Médica"
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email_body"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Body</FormLabel>
            <FormControl>
              <RichMinimalEditor
                value={(field.value as string) || ''}
                onChange={(html) => field.onChange(html)}
                onParsedChange={({ html }) =>
                  form.setValue('email_body', html || '', {
                    shouldValidate: true,
                  })
                }
                placeholder={shareText}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}

function WhatsAppShareSection({ form }: { form: UseFormReturn<any> }) {
  return (
    <>
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>WhatsApp</FormLabel>
            <FormControl>
              <PhoneInput
                value={field.value as string}
                onChange={(val) => field.onChange(val)}
                defaultCountry="PE"
                showCountrySelect
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="message"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mensaje</FormLabel>
            <FormControl>
              <RichMinimalEditor
                value={(field.value as string) || ''}
                onChange={(html) => field.onChange(html)}
                onParsedChange={({ whatsappText }) =>
                  form.setValue('message', whatsappText || '', {
                    shouldValidate: true,
                  })
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
