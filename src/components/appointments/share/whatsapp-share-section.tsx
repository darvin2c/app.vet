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
import PhoneInput, { phoneUtils } from '@/components/ui/phone-input'
import { RichMinimalEditor } from '@/components/ui/rich-minimal-editor'
import { toWhatsAppText } from '@/components/ui/rich-minimal-editor/parsers'

export interface WhatsAppShareHandle {
  submit: () => void
}

export default forwardRef<WhatsAppShareHandle, { defaultPhone?: string; defaultMessage?: string }>(
  function WhatsAppShareSection({ defaultPhone, defaultMessage }, ref) {
    const schema = z
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

    const form = useForm<z.infer<typeof schema>>({
      resolver: zodResolver(schema) as any,
      defaultValues: {
        phone: defaultPhone || '',
        message: defaultMessage || '',
      },
    })

    const onSubmit = (values: z.infer<typeof schema>) => {
      const base = 'https://wa.me/'
      const text = encodeURIComponent(toWhatsAppText(values.message || ''))
      const url = `${base}${values.phone}?text=${text}`
      window.open(url, '_blank')
    }

    useImperativeHandle(ref, () => ({
      submit: () => form.handleSubmit(onSubmit)(),
    }))

    return (
      <Form {...form}>
        <form className="space-y-4">
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
