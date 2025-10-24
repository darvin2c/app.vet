'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent } from '@/components/ui/card'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, DollarSign } from 'lucide-react'
import { useTenantDetail } from '@/hooks/tenants/use-tenant-detail'
import { useTenantUpdate } from '@/hooks/tenants/use-tenant-update'
import {
  CURRENCY_OPTIONS,
  TIMEZONE_OPTIONS,
} from '@/schemas/tenant-settings.schema'
import { z } from 'zod'

// Schema for Currency and Timezone settings
const CurrencyTimezoneSchema = z.object({
  currency: z.enum(['PEN', 'USD', 'EUR']).optional().nullish(),
  timezone: z
    .enum(['America/Lima', 'America/New_York', 'Europe/Madrid'])
    .optional()
    .nullish(),
})

type CurrencyTimezoneSettings = z.infer<typeof CurrencyTimezoneSchema>

// Currency and Timezone Card Component
export function TenantCurrencyTimezoneSettings() {
  const { data: tenant, isLoading } = useTenantDetail()
  const updateTenant = useTenantUpdate()

  const defaultValues: CurrencyTimezoneSettings = {
    currency: undefined,
    timezone: undefined,
  }

  const form = useForm({
    resolver: zodResolver(CurrencyTimezoneSchema),
    defaultValues,
  })

  // Update form when tenant data is loaded
  React.useEffect(() => {
    if (tenant) {
      // Since these fields don't exist in the current tenant schema,
      // we'll keep the default values for now
    }
  }, [tenant, form])

  const onSubmit = async (data: CurrencyTimezoneSettings) => {
    // TODO: Add currency and timezone fields to tenants table schema
    // await updateTenant.mutateAsync({
    //   currency: data.currency || undefined,
    //   timezone: data.timezone || undefined,
    // })
    console.log('Currency and timezone settings:', data)
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          {/* Icon and Title */}
          <div className="flex items-center gap-3 min-w-[200px]">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <div>
              <h3 className="font-semibold">Moneda y Zona Horaria</h3>
              <p className="text-sm text-muted-foreground">
                Configura la moneda y zona horaria
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Field>
                <FieldLabel htmlFor="currency">Moneda</FieldLabel>
                <FieldContent>
                  <Select
                    value={form.watch('currency') || ''}
                    onValueChange={(value) =>
                      form.setValue('currency', value as any)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar moneda" />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCY_OPTIONS.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={[form.formState.errors.currency]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="timezone">Zona Horaria</FieldLabel>
                <FieldContent>
                  <Select
                    value={form.watch('timezone') || ''}
                    onValueChange={(value) =>
                      form.setValue('timezone', value as any)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar zona horaria" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONE_OPTIONS.map((timezone) => (
                        <SelectItem key={timezone.value} value={timezone.value}>
                          {timezone.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={[form.formState.errors.timezone]} />
                </FieldContent>
              </Field>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={updateTenant.isPending}
                size="sm"
                className="min-w-[100px]"
              >
                {updateTenant.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  'Guardar'
                )}
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
