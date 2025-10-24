'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent } from '@/components/ui/card'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { CurrencyInput } from '@/components/ui/currency-input'
import { TimezoneInput } from '@/components/ui/timezone-input'
import { Loader2, DollarSign } from 'lucide-react'
import { useTenantDetail } from '@/hooks/tenants/use-tenant-detail'
import { useTenantUpdate } from '@/hooks/tenants/use-tenant-update'
import { z } from 'zod'
import { Skeleton } from '../ui/skeleton'

// Schema for Currency and Timezone settings
const CurrencyTimezoneSchema = z.object({
  currency: z.string().optional().nullish(),
  timezone: z.string().optional().nullish(),
})

type CurrencyTimezoneSettings = z.infer<typeof CurrencyTimezoneSchema>

// Currency and Timezone Card Component
export function TenantCurrencyTimezoneSettings() {
  const { data: tenant, isPending } = useTenantDetail()
  const updateTenantMutation = useTenantUpdate()
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
      form.reset({
        currency: tenant.currency,
        timezone: tenant.timezone,
      })
    }
  }, [tenant, form])

  const onSubmit = async (data: CurrencyTimezoneSettings) => {
    await updateTenantMutation.mutateAsync({
      ...data,
    })
  }

  if (isPending) {
    return (
      <Card className="w-full">
        <CardContent>
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {/* Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldSet>
            <FieldLegend>Moneda y Zona Horaria</FieldLegend>
            <FieldDescription>
              Configura la moneda y zona horaria de tu clínica.
            </FieldDescription>
            <FieldSeparator />
            <FieldGroup>
              {/* Currency Field */}
              <Field orientation="responsive">
                <FieldContent>
                  <FieldLabel
                    htmlFor="currency"
                    className="text-sm font-medium"
                  >
                    Moneda
                  </FieldLabel>
                  <FieldDescription>
                    Selecciona la moneda principal para tu clínica
                  </FieldDescription>
                </FieldContent>
                <CurrencyInput
                  value={form.watch('currency') || ''}
                  onChange={(value) => form.setValue('currency', value)}
                  placeholder="Seleccionar moneda"
                  className="max-w-md"
                />
                <FieldError errors={[form.formState.errors.currency]} />
              </Field>
              <FieldSeparator />
              {/* Timezone Field */}
              <Field orientation="responsive">
                <FieldContent>
                  <FieldLabel
                    htmlFor="timezone"
                    className="text-sm font-medium"
                  >
                    Zona Horaria
                  </FieldLabel>
                  <FieldDescription>
                    Configura la zona horaria de tu ubicación
                  </FieldDescription>
                </FieldContent>
                <TimezoneInput
                  value={form.watch('timezone') || ''}
                  onChange={(value) => form.setValue('timezone', value)}
                  placeholder="Seleccionar zona horaria"
                  className="max-w-md"
                />
                <FieldError errors={[form.formState.errors.timezone]} />
              </Field>
            </FieldGroup>
            {/* Save Button */}
            <div className="flex justify-start pt-4">
              <Button
                type="submit"
                disabled={updateTenantMutation.isPending}
                className="min-w-[100px]"
              >
                {updateTenantMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  'Guardar'
                )}
              </Button>
            </div>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  )
}
