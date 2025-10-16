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
import { DatePicker } from '@/components/ui/date-picker'
import { Bug, Pill, Calendar, Weight, FileText, Syringe } from 'lucide-react'

export function DewormingForm() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext()

  return (
    <div className="space-y-6 border-t pt-6">
      <div className="flex items-center gap-2 mb-4">
        <Bug className="h-5 w-5 text-amber-600" />
        <h3 className="text-lg font-semibold">
          Información de Desparasitación
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="parasite_type">
            <div className="flex items-center gap-2">
              <Bug className="h-4 w-4" />
              Tipo de Parásito
            </div>
          </FieldLabel>
          <FieldContent>
            <Input
              id="parasite_type"
              placeholder="Ej: Lombrices, Tenias, Pulgas"
              {...register('parasite_type')}
            />
            <FieldError errors={[errors.parasite_type]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="medication">
            <div className="flex items-center gap-2">
              <Pill className="h-4 w-4" />
              Medicamento
            </div>
          </FieldLabel>
          <FieldContent>
            <Input
              id="medication"
              placeholder="Ej: Drontal, Milbemax, Bravecto"
              {...register('medication')}
            />
            <FieldError errors={[errors.medication]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="dosage">Dosis</FieldLabel>
          <FieldContent>
            <Input
              id="dosage"
              placeholder="Ej: 1 tableta, 2ml, según peso"
              {...register('dosage')}
            />
            <FieldError errors={[errors.dosage]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="administration_route">
            <div className="flex items-center gap-2">
              <Syringe className="h-4 w-4" />
              Vía de Administración
            </div>
          </FieldLabel>
          <FieldContent>
            <Input
              id="administration_route"
              placeholder="Ej: Oral, Tópica, Inyectable"
              {...register('administration_route')}
            />
            <FieldError errors={[errors.administration_route]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="weight_at_treatment">
            <div className="flex items-center gap-2">
              <Weight className="h-4 w-4" />
              Peso al Registro (kg)
            </div>
          </FieldLabel>
          <FieldContent>
            <Input
              id="weight_at_treatment"
              type="number"
              min="0"
              step="0.1"
              placeholder="Ej: 15.5"
              {...register('weight_at_treatment', { valueAsNumber: true })}
            />
            <FieldError errors={[errors.weight_at_treatment]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="next_dose_date">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Próxima Dosis
            </div>
          </FieldLabel>
          <FieldContent>
            <DatePicker
              id="next_dose_date"
              name="next_dose_date"
              value={watch('next_dose_date')}
              onChange={(value) => setValue('next_dose_date', value)}
              placeholder="Seleccionar fecha de próxima dosis"
              hasTime={false}
              error={errors.next_dose_date?.message as string}
            />
            <FieldError errors={[errors.next_dose_date]} />
          </FieldContent>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="treatment_notes">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Notas del Registro
          </div>
        </FieldLabel>
        <FieldContent>
          <Textarea
            id="treatment_notes"
            placeholder="Observaciones, reacciones, recomendaciones para el propietario..."
            rows={4}
            {...register('treatment_notes')}
          />
          <FieldError errors={[errors.treatment_notes]} />
        </FieldContent>
      </Field>
    </div>
  )
}
