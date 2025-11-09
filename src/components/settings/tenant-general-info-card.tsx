'use client'

import React from 'react'
import { useForm, Controller } from 'react-hook-form'
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
import PhoneInput from '@/components/ui/phone-input'
import { Loader2, Building2 } from 'lucide-react'
import { useTenantDetail } from '@/hooks/tenants/use-tenant-detail'
import { useTenantUpdate } from '@/hooks/tenants/use-tenant-update'
import { toast } from 'sonner'
import { Card, CardContent } from '../ui/card'

const GeneralInfoSchema = z.object({
  name: z.string().nonempty('El nombre es requerido'),
  legal_name: z.string().optional(),
  email: z.email('Formato de email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
})

type GeneralInfoData = z.infer<typeof GeneralInfoSchema>

export default function TenantGeneralInfoCard() {
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
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet>
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <FieldLegend>Información General</FieldLegend>
            </div>
            <FieldDescription>
              Datos básicos y contacto del negocio
            </FieldDescription>
            <FieldSeparator />
            <FieldGroup>
              <Field orientation="responsive">
                <FieldContent>
                  <FieldLabel htmlFor="name">Nombre</FieldLabel>
                  <FieldDescription>
                    Nombre comercial del tenant
                  </FieldDescription>
                </FieldContent>
                <div className="w-full sm:min-w-[300px]">
                  <Input id="name" {...form.register('name')} />
                  <FieldError errors={[form.formState.errors.name]} />
                </div>
              </Field>

              <FieldSeparator />

              <Field orientation="responsive">
                <FieldContent>
                  <FieldLabel htmlFor="legal_name">Razón Social</FieldLabel>
                  <FieldDescription>
                    Nombre legal de la empresa
                  </FieldDescription>
                </FieldContent>
                <div className="w-full sm:min-w-[300px]">
                  <Input id="legal_name" {...form.register('legal_name')} />
                  <FieldError errors={[form.formState.errors.legal_name]} />
                </div>
              </Field>

              <FieldSeparator />

              <Field orientation="responsive">
                <FieldContent>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <FieldDescription>Correo de contacto</FieldDescription>
                </FieldContent>
                <div className="w-full sm:min-w-[300px]">
                  <Input id="email" type="email" {...form.register('email')} />
                  <FieldError errors={[form.formState.errors.email]} />
                </div>
              </Field>

              <FieldSeparator />

              <Field orientation="responsive">
                <FieldContent>
                  <FieldLabel htmlFor="phone">Teléfono</FieldLabel>
                  <FieldDescription>
                    Número principal de contacto
                  </FieldDescription>
                </FieldContent>
                <div className="w-full sm:min-w-[300px]">
                  <Controller
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <PhoneInput
                        id="phone"
                        value={field.value || ''}
                        onChange={(val) => field.onChange(val)}
                      />
                    )}
                  />
                  <FieldError errors={[form.formState.errors.phone]} />
                </div>
              </Field>

              <FieldSeparator />

              <Field className="justify-end" orientation="responsive">
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
      </CardContent>
    </Card>
  )
}
