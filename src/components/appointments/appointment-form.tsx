'use client'

import { useFormContext } from 'react-hook-form'
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { PetSelect } from '@/components/pets/pet-select'
import { StaffSelect } from '@/components/staff/staff-select'
import { AppointmentTypeSelect } from '@/components/appointment-types/appointment-type-select'
import { AppointmentStatusGrid } from '@/components/appointments/appointment-status-grid'

import type { CreateAppointmentSchema } from '@/schemas/appointments.schema'
import DatePicker from '../ui/date-picker'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'
import { addMinutes, differenceInMinutes } from 'date-fns'

interface AppointmentFormProps {
  disablePetSelection?: boolean
}

export function AppointmentForm({
  disablePetSelection = false,
}: AppointmentFormProps) {
  // context
  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<CreateAppointmentSchema>()

  const scheduledStart = watch('scheduled_start')
  const scheduledEnd = watch('scheduled_end')

  const durationValue =
    scheduledStart && scheduledEnd
      ? differenceInMinutes(new Date(scheduledEnd), new Date(scheduledStart))
      : ''

  return (
    <div className="space-y-6">
      <FieldGroup>
        <Field data-invalid={!!errors.pet_id}>
          <FieldLabel htmlFor="pet_id">Mascota *</FieldLabel>
          <FieldContent>
            <PetSelect
              value={watch('pet_id') || ''}
              onValueChange={(value) => setValue('pet_id', value)}
              placeholder="Seleccionar mascota"
              disabled={disablePetSelection}
            />
            <FieldError errors={[errors.pet_id]} />
          </FieldContent>
        </Field>

        <Field data-invalid={!!errors.veterinarian_id}>
          <FieldLabel htmlFor="veterinarian_id">Veterinario</FieldLabel>
          <FieldContent>
            <StaffSelect
              value={watch('veterinarian_id') || ''}
              onValueChange={(value) => setValue('veterinarian_id', value)}
              placeholder="Seleccionar veterinario"
            />
            <FieldError errors={[errors.veterinarian_id]} />
          </FieldContent>
        </Field>
      </FieldGroup>

      <FieldGroup>
        <Field data-invalid={!!errors.appointment_type_id}>
          <FieldLabel htmlFor="appointment_type_id">Tipo de Cita *</FieldLabel>
          <FieldContent>
            <AppointmentTypeSelect
              value={watch('appointment_type_id') || ''}
              onValueChange={(value) => setValue('appointment_type_id', value)}
              placeholder="Seleccionar tipo"
            />
            <FieldError errors={[errors.appointment_type_id]} />
          </FieldContent>
        </Field>
      </FieldGroup>

      <FieldGroup>
        <Field data-invalid={!!errors.scheduled_start}>
          <FieldLabel htmlFor="scheduled_start">Fecha y Horario *</FieldLabel>
          <FieldContent>
            <div className="flex  gap-2">
              <DatePicker
                value={scheduledStart}
                hasTime
                onChange={(value) => {
                  if (value) {
                    setValue('scheduled_start', value.toISOString())
                    const currentDuration =
                      typeof durationValue === 'number' ? durationValue : 60
                    const endDate = addMinutes(value, currentDuration)
                    setValue('scheduled_end', endDate.toISOString())
                  }
                }}
              />
              <InputGroup className="max-w-30">
                <InputGroupInput
                  id="scheduled_duration"
                  list="duration"
                  placeholder="duración"
                  type="number"
                  min="0"
                  value={durationValue}
                  onChange={(e) => {
                    const duration = parseInt(e.target.value) || 0
                    if (scheduledStart && duration > 0) {
                      const start = new Date(scheduledStart)
                      const end = addMinutes(start, duration)
                      setValue('scheduled_end', end.toISOString())
                    }
                  }}
                />
                <datalist id="duration">
                  <option value="15">15 minutos</option>
                  <option value="30">30 minutos</option>
                  <option value="45">45 minutos</option>
                  <option value="60">1 hora</option>
                  <option value="75">1 hora y 15 minutos</option>
                  <option value="90">1 hora y 30 minutos</option>
                  <option value="120">2 horas</option>
                </datalist>
                <InputGroupAddon align="inline-end">mins</InputGroupAddon>
              </InputGroup>
            </div>
            <FieldError errors={[errors.scheduled_start]} />
          </FieldContent>
        </Field>
      </FieldGroup>

      <FieldGroup>
        <Field data-invalid={!!errors.status}>
          <FieldLabel htmlFor="status">Estado *</FieldLabel>
          <FieldContent>
            <AppointmentStatusGrid
              value={watch('status') || ''}
              onValueChange={(value) => setValue('status', value as any)}
            />
            <FieldError errors={[errors.status]} />
          </FieldContent>
        </Field>
      </FieldGroup>

      <FieldGroup>
        <Field data-invalid={!!errors.reason}>
          <FieldLabel htmlFor="reason">Motivo de la Cita</FieldLabel>
          <FieldContent>
            <Textarea
              id="reason"
              placeholder="Motivo de la consulta..."
              className="resize-none"
              {...control.register('reason')}
            />
            <FieldError errors={[errors.reason]} />
          </FieldContent>
        </Field>
      </FieldGroup>
    </div>
  )
}
