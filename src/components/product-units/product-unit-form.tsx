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
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ingresa el código de la unidad"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="decimals"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Decimales *</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Número de decimales (0-4)"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                min={0}
                max={4}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <IsActiveFormField />
    </div>
  )
}
