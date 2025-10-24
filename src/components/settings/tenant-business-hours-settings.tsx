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

  const onSubmit = async (data: BusinessHoursSettings) => {}

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
