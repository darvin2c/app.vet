'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Clock } from 'lucide-react'
import { useTenantDetail } from '@/hooks/tenants/use-tenant-detail'
import { useTenantUpdate } from '@/hooks/tenants/use-tenant-update'
import { z } from 'zod'
import TimePicker from '../ui/time-picker'
import { Checkbox } from '../ui/checkbox'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '../ui/field'
import { Skeleton } from '../ui/skeleton'
import { Alert } from '../ui/alert'
import { Switch } from '../ui/switch'

// Schema for Business Hours settings
const BusinessHoursSchema = z.object({
  business_hours: z.object({
    enabled: z.boolean(),
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

// Business Hours Card Component
export function TenantBusinessHoursSettings() {
  const { data: tenant, isPending, error } = useTenantDetail()
  const updateTenant = useTenantUpdate()

  const defaultValues: BusinessHoursSettings = {
    business_hours: {
      enabled: false,
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
      form.reset({
        business_hours:
          tenant?.business_hours as BusinessHoursSettings['business_hours'],
      })
    }
  }, [tenant, form])

  const onSubmit = async (data: BusinessHoursSettings) => {
    updateTenant.mutate({
      business_hours: data.business_hours,
    })
  }

  if (isPending) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col gap-4 py-8">
          <Skeleton className="w-full h-8" />
          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-16" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-8">
          <Alert variant="destructive" className="w-full">
            {error.message}
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const days = [
    { key: 'monday', label: 'Lunes', shortLabel: 'Lun' },
    { key: 'tuesday', label: 'Martes', shortLabel: 'Mar' },
    { key: 'wednesday', label: 'Miércoles', shortLabel: 'Mié' },
    { key: 'thursday', label: 'Jueves', shortLabel: 'Jue' },
    { key: 'friday', label: 'Viernes', shortLabel: 'Vie' },
    { key: 'saturday', label: 'Sábado', shortLabel: 'Sáb' },
    { key: 'sunday', label: 'Domingo', shortLabel: 'Dom' },
  ]

  const businessHoursEnabled = form.watch('business_hours.enabled')

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <FieldSet>
          <FieldLegend className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            Horarios de Atención
          </FieldLegend>
          <FieldDescription>
            Configura los días y horarios en que tu clínica atiende al público.
          </FieldDescription>
          <FieldSeparator />

          {/* Form Fields */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1">
            <FieldGroup>
              {/* Enable Business Hours Toggle */}
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="business_hours.enabled">
                    Habilitar horarios de atención
                  </FieldLabel>
                  <FieldDescription>
                    Activa esta opción para definir los días y horarios en que
                    tu clínica atiende al público. Los pacientes solo podrán
                    agendar citas dentro de estos horarios.
                  </FieldDescription>
                </FieldContent>
                <Switch
                  id="business_hours.enabled"
                  checked={businessHoursEnabled}
                  onCheckedChange={(checked) =>
                    form.setValue('business_hours.enabled', checked === true)
                  }
                />
              </Field>

              {/* Days Configuration - Only show when enabled */}
              {businessHoursEnabled && (
                <div className="space-y-4">
                  <FieldLabel className="text-base font-medium">
                    Configuración por día
                  </FieldLabel>
                  <div className="grid gap-3">
                    {days.map((day) => {
                      // Create specific paths for each day
                      const dayEnabledPath =
                        `business_hours.${day.key}.enabled` as keyof BusinessHoursSettings
                      const dayStartPath =
                        `business_hours.${day.key}.start` as keyof BusinessHoursSettings
                      const dayEndPath =
                        `business_hours.${day.key}.end` as keyof BusinessHoursSettings

                      return (
                        <Field key={day.key} orientation="responsive">
                          <FieldContent>
                            <div className="flex items-center gap-3">
                              <Checkbox
                                checked={!!form.watch(dayEnabledPath as any)}
                                onCheckedChange={(checked) =>
                                  form.setValue(
                                    dayEnabledPath as any,
                                    checked === true
                                  )
                                }
                              />
                              <div className="min-w-0 flex-1">
                                <FieldLabel className="text-sm font-medium">
                                  {day.label}
                                </FieldLabel>
                                <FieldDescription className="text-xs">
                                  {form.watch(dayEnabledPath as any)
                                    ? 'Día habilitado para atención'
                                    : 'Día cerrado'}
                                </FieldDescription>
                              </div>
                            </div>
                          </FieldContent>

                          {/* Time Pickers - Only show when day is enabled */}
                          {form.watch(dayEnabledPath as any) && (
                            <div className="flex items-center gap-2 ml-auto">
                              <TimePicker
                                value={form.watch(dayStartPath as any)}
                                onChange={(value) =>
                                  form.setValue(dayStartPath as any, value)
                                }
                              />
                              <span className="text-sm text-muted-foreground px-1">
                                a
                              </span>
                              <TimePicker
                                value={form.watch(dayEndPath as any)}
                                onChange={(value) =>
                                  form.setValue(dayEndPath as any, value)
                                }
                              />
                            </div>
                          )}
                        </Field>
                      )
                    })}
                  </div>
                </div>
              )}
              <FieldSeparator />
              <Field className="justify-end" orientation="responsive">
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  className="min-w-[100px]"
                >
                  Cancelar
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </FieldSet>
      </CardContent>
    </Card>
  )
}
