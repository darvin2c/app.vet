'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMemo } from 'react'
import type { UseFormReturn } from 'react-hook-form'

interface TemplateSelectProps {
  form: UseFormReturn<any>
  mode: 'email' | 'whatsapp'
  defaultText: string
  className?: string
}

export default function TemplateSelect({
  form,
  mode,
  defaultText,
  className,
}: TemplateSelectProps) {
  const items = useMemo(
    () => [
      {
        id: 'default',
        label: 'Plantilla base',
        build: () => defaultText,
      },
      {
        id: 'confirm',
        label: 'Confirmación',
        build: () =>
          `<p>Hola,</p><p>Te confirmamos la cita programada. Por favor responde este mensaje si necesitas reprogramar.</p>` +
          `<p>${defaultText.replace(/\n/g, '<br/>')}</p>` +
          `<p>¡Gracias!</p>`,
      },
      {
        id: 'reminder',
        label: 'Recordatorio',
        build: () =>
          `<p>Recordatorio de tu cita:</p>` +
          `<p>${defaultText.replace(/\n/g, '<br/>')}</p>` +
          `<p>Te esperamos.</p>`,
      },
    ],
    [defaultText]
  )

  const handleChange = (value: string) => {
    const tmpl = items.find((i) => i.id === value)
    if (!tmpl) return
    const html = tmpl.build()
    if (mode === 'email') {
      form.setValue('email_body', html, { shouldValidate: true })
    } else {
      form.setValue('message', html, { shouldValidate: true })
    }
  }

  return (
    <Select onValueChange={handleChange}>
      <SelectTrigger className={className} aria-label="Plantillas">
        <SelectValue placeholder="Selecciona plantilla" />
      </SelectTrigger>
      <SelectContent>
        {items.map((i) => (
          <SelectItem key={i.id} value={i.id}>
            {i.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
