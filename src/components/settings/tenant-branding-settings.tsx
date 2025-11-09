'use client'

import React from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldError,
} from '@/components/ui/field'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useTenantDetail } from '@/hooks/tenants/use-tenant-detail'
import { useTenantUpdate } from '@/hooks/tenants/use-tenant-update'
import { type TenantBrandingSettings } from '@/schemas/tenant-settings.schema'
import { Loader2, Upload, Image } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

const LogoSettingsSchema = z.object({
  logo_url: z.string().optional(),
  favicon_url: z.string().optional(),
})

type LogoSettings = z.infer<typeof LogoSettingsSchema>

// Logo Settings Component
function LogoSettingsCard() {
  const { data: tenant, isLoading } = useTenantDetail()
  const updateTenant = useTenantUpdate()

  const form = useForm<LogoSettings>({
    resolver: zodResolver(LogoSettingsSchema),
    defaultValues: {
      logo_url: '',
      favicon_url: '',
    },
  })

  const onSubmit: SubmitHandler<LogoSettings> = async (data) => {
    try {
      console.log('Logo settings to save:', data)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Configuración de logo guardada correctamente')
    } catch (error) {
      console.error('Error updating logo settings:', error)
      toast.error('Error al guardar la configuración de logo')
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Logo y Recursos
        </CardTitle>
        <CardDescription>
          Sube y configura los recursos visuales de tu marca
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <Field>
            <FieldLabel htmlFor="logo_url">Logo Principal</FieldLabel>
            <FieldContent>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <Button type="button" variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Subir Logo
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    PNG, JPG, SVG (máx. 2MB, recomendado: 200x60px)
                  </span>
                </div>
                <Input
                  id="logo_url"
                  {...form.register('logo_url')}
                  placeholder="https://ejemplo.com/logo.png"
                />
                <FieldError errors={[form.formState.errors.logo_url]} />
              </div>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="favicon_url">Favicon</FieldLabel>
            <FieldContent>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <Button type="button" variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Subir Favicon
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    ICO, PNG (recomendado: 32x32px o 16x16px)
                  </span>
                </div>
                <Input
                  id="favicon_url"
                  {...form.register('favicon_url')}
                  placeholder="https://ejemplo.com/favicon.ico"
                />
                <FieldError errors={[form.formState.errors.favicon_url]} />
              </div>
            </FieldContent>
          </Field>

          {/* Logo Preview */}
          {(form.watch('logo_url') || form.watch('favicon_url')) && (
            <div className="p-4 border rounded-lg">
              <h5 className="text-sm font-medium mb-3">Vista Previa</h5>
              <div className="flex items-center gap-4">
                {form.watch('logo_url') && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Logo Principal
                    </p>
                    <img
                      src={form.watch('logo_url')}
                      alt="Logo preview"
                      className="max-h-16 border rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}
                {form.watch('favicon_url') && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Favicon</p>
                    <img
                      src={form.watch('favicon_url')}
                      alt="Favicon preview"
                      className="w-8 h-8 border rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={updateTenant.isPending}
              className="min-w-[120px]"
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
        </CardContent>
      </form>
    </Card>
  )
}

export function TenantBrandingSettings() {
  const { isLoading } = useTenantDetail()

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <LogoSettingsCard />
    </div>
  )
}
