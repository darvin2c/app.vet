'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
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
import { Loader2, Building2, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

// Schemas for combined cards
const GeneralInfoSchema = z.object({
  name: z.string().nonempty('El nombre es requerido'),
  legal_name: z.string().optional(),
  email: z
    .string()
    .email('Formato de email inválido')
    .optional()
    .or(z.literal('')),
  phone: z.string().optional(),
})

const LegalLocationSchema = z.object({
  tax_id: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
})

type GeneralInfoData = z.infer<typeof GeneralInfoSchema>
type LegalLocationData = z.infer<typeof LegalLocationSchema>

// General Information Card (combines Basic Info + Contact)
function GeneralInfoCard() {
  const { data: tenant, isLoading } = useTenantDetail()
  const updateTenant = useTenantUpdate()

  const form = useForm<GeneralInfoData>({
    resolver: zodResolver(GeneralInfoSchema),
    defaultValues: {
      name: '',
      legal_name: '',
      email: '',
      phone: '',
    },
  })

  React.useEffect(() => {
    if (tenant) {
      form.reset({
        name: tenant.name || '',
        legal_name: tenant.legal_name || '',
        email: tenant.email || '',
        phone: tenant.phone || '',
      })
    }
  }, [tenant, form])

  const onSubmit = async (data: GeneralInfoData) => {
    try {
      await updateTenant.mutateAsync({
        name: data.name,
        legal_name: data.legal_name || null,
        email: data.email || null,
        phone: data.phone || null,
      })
      toast.success('Información general actualizada')
    } catch (error) {
      toast.error('Error al actualizar información general')
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
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <div>
              <h3 className="font-semibold">Información General</h3>
              <p className="text-sm text-muted-foreground">
                Datos básicos y contacto
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Field>
                <FieldLabel htmlFor="name">Nombre</FieldLabel>
                <FieldContent>
                  <Input id="name" {...form.register('name')} />
                  <FieldError errors={[form.formState.errors.name]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="legal_name">Razón Social</FieldLabel>
                <FieldContent>
                  <Input
                    id="legal_name"
                    {...form.register('legal_name')}
                    placeholder="Nombre legal de la empresa"
                  />
                  <FieldError errors={[form.formState.errors.legal_name]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <FieldContent>
                  <Input
                    id="email"
                    type="email"
                    {...form.register('email')}
                    placeholder="contacto@clinica.com"
                  />
                  <FieldError errors={[form.formState.errors.email]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="phone">Teléfono</FieldLabel>
                <FieldContent>
                  <Input
                    id="phone"
                    {...form.register('phone')}
                    placeholder="+51 999 999 999"
                  />
                  <FieldError errors={[form.formState.errors.phone]} />
                </FieldContent>
              </Field>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                size="sm"
                disabled={updateTenant.isPending}
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

// Legal and Location Information Card (combines Tax Info + Address)
function LegalLocationCard() {
  const { data: tenant, isLoading } = useTenantDetail()
  const updateTenant = useTenantUpdate()

  const form = useForm<LegalLocationData>({
    resolver: zodResolver(LegalLocationSchema),
    defaultValues: {
      tax_id: '',
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
    },
  })

  React.useEffect(() => {
    if (tenant) {
      const address = (tenant.address as any) || {}
      form.reset({
        tax_id: tenant.tax_id || '',
        street: address.street || '',
        city: address.city || '',
        state: address.state || '',
        postal_code: address.postal_code || '',
        country: address.country || '',
      })
    }
  }, [tenant, form])

  const onSubmit = async (data: LegalLocationData) => {
    try {
      await updateTenant.mutateAsync({
        tax_id: data.tax_id || null,
        address: {
          street: data.street || null,
          city: data.city || null,
          state: data.state || null,
          postal_code: data.postal_code || null,
          country: data.country || null,
        },
      })
      toast.success('Información legal y ubicación actualizada')
    } catch (error) {
      toast.error('Error al actualizar información legal y ubicación')
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
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div>
              <h3 className="font-semibold">Información Legal y Ubicación</h3>
              <p className="text-sm text-muted-foreground">
                Datos fiscales y dirección
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Field className="md:col-span-2">
                <FieldLabel htmlFor="tax_id">
                  RUC / Número de Identificación Fiscal
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="tax_id"
                    {...form.register('tax_id')}
                    placeholder="20123456789"
                  />
                  <FieldError errors={[form.formState.errors.tax_id]} />
                </FieldContent>
              </Field>

              <Field className="md:col-span-2">
                <FieldLabel htmlFor="street">Dirección</FieldLabel>
                <FieldContent>
                  <Input
                    id="street"
                    {...form.register('street')}
                    placeholder="Av. Principal 123"
                  />
                  <FieldError errors={[form.formState.errors.street]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="city">Ciudad</FieldLabel>
                <FieldContent>
                  <Input
                    id="city"
                    {...form.register('city')}
                    placeholder="Lima"
                  />
                  <FieldError errors={[form.formState.errors.city]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="state">Estado/Región</FieldLabel>
                <FieldContent>
                  <Input
                    id="state"
                    {...form.register('state')}
                    placeholder="Lima"
                  />
                  <FieldError errors={[form.formState.errors.state]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="postal_code">Código Postal</FieldLabel>
                <FieldContent>
                  <Input
                    id="postal_code"
                    {...form.register('postal_code')}
                    placeholder="15001"
                  />
                  <FieldError errors={[form.formState.errors.postal_code]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="country">País</FieldLabel>
                <FieldContent>
                  <Input
                    id="country"
                    {...form.register('country')}
                    placeholder="Perú"
                  />
                  <FieldError errors={[form.formState.errors.country]} />
                </FieldContent>
              </Field>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                size="sm"
                disabled={updateTenant.isPending}
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

// Main component that renders all cards
export function TenantGeneralSettings() {
  return (
    <div className="space-y-6">
      <GeneralInfoCard />
      <LegalLocationCard />
    </div>
  )
}
