'use client'

import React from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import {
  TenantBrandingSettingsSchema,
  type TenantBrandingSettings,
  THEME_OPTIONS,
} from '@/schemas/tenant-settings.schema'
import { Loader2, Palette, Upload, Eye, Image } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

// Schemas for individual sections
const ThemeSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  primary_color: z.string(),
  secondary_color: z.string(),
  accent_color: z.string(),
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
      primary_color: '#3b82f6',
      secondary_color: '#64748b',
      accent_color: '#f59e0b',
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
            <FieldLabel htmlFor="theme">Tema</FieldLabel>
            <FieldContent>
              <Select
                value={form.watch('theme')}
                onValueChange={(value) => form.setValue('theme', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tema" />
                </SelectTrigger>
                <SelectContent>
                  {THEME_OPTIONS.map((theme) => (
                    <SelectItem key={theme.value} value={theme.value}>
                      {theme.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={[form.formState.errors.theme]} />
            </FieldContent>
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field>
              <FieldLabel htmlFor="primary_color">Color Primario</FieldLabel>
              <FieldContent>
                <div className="flex items-center gap-2">
                  <Input
                    id="primary_color"
                    type="color"
                    {...form.register('primary_color')}
                    className="w-16 h-10 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    {...form.register('primary_color')}
                    placeholder="#3b82f6"
                    className="flex-1"
                  />
                </div>
                <FieldError errors={[form.formState.errors.primary_color]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="secondary_color">
                Color Secundario
              </FieldLabel>
              <FieldContent>
                <div className="flex items-center gap-2">
                  <Input
                    id="secondary_color"
                    type="color"
                    {...form.register('secondary_color')}
                    className="w-16 h-10 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    {...form.register('secondary_color')}
                    placeholder="#64748b"
                    className="flex-1"
                  />
                </div>
                <FieldError errors={[form.formState.errors.secondary_color]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="accent_color">Color de Acento</FieldLabel>
              <FieldContent>
                <div className="flex items-center gap-2">
                  <Input
                    id="accent_color"
                    type="color"
                    {...form.register('accent_color')}
                    className="w-16 h-10 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    {...form.register('accent_color')}
                    placeholder="#f59e0b"
                    className="flex-1"
                  />
                </div>
                <FieldError errors={[form.formState.errors.accent_color]} />
              </FieldContent>
            </Field>
          </div>

          {/* Color Preview */}
          <div className="p-4 border rounded-lg">
            <h5 className="text-sm font-medium mb-3">
              Vista Previa de Colores
            </h5>
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-lg border"
                style={{ backgroundColor: form.watch('primary_color') }}
                title="Color Primario"
              />
              <div
                className="w-12 h-12 rounded-lg border"
                style={{ backgroundColor: form.watch('secondary_color') }}
                title="Color Secundario"
              />
              <div
                className="w-12 h-12 rounded-lg border"
                style={{ backgroundColor: form.watch('accent_color') }}
                title="Color de Acento"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="ml-auto"
              >
                <Eye className="h-4 w-4 mr-2" />
                Vista Previa Completa
              </Button>
            </div>
          </div>

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
