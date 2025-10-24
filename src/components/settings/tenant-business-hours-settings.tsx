'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, Clock } from 'lucide-react'
import { useTenantDetail } from '@/hooks/tenants/use-tenant-detail'
import { useTenantUpdate } from '@/hooks/tenants/use-tenant-update'
import { z } from 'zod'
import TimePicker from '../ui/time-picker'
import { Checkbox } from '../ui/checkbox'
import {
  Field,
  FieldDescription,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '../ui/field'
import { Skeleton } from '../ui/skeleton'
import { Alert } from '../ui/alert'

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

// Business Hours Card Component
export function TenantBusinessHoursSettings() {
  const { data: tenant, isPending, error } = useTenantDetail()
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

  const onSubmit = async (data: BusinessHoursSettings) => {
    console.log(data)
  }

  if (isPending) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-8">
          <Skeleton className="w-full h-30" />
          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-8" />
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
        <FieldSet>
          <FieldLegend>
            <Clock className="h-5 w-5 text-muted-foreground" />
            Horarios de Atención
          </FieldLegend>
          <FieldDescription>
            Configura la moneda y zona horaria de tu clínica.
          </FieldDescription>
          <FieldSeparator />

          {/* Form Fields */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1">
            <Field orientation={'responsive'}>
              {days.map((day) => (
                <div
                  key={day.key}
                  className="flex items-center gap-4 p-3 border rounded-lg bg-muted/30"
                >
                  <div className="w-12 text-center">
                    <label className="text-sm font-medium">{day.label}</label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      className="rounded"
                      checked={form.watch(
                        `business_hours.${day.key}.enabled` as `business_hours.${keyof BusinessHoursSettings['business_hours']}.enabled`
                      )}
                      onCheckedChange={(checked) =>
                        form.setValue(
                          `business_hours.${day.key}.enabled` as `business_hours.${keyof BusinessHoursSettings['business_hours']}.enabled`,
                          checked === true
                        )
                      }
                    />
                    <span className="text-sm w-16">Abierto</span>
                  </div>

                  {form.watch(
                    `business_hours.${day.key}.enabled` as `business_hours.${keyof BusinessHoursSettings['business_hours']}.enabled`
                  ) && (
                    <div className="flex items-center gap-2 ml-auto">
                      <TimePicker
                        value={form.watch(
                          `business_hours.${day.key}.start` as `business_hours.${keyof BusinessHoursSettings['business_hours']}.start`
                        )}
                        onChange={(value) =>
                          form.setValue(
                            `business_hours.${day.key}.start` as `business_hours.${keyof BusinessHoursSettings['business_hours']}.start`,
                            value
                          )
                        }
                      />
                      <span className="text-sm text-muted-foreground">a</span>
                      <TimePicker
                        value={form.watch(
                          `business_hours.${day.key}.end` as `business_hours.${keyof BusinessHoursSettings['business_hours']}.end`
                        )}
                        onChange={(value) =>
                          form.setValue(
                            `business_hours.${day.key}.end` as `business_hours.${keyof BusinessHoursSettings['business_hours']}.end`,
                            value
                          )
                        }
                      />
                    </div>
                  )}
                </div>
              ))}
            </Field>

            {/* Save Button */}
            <div className="flex pt-4 justify-end">
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
        </FieldSet>
      </CardContent>
    </Card>
  )
}
