import { useFormContext } from 'react-hook-form'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TreatmentFormData } from '@/schemas/treatment.schema'

export function TreatmentForm() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<TreatmentFormData>()
  const watchedType = watch('treatment_type')
  const watchedStatus = watch('status')

  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel htmlFor="reason">Motivo</FieldLabel>
        <FieldContent>
          <Input
            id="reason"
            {...register('reason')}
            placeholder="Motivo del tratamiento"
          />
          <FieldError errors={[errors.reason]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="treatment_type">Tipo de Tratamiento</FieldLabel>
        <FieldContent>
          <Select
            value={watchedType}
            onValueChange={(value) => setValue('treatment_type', value as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona el tipo de tratamiento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="consultation">Consulta</SelectItem>
              <SelectItem value="vaccination">Vacunación</SelectItem>
              <SelectItem value="surgery">Cirugía</SelectItem>
              <SelectItem value="grooming">Peluquería</SelectItem>
              <SelectItem value="hospitalization">Hospitalización</SelectItem>
              <SelectItem value="deworming">Desparasitación</SelectItem>
              <SelectItem value="boarding">Hospedaje</SelectItem>
              <SelectItem value="training">Entrenamiento</SelectItem>
            </SelectContent>
          </Select>
          <FieldError errors={[errors.treatment_type]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="status">Estado</FieldLabel>
        <FieldContent>
          <Select
            value={watchedStatus}
            onValueChange={(value) => setValue('status', value as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona el estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Borrador</SelectItem>
              <SelectItem value="completed">Completado</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
          <FieldError errors={[errors.status]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="treatment_date">Fecha del Tratamiento</FieldLabel>
        <FieldContent>
          <Input
            id="treatment_date"
            type="date"
            {...register('treatment_date')}
          />
          <FieldError errors={[errors.treatment_date]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="vet_id">Veterinario</FieldLabel>
        <FieldContent>
          <Input
            id="vet_id"
            {...register('vet_id')}
            placeholder="ID del veterinario"
          />
          <FieldError errors={[errors.vet_id]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="diagnosis">Diagnóstico</FieldLabel>
        <FieldContent>
          <Textarea
            id="diagnosis"
            {...register('diagnosis')}
            placeholder="Diagnóstico del tratamiento"
            rows={3}
          />
          <FieldError errors={[errors.diagnosis]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="notes">Notas</FieldLabel>
        <FieldContent>
          <Textarea
            id="notes"
            {...register('notes')}
            placeholder="Notas adicionales"
            rows={3}
          />
          <FieldError errors={[errors.notes]} />
        </FieldContent>
      </Field>
    </div>
  )
}
