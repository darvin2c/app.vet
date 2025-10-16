'use client'

import { useFormContext } from 'react-hook-form'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Scissors, Sparkles, Camera, FileText, AlertCircle } from 'lucide-react'

export function GroomingForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <div className="space-y-6 border-t pt-6">
      <div className="flex items-center gap-2 mb-4">
        <Scissors className="h-5 w-5 text-pink-600" />
        <h3 className="text-lg font-semibold">Información de Peluquería</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="service_type">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Tipo de Servicio
            </div>
          </FieldLabel>
          <FieldContent>
            <Input
              id="service_type"
              placeholder="Ej: Corte completo, Baño y secado, Corte de uñas"
              {...register('service_type')}
            />
            <FieldError errors={[errors.service_type]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="coat_condition">Condición del Pelaje</FieldLabel>
          <FieldContent>
            <Input
              id="coat_condition"
              placeholder="Ej: Enredado, Limpio, Con nudos"
              {...register('coat_condition')}
            />
            <FieldError errors={[errors.coat_condition]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="before_photos">
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Fotos Antes (URLs)
            </div>
          </FieldLabel>
          <FieldContent>
            <Input
              id="before_photos"
              placeholder="URLs de fotos separadas por comas"
              {...register('before_photos')}
            />
            <FieldError errors={[errors.before_photos]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="after_photos">
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Fotos Después (URLs)
            </div>
          </FieldLabel>
          <FieldContent>
            <Input
              id="after_photos"
              placeholder="URLs de fotos separadas por comas"
              {...register('after_photos')}
            />
            <FieldError errors={[errors.after_photos]} />
          </FieldContent>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="products_used">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Productos Utilizados
          </div>
        </FieldLabel>
        <FieldContent>
          <Textarea
            id="products_used"
            placeholder="Shampoo, acondicionador, productos especiales utilizados..."
            rows={3}
            {...register('products_used')}
          />
          <FieldError errors={[errors.products_used]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="special_instructions">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Instrucciones Especiales
          </div>
        </FieldLabel>
        <FieldContent>
          <Textarea
            id="special_instructions"
            placeholder="Cuidados especiales, sensibilidades, preferencias del cliente..."
            rows={3}
            {...register('special_instructions')}
          />
          <FieldError errors={[errors.special_instructions]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="groomer_notes">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Notas del Peluquero
          </div>
        </FieldLabel>
        <FieldContent>
          <Textarea
            id="groomer_notes"
            placeholder="Observaciones, recomendaciones, próximas citas..."
            rows={3}
            {...register('groomer_notes')}
          />
          <FieldError errors={[errors.groomer_notes]} />
        </FieldContent>
      </Field>
    </div>
  )
}
