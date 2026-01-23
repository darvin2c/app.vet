'use client'

import { useFormContext } from 'react-hook-form'
import { Syringe } from 'lucide-react'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DatePicker } from '@/components/ui/date-picker'
import { VaccinationItemsManager } from './vaccination-items-manager'
import { ProductSelect } from '@/components/products/product-select'

export function VaccinationForm() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext()

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Syringe className="h-4 w-4" />
        Detalles de Vacunación
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="product_id">Producto</FieldLabel>
          <FieldContent>
            <ProductSelect
              value={watch('product_id')}
              onValueChange={(value) => setValue('product_id', value)}
              placeholder="Seleccionar producto..."
              onSelectProduct={(product) => {
                const currentItems = watch('items') || []
                // Solo agregar si no hay items
                if (currentItems.length === 0) {
                  setValue('items', [
                    {
                      product_id: product.id,
                      qty: 1,
                      unit_price: product.price,
                      product_name: product.name,
                    },
                  ])
                }
              }}
            />
            <FieldError errors={[errors.product_id]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="dose">Dosis</FieldLabel>
          <FieldContent>
            <Input
              id="dose"
              placeholder="Ej: 1ml, Primera dosis"
              {...register('dose')}
            />
            <FieldError errors={[errors.dose]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="route">Vía de Administración</FieldLabel>
          <FieldContent>
            <Input
              id="route"
              placeholder="Ej: Subcutánea, Intramuscular"
              {...register('route')}
            />
            <FieldError errors={[errors.route]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="site">Sitio de Aplicación</FieldLabel>
          <FieldContent>
            <Input
              id="site"
              placeholder="Ej: Cuello, Muslo derecho"
              {...register('site')}
            />
            <FieldError errors={[errors.site]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="next_due_at">Próxima Dosis</FieldLabel>
          <FieldContent>
            <DatePicker
              id="next_due_at"
              name="next_due_at"
              value={watch('next_due_at')}
              onChange={(value) => setValue('next_due_at', value)}
              error={!!errors.next_due_at}
            />
            <FieldError errors={[errors.next_due_at]} />
          </FieldContent>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="adverse_event">Eventos Adversos</FieldLabel>
        <FieldContent>
          <Textarea
            id="adverse_event"
            placeholder="Describe cualquier reacción adversa observada..."
            rows={3}
            {...register('adverse_event')}
          />
          <FieldError errors={[errors.adverse_event]} />
        </FieldContent>
      </Field>

      <VaccinationItemsManager />
    </div>
  )
}
