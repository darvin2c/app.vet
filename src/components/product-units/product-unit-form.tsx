'use client'

import { useFormContext } from 'react-hook-form'
import { CreateProductUnitSchema } from '@/schemas/product-units.schema'
import { Input } from '@/components/ui/input'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { IsActiveFormField } from '@/components/ui/is-active-field'

export function ProductUnitForm() {
  const { control } = useFormContext<CreateProductUnitSchema>()

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ingresa el nombre de la unidad"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="abbreviation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Abreviación *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ingresa la abreviación de la unidad"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <IsActiveFormField />
    </div>
  )
}
