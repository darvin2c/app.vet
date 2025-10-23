'use client'

import React from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, DollarSign, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { useTenantDetail } from '@/hooks/tenants/use-tenant-detail'
import { useTenantUpdate } from '@/hooks/tenants/use-tenant-update'
import {
  TenantBusinessSettingsSchema,
  type TenantBusinessSettings,
  CURRENCY_OPTIONS,
  TIMEZONE_OPTIONS,
} from '@/schemas/tenant-settings.schema'
import { z } from 'zod'

// Schema for Currency and Timezone settings
const CurrencyTimezoneSchema = z.object({
  currency: z.enum(['PEN', 'USD', 'EUR']),
  timezone: z.enum(['America/Lima', 'America/New_York', 'Europe/Madrid']),
})

type CurrencyTimezoneSettings = z.infer<typeof CurrencyTimezoneSchema>

// Schema for Business Hours settings
const BusinessHoursSchema = z.object({
  business_hours: z.object({
    monday: z.object({
      enabled: z.boolean(),
      start: z.string(),
      end: z.string(),
    }),
    tuesday: z.object({
      enabled: z.boolean(),
      start: z.string(),
      end: z.string(),
    }),
    wednesday: z.object({
      enabled: z.boolean(),
      start: z.string(),
      end: z.string(),
    }),
    thursday: z.object({
      enabled: z.boolean(),
      start: z.string(),
      end: z.string(),
    }),
    friday: z.object({
      enabled: z.boolean(),
      start: z.string(),
      end: z.string(),
    }),
    saturday: z.object({
      enabled: z.boolean(),
      start: z.string(),
      end: z.string(),
    }),
    sunday: z.object({
      enabled: z.boolean(),
      start: z.string(),
      end: z.string(),
    }),
  }),
})

type BusinessHoursSettings = z.infer<typeof BusinessHoursSchema>

// Currency and Timezone Card Component
function CurrencyTimezoneCard() {
  const { data: tenant, isLoading } = useTenantDetail()
  const updateTenant = useTenantUpdate()

  const defaultValues: CurrencyTimezoneSettings = {
    currency: 'PEN' as const,
    timezone: 'America/Lima' as const,
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

  const onSubmit: SubmitHandler<CurrencyTimezoneSettings> = async (data) => {
    try {
      console.log('Currency and timezone settings to save:', data)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success(
        'Configuración de moneda y zona horaria actualizada correctamente'
      )
    } catch (error) {
      console.error('Error updating currency and timezone settings:', error)
      toast.error(
        'Error al actualizar la configuración de moneda y zona horaria'
      )
    }
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
                    value={form.watch('currency')}
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
                    value={form.watch('timezone')}
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

// Business Hours Card Component
function BusinessHoursCard() {
  const { data: tenant, isLoading } = useTenantDetail()
  const updateTenant = useTenantUpdate()

  const defaultValues: BusinessHoursSettings = {
    business_hours: {
      monday: { enabled: true, start: '09:00', end: '17:00' },
      tuesday: { enabled: true, start: '09:00', end: '17:00' },
      wednesday: { enabled: true, start: '09:00', end: '17:00' },
      thursday: { enabled: true, start: '09:00', end: '17:00' },
      friday: { enabled: true, start: '09:00', end: '17:00' },
      saturday: { enabled: false, start: '09:00', end: '17:00' },
      sunday: { enabled: false, start: '09:00', end: '17:00' },
    },
  }

  const form = useForm({
    resolver: zodResolver(BusinessHoursSchema),
    defaultValues,
  })

  // Update form when tenant data is loaded
  React.useEffect(() => {
    if (tenant) {
      // Since these fields don't exist in the current tenant schema,
      // we'll keep the default values for now
    }
  }, [tenant, form])

  const onSubmit: SubmitHandler<BusinessHoursSettings> = async (data) => {
    try {
      console.log('Business hours settings to save:', data)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success('Horarios de atención actualizados correctamente')
    } catch (error) {
      console.error('Error updating business hours settings:', error)
      toast.error('Error al actualizar los horarios de atención')
    }
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

  const days = [
    { key: 'monday', label: 'Lun' },
    { key: 'tuesday', label: 'Mar' },
    { key: 'wednesday', label: 'Mié' },
    { key: 'thursday', label: 'Jue' },
    { key: 'friday', label: 'Vie' },
    { key: 'saturday', label: 'Sáb' },
    { key: 'sunday', label: 'Dom' },
  ]

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          {/* Icon and Title */}
          <div className="flex items-center gap-3 min-w-[200px]">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <h3 className="font-semibold">Horario de Atención</h3>
              <p className="text-sm text-muted-foreground">
                Configura los horarios de atención
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1">
            <div className="space-y-3 mb-6">
              {days.map((day) => (
                <div
                  key={day.key}
                  className="flex items-center gap-4 p-3 border rounded-lg bg-muted/30"
                >
                  <div className="w-12 text-center">
                    <label className="text-sm font-medium">{day.label}</label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.watch(
                        `business_hours.${day.key}.enabled` as any
                      )}
                      onChange={(e) =>
                        form.setValue(
                          `business_hours.${day.key}.enabled` as any,
                          e.target.checked
                        )
                      }
                      className="rounded"
                    />
                    <span className="text-sm w-16">Abierto</span>
                  </div>

                  {form.watch(`business_hours.${day.key}.enabled` as any) && (
                    <div className="flex items-center gap-2 ml-auto">
                      <Input
                        type="time"
                        {...form.register(
                          `business_hours.${day.key}.start` as any
                        )}
                        className="w-20 h-8"
                      />
                      <span className="text-sm text-muted-foreground">a</span>
                      <Input
                        type="time"
                        {...form.register(
                          `business_hours.${day.key}.end` as any
                        )}
                        className="w-20 h-8"
                      />
                    </div>
                  )}
                </div>
              ))}
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

// Main component that exports both cards
export function TenantBusinessSettings() {
  return (
    <div className="space-y-6">
      <CurrencyTimezoneCard />
      <BusinessHoursCard />
    </div>
  )
}
