'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldError,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Loader2, FileText } from 'lucide-react'
import { useTenantDetail } from '@/hooks/tenants/use-tenant-detail'
import { useTenantUpdate } from '@/hooks/tenants/use-tenant-update'
import { toast } from 'sonner'

const LegalLocationSchema = z.object({
  tax: z.number().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
})

type LegalLocationData = z.infer<typeof LegalLocationSchema>

export default function TenantLegalLocationCard() {
  const { data: tenant, isLoading } = useTenantDetail()
  const updateTenant = useTenantUpdate()

  const form = useForm<LegalLocationData>({
    resolver: zodResolver(LegalLocationSchema),
    defaultValues: {
      tax: 0,
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
    },
  })

  React.useEffect(() => {
    if (tenant) {
      const address = (tenant.address ?? {}) as Partial<{
        street: string
        city: string
        state: string
        postal_code: string
        country: string
      }>

      form.reset({
        tax: tenant.tax ?? 0,
        street: address.street ?? '',
        city: address.city ?? '',
        state: address.state ?? '',
        postal_code: address.postal_code ?? '',
        country: address.country ?? '',
      })
    }
  }, [tenant, form])

  const onSubmit = async (data: LegalLocationData) => {
    try {
      await updateTenant.mutateAsync({
        tax: data.tax ?? null,
        address: {
          street: data.street ?? null,
          city: data.city ?? null,
          state: data.state ?? null,
          postal_code: data.postal_code ?? null,
          country: data.country ?? null,
        },
      })
      toast.success('Información legal y ubicación actualizada')
    } catch (error) {
      toast.error('Error al actualizar información legal y ubicación')
    }
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldSet>
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <FieldLegend>Información Legal y Ubicación</FieldLegend>
          </div>
          <FieldDescription>
            Datos fiscales y dirección del negocio
          </FieldDescription>
          <FieldSeparator />

          <FieldGroup>
            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="tax">Impuesto (%)</FieldLabel>
                <FieldDescription>
                  Valor entre 0 y 1 (ej. 0.18)
                </FieldDescription>
              </FieldContent>
              <div className="w-full sm:min-w-[300px]">
                <Input
                  id="tax"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  {...form.register('tax', { valueAsNumber: true })}
                  placeholder="0.18"
                />
                <FieldError errors={[form.formState.errors.tax]} />
              </div>
            </Field>

            <FieldSeparator />

            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="street">Dirección</FieldLabel>
                <FieldDescription>Ej. Av. Principal 123</FieldDescription>
              </FieldContent>
              <div className="w-full sm:min-w-[300px]">
                <Input id="street" {...form.register('street')} />
                <FieldError errors={[form.formState.errors.street]} />
              </div>
            </Field>

            <FieldSeparator />

            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="city">Ciudad</FieldLabel>
                <FieldDescription>Ej. Lima</FieldDescription>
              </FieldContent>
              <div className="w-full sm:min-w-[300px]">
                <Input id="city" {...form.register('city')} />
                <FieldError errors={[form.formState.errors.city]} />
              </div>
            </Field>

            <FieldSeparator />

            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="state">Estado/Región</FieldLabel>
                <FieldDescription>Ej. Lima</FieldDescription>
              </FieldContent>
              <div className="w-full sm:min-w-[300px]">
                <Input id="state" {...form.register('state')} />
                <FieldError errors={[form.formState.errors.state]} />
              </div>
            </Field>

            <FieldSeparator />

            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="postal_code">Código Postal</FieldLabel>
                <FieldDescription>Ej. 15001</FieldDescription>
              </FieldContent>
              <div className="w-full sm:min-w-[300px]">
                <Input id="postal_code" {...form.register('postal_code')} />
                <FieldError errors={[form.formState.errors.postal_code]} />
              </div>
            </Field>

            <FieldSeparator />

            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="country">País</FieldLabel>
                <FieldDescription>Ej. Perú</FieldDescription>
              </FieldContent>
              <div className="w-full sm:min-w-[300px]">
                <Input id="country" {...form.register('country')} />
                <FieldError errors={[form.formState.errors.country]} />
              </div>
            </Field>

            <FieldSeparator />

            <Field orientation="responsive">
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
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => form.reset()}
              >
                Cancelar
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  )
}
