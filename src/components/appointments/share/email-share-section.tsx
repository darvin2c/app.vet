'use client'

import React, { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { RichMinimalEditor } from '@/components/ui/rich-minimal-editor'
import { Input } from '@/components/ui/input'
import { toHtmlEmail } from '@/components/ui/rich-minimal-editor/parsers'

export interface EmailShareHandle {
  submit: () => void
}

export default forwardRef<EmailShareHandle, { shareText: string; defaultEmail?: string }>(
  function EmailShareSection({ shareText, defaultEmail }, ref) {
    const schema = z.object({
      email: z.string().optional().or(z.literal('')),
      subject: z.string().optional().or(z.literal('')),
      email_body: z.string().optional().or(z.literal('')),
    }).superRefine((val, ctx) => {
      if (!val.email || !z.email('Formato de email inválido').safeParse(val.email).success) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Formato de email inválido', path: ['email'] })
      }
      if (!val.subject || !z.string().nonempty('El campo es requerido').safeParse(val.subject).success) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'El campo es requerido', path: ['subject'] })
      }
      if (!val.email_body || !z.string().nonempty('El cuerpo no debe estar vacío').safeParse(val.email_body).success) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'El cuerpo no debe estar vacío', path: ['email_body'] })
      }
    })

    const form = useForm<z.infer<typeof schema>>({
      resolver: zodResolver(schema) as any,
      defaultValues: {
        email: defaultEmail || '',
        subject: 'Detalles de Cita Médica',
        email_body: shareText,
      },
    })

    const onSubmit = (values: z.infer<typeof schema>) => {
      const subject = encodeURIComponent(values.subject || 'Detalles de Cita Médica')
      const bodyHtml = toHtmlEmail(values.email_body || shareText)
      const body = encodeURIComponent(bodyHtml)
      window.open(`mailto:${values.email}?subject=${subject}&body=${body}`, '_blank')
    }

    useImperativeHandle(ref, () => ({
      submit: () => form.handleSubmit(onSubmit)(),
    }))

    return (
      <Form {...form}>
        <form className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo electrónico</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="usuario@correo.com" {...field} />
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
                  <Input type="text" placeholder="Detalles de Cita Médica" {...field} />
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
                    value={(field.value as string) || ''}
                    onChange={(html) => field.onChange(html)}
                    onParsedChange={({ html }) =>
                      form.setValue('email_body', html || '', { shouldValidate: true })
                    }
                    placeholder={shareText}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    )
  }
)
