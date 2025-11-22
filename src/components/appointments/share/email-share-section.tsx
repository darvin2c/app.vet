'use client'

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { RichMinimalEditor } from '@/components/ui/rich-minimal-editor'
import { Input } from '@/components/ui/input'
import type { UseFormReturn } from 'react-hook-form'

export default function EmailShareSection({
  form,
  shareText,
}: {
  form: UseFormReturn<any>
  shareText: string
}) {
  return (
    <div className="space-y-4">
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
            <FormLabel>Body</FormLabel>
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
    </div>
  )
}