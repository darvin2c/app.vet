'use client'

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import PhoneInput from '@/components/ui/phone-input'
import { RichMinimalEditor } from '@/components/ui/rich-minimal-editor'
import type { UseFormReturn } from 'react-hook-form'

export default function WhatsAppShareSection({ form }: { form: UseFormReturn<any> }) {
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
                  form.setValue('message', whatsappText || '', { shouldValidate: true })
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}