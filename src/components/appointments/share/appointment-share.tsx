'use client'

import * as React from 'react'
import { useForm, useFormContext } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormSheet } from '@/components/ui/form-sheet'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Mail, Phone } from 'lucide-react'
import { RichMinimalEditor } from '@/components/ui/rich-minimal-editor'
import {
  toHtmlEmail,
  toWhatsAppText,
} from '@/components/ui/rich-minimal-editor/parsers'
import PhoneInput, { phoneUtils } from '@/components/ui/phone-input'
import { AppointmentWithRelations } from '@/types/appointment.types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import SummaryCard from './summary-card'
import { Field } from '@/components/ui/field'

// --- Schemas ---

const emailSchema = z
  .object({
    email: z.string().optional().or(z.literal('')),
    subject: z.string().optional().or(z.literal('')),
    email_body: z.string().optional().or(z.literal('')),
  })
  .superRefine((val, ctx) => {
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
  })

const whatsappSchema = z
  .object({
    phone: z.string().optional().or(z.literal('')),
    message: z.string().optional().or(z.literal('')),
  })
  .superRefine((val, ctx) => {
    if (!val.phone || !phoneUtils.validate(val.phone)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Ingresa un número de WhatsApp válido',
        path: ['phone'],
      })
    }
  })

type EmailValues = z.infer<typeof emailSchema>
type WhatsAppValues = z.infer<typeof whatsappSchema>

// --- Sub-components ---

function EmailFields({ shareText }: { shareText: string }) {
  const form = useFormContext<EmailValues>()

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Correo electrónico</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="usuario@correo.com"
                {...field}
                value={field.value || ''}
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
              <Input
                type="text"
                placeholder="Detalles de Cita Médica"
                {...field}
                value={field.value || ''}
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
            <FormLabel>Mensaje</FormLabel>
            <FormControl>
              <RichMinimalEditor
                value={field.value || ''}
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
    </div>
  )
}

function WhatsAppFields() {
  const form = useFormContext<WhatsAppValues>()

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>WhatsApp</FormLabel>
            <FormControl>
              <PhoneInput
                value={field.value || ''}
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
                value={field.value || ''}
                onChange={(html) => field.onChange(html)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

// --- Main Component ---

interface AppointmentShareProps {
  appointment: AppointmentWithRelations
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AppointmentShare({
  appointment,
  open,
  onOpenChange,
}: AppointmentShareProps) {
  const [mode, setMode] = React.useState<'email' | 'whatsapp'>('email')

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

  // Forms
  const emailForm = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: client?.email || '',
      subject: 'Detalles de Cita Médica',
      email_body: presetHtml,
    },
  })

  const whatsappForm = useForm<WhatsAppValues>({
    resolver: zodResolver(whatsappSchema),
    defaultValues: {
      phone: client?.phone || '',
      message: presetHtml,
    },
  })

  // Handlers
  const onEmailSubmit = async (values: EmailValues) => {
    const subject = values.subject || 'Detalles de Cita Médica'
    const html = toHtmlEmail(values.email_body || presetHtml)
    await fetch('/api/send-appointment-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        appointmentId: appointment.id,
        to: values.email,
        subject,
        html,
        from: undefined,
      }),
    })
    onOpenChange(false)
  }

  const onWhatsAppSubmit = (values: WhatsAppValues) => {
    const base = 'https://wa.me/'
    const messageParse = toWhatsAppText(values.message || '')
    const text = encodeURIComponent(messageParse)
    const url = `${base}${values.phone}?text=${text}`
    window.open(url, '_blank')
    onOpenChange(false)
  }

  // Determine current form and submit handler
  const currentForm = mode === 'email' ? emailForm : whatsappForm
  const currentSubmit = mode === 'email' ? onEmailSubmit : onWhatsAppSubmit

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Compartir Cita"
      description="Elige el método y personaliza el mensaje antes de enviar."
      form={currentForm as any}
      onSubmit={currentSubmit as any}
      submitLabel={mode === 'email' ? 'Enviar Correo' : 'Enviar WhatsApp'}
      cancelLabel="Cancelar"
      isPending={currentForm.formState.isSubmitting}
      side="right"
      className="!max-w-2xl"
    >
      <div className="space-y-6">
        <SummaryCard
          petName={petName}
          clientName={clientName}
          startDate={startDate}
          endDate={endDate}
          appointmentTypeName={appointmentTypeName}
          staffName={staffName}
          typeColor={appointmentTypeColor}
        />

        <Field orientation="vertical">
          <label className="text-sm font-medium">Método</label>
          <ButtonGroup>
            <Button
              type="button"
              variant={mode === 'email' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('email')}
              aria-pressed={mode === 'email'}
            >
              <Mail className="w-4 h-4 mr-1" /> Email
            </Button>
            <Button
              type="button"
              variant={mode === 'whatsapp' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('whatsapp')}
              aria-pressed={mode === 'whatsapp'}
            >
              <Phone className="w-4 h-4 mr-1" /> WhatsApp
            </Button>
          </ButtonGroup>
        </Field>

        {mode === 'email' ? (
          <EmailFields shareText={presetHtml} />
        ) : (
          <WhatsAppFields />
        )}
      </div>
    </FormSheet>
  )
}

export default AppointmentShare
