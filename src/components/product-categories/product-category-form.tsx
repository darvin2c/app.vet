'use client'

import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { IsActiveFormField } from '@/components/ui/is-active-field'
import { Tables } from '@/types/supabase.types'

interface ProductCategoryFormProps {
  mode?: 'create' | 'edit'
  productCategory?: Tables<'product_categories'>
}

export function ProductCategoryForm({
  mode = 'create',
  productCategory,
}: ProductCategoryFormProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <div className="space-y-6">
      {/* Información básica */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Información básica</h3>
        <div className="grid grid-cols-1 gap-4">
          <Field>
            <FieldLabel htmlFor="name">Nombre *</FieldLabel>
            <FieldContent>
              <Input
                id="name"
                placeholder="Ingresa el nombre de la categoría"
                {...register('name')}
              />
              <FieldError errors={[errors.name]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="description">Descripción</FieldLabel>
            <FieldContent>
              <Textarea
                id="description"
                placeholder="Descripción de la categoría..."
                className="min-h-[100px]"
                {...register('description')}
              />
              <FieldError errors={[errors.description]} />
            </FieldContent>
          </Field>
        </div>
      </div>

      {/* Configuración */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Configuración</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <IsActiveFormField />
        </div>
      </div>
    </div>
  )
}
