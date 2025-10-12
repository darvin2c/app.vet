'use client'

import { useFormContext } from 'react-hook-form'
import {
  ProductMovementFormData,
  MovementReferenceType,
} from '@/schemas/product-movements.schema'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ProductSelect } from '@/components/products/product-select'
import { format } from 'date-fns'

export function ProductMovementForm() {
  const { control, watch } = useFormContext<ProductMovementFormData>()

  // Observar la cantidad para determinar si es entrada o salida
  const quantity = watch('quantity')
  const isEntry = quantity >= 0

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="product_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Producto *</FormLabel>
              <FormControl>
                <ProductSelect
                  value={field.value || ''}
                  onValueChange={field.onChange}
                  placeholder="Seleccionar producto..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="reference_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Movimiento</FormLabel>
              <FormControl>
                <Select
                  value={field.value || ''}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={MovementReferenceType.ENTRY}>
                      {MovementReferenceType.ENTRY}
                    </SelectItem>
                    <SelectItem value={MovementReferenceType.EXIT}>
                      {MovementReferenceType.EXIT}
                    </SelectItem>
                    <SelectItem value={MovementReferenceType.ADJUSTMENT}>
                      {MovementReferenceType.ADJUSTMENT}
                    </SelectItem>
                    <SelectItem value={MovementReferenceType.TRANSFER}>
                      {MovementReferenceType.TRANSFER}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Cantidad * {isEntry ? '(Entrada +)' : '(Salida -)'}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => {
                    const value = e.target.value
                    field.onChange(value === '' ? 0 : Number(value))
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="movement_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de Movimiento *</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  {...field}
                  value={
                    field.value ? format(field.value, "yyyy-MM-dd'T'HH:mm") : ''
                  }
                  onChange={(e) => {
                    const value = e.target.value
                    field.onChange(value ? new Date(value) : new Date())
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="unit_cost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Costo Unitario</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => {
                    const value = e.target.value
                    field.onChange(value === '' ? 0 : Number(value))
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="unit_cost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Costo Unitario</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => {
                    const value = e.target.value
                    field.onChange(value === '' ? 0 : Number(value))
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="reference"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Referencia</FormLabel>
            <FormControl>
              <Input
                placeholder="Número de factura, orden, etc."
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="note"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notas</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Observaciones adicionales..."
                className="resize-none"
                rows={3}
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
