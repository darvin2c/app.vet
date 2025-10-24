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
import { Loader2, Palette, Upload, Image } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

// Schemas for individual sections
const ThemeSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
})

const LogoSettingsSchema = z.object({
  logo_url: z.string().optional(),
  favicon_url: z.string().optional(),
})

const CustomCSSSchema = z.object({
  custom_css: z.string().optional(),
})

type ThemeSettings = z.infer<typeof ThemeSettingsSchema>
type LogoSettings = z.infer<typeof LogoSettingsSchema>
type CustomCSSSettings = z.infer<typeof CustomCSSSchema>

// Theme Settings Component
function ThemeSettingsCard() {
  const { data: tenant, isLoading } = useTenantDetail()
  const updateTenant = useTenantUpdate()

  const form = useForm<ThemeSettings>({
    resolver: zodResolver(ThemeSettingsSchema),
    defaultValues: {
      theme: 'light',
    },
  })

  const onSubmit: SubmitHandler<ThemeSettings> = async (data) => {
    try {
      console.log('Theme settings to save:', data)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Configuración de tema guardada correctamente')
    } catch (error) {
      console.error('Error updating theme settings:', error)
      toast.error('Error al guardar la configuración de tema')
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
          <Palette className="h-5 w-5" />
          Tema y Colores
        </CardTitle>
        <CardDescription>
          Personaliza la apariencia visual de tu aplicación
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <Field>
            <FieldLabel htmlFor="theme">Theme:</FieldLabel>
            <FieldContent>
              <div className="flex items-center gap-4">
                {/* Light Theme Card */}
                <div
                  className={`relative cursor-pointer rounded-lg border-2 p-3 transition-all ${
                    form.watch('theme') === 'light'
                      ? 'border-blue-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => form.setValue('theme', 'light')}
                >
                  <div className="flex flex-col items-center space-y-2">
                    {/* Light Theme Preview */}
                    <div className="w-16 h-12 rounded border border-gray-200 bg-white relative overflow-hidden">
                      <div className="absolute top-1 left-1 right-1 h-2 bg-gray-100 rounded-sm"></div>
                      <div className="absolute top-4 left-1 right-1 h-1 bg-gray-200 rounded-sm"></div>
                      <div className="absolute top-6 left-1 w-8 h-1 bg-gray-200 rounded-sm"></div>
                      <div className="absolute top-8 left-1 w-6 h-1 bg-gray-200 rounded-sm"></div>
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-medium text-gray-900">
                        Light
                      </span>
                      <p className="text-xs text-gray-500">
                        Tema claro para uso diurno
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dark Theme Card */}
                <div
                  className={`relative cursor-pointer rounded-lg border-2 p-3 transition-all ${
                    form.watch('theme') === 'dark'
                      ? 'border-blue-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => form.setValue('theme', 'dark')}
                >
                  <div className="flex flex-col items-center space-y-2">
                    {/* Dark Theme Preview */}
                    <div className="w-16 h-12 rounded border border-gray-600 bg-gray-900 relative overflow-hidden">
                      <div className="absolute top-1 left-1 right-1 h-2 bg-gray-700 rounded-sm"></div>
                      <div className="absolute top-4 left-1 right-1 h-1 bg-gray-600 rounded-sm"></div>
                      <div className="absolute top-6 left-1 w-8 h-1 bg-gray-600 rounded-sm"></div>
                      <div className="absolute top-8 left-1 w-6 h-1 bg-gray-600 rounded-sm"></div>
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-medium text-gray-900">
                        Dark
                      </span>
                      <p className="text-xs text-gray-500">
                        Tema oscuro para reducir fatiga visual
                      </p>
                    </div>
                  </div>
                </div>

                {/* Auto/System Theme Card */}
                <div
                  className={`relative cursor-pointer rounded-lg border-2 p-3 transition-all ${
                    form.watch('theme') === 'system'
                      ? 'border-blue-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => form.setValue('theme', 'system')}
                >
                  <div className="flex flex-col items-center space-y-2">
                    {/* Auto Theme Preview - Split half light/half dark */}
                    <div className="w-16 h-12 rounded border border-gray-300 relative overflow-hidden">
                      {/* Left half - Light */}
                      <div className="absolute top-0 left-0 w-8 h-full bg-white">
                        <div className="absolute top-1 left-1 right-0 h-2 bg-gray-100 rounded-sm"></div>
                        <div className="absolute top-4 left-1 right-0 h-1 bg-gray-200 rounded-sm"></div>
                        <div className="absolute top-6 left-1 w-4 h-1 bg-gray-200 rounded-sm"></div>
                        <div className="absolute top-8 left-1 w-3 h-1 bg-gray-200 rounded-sm"></div>
                      </div>
                      {/* Right half - Dark */}
                      <div className="absolute top-0 right-0 w-8 h-full bg-gray-900">
                        <div className="absolute top-1 left-0 right-1 h-2 bg-gray-700 rounded-sm"></div>
                        <div className="absolute top-4 left-0 right-1 h-1 bg-gray-600 rounded-sm"></div>
                        <div className="absolute top-6 left-0 w-4 h-1 bg-gray-600 rounded-sm"></div>
                        <div className="absolute top-8 left-0 w-3 h-1 bg-gray-600 rounded-sm"></div>
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-medium text-gray-900">
                        Auto
                      </span>
                      <p className="text-xs text-gray-500">
                        Se adapta automáticamente al sistema
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <FieldError errors={[form.formState.errors.theme]} />
            </FieldContent>
          </Field>

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

// Custom CSS Settings Component
function CustomCSSCard() {
  const { data: tenant, isLoading } = useTenantDetail()
  const updateTenant = useTenantUpdate()

  const form = useForm<CustomCSSSettings>({
    resolver: zodResolver(CustomCSSSchema),
    defaultValues: {
      custom_css: '',
    },
  })

  const onSubmit: SubmitHandler<CustomCSSSettings> = async (data) => {
    try {
      console.log('Custom CSS to save:', data)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('CSS personalizado guardado correctamente')
    } catch (error) {
      console.error('Error updating custom CSS:', error)
      toast.error('Error al guardar el CSS personalizado')
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
        <CardTitle>CSS Personalizado</CardTitle>
        <CardDescription>
          Añade estilos CSS personalizados para mayor personalización
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <Field>
            <FieldLabel htmlFor="custom_css">CSS Personalizado</FieldLabel>
            <FieldContent>
              <textarea
                id="custom_css"
                {...form.register('custom_css')}
                placeholder="/* Añade tu CSS personalizado aquí */
.custom-header {
  background-color: var(--primary-color);
}

.custom-button {
  border-radius: 8px;
}"
                rows={8}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
              />
              <FieldError errors={[form.formState.errors.custom_css]} />
              <p className="text-xs text-muted-foreground mt-2">
                ⚠️ Usa con precaución. CSS mal formateado puede afectar la
                apariencia de la aplicación.
              </p>
            </FieldContent>
          </Field>

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
  const { data: tenant, isLoading } = useTenantDetail()

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
      <ThemeSettingsCard />
      <LogoSettingsCard />
      <CustomCSSCard />
    </div>
  )
}
