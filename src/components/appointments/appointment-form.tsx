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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PetSelect } from '@/components/pets/pet-select'
import { StaffSelect } from '@/components/staff/staff-select'
import { AppointmentTypeSelect } from '@/components/appointment-types/appointment-type-select'

import Calendar20 from '@/components/ui/calendar-20'
import { useAvailableTimeSlots } from '@/hooks/appointments/use-available-time-slots'
import type { CreateAppointmentSchema } from '@/schemas/appointments.schema'

const APPOINTMENT_STATUSES = [
  { value: 'scheduled', label: 'Programada' },
  { value: 'confirmed', label: 'Confirmada' },
  { value: 'in_progress', label: 'En Progreso' },
  { value: 'completed', label: 'Completada' },
  { value: 'cancelled', label: 'Cancelada' },
  { value: 'no_show', label: 'No Asistió' },
] as const

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

  // Watch veterinarian and date changes to get available time slots
  const veterinarianId = watch('veterinarian_id')
  const scheduledStart = watch('scheduled_start')

  // Get available time slots for the selected date and veterinarian
  const selectedDate = scheduledStart ? new Date(scheduledStart) : undefined
  const { data: availableTimeSlots = [] } = useAvailableTimeSlots({
    date: selectedDate,
    staffId: veterinarianId,
  })

  return (
    <div className="space-y-6">
      <FieldGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
      </FieldGroup>

      <FieldGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field data-invalid={!!errors.appointment_type_id}>
            <FieldLabel htmlFor="appointment_type_id">
              Tipo de Cita *
            </FieldLabel>
            <FieldContent>
              <AppointmentTypeSelect
                value={watch('appointment_type_id') || ''}
                onValueChange={(value) =>
                  setValue('appointment_type_id', value)
                }
                placeholder="Seleccionar tipo"
              />
              <FieldError errors={[errors.appointment_type_id]} />
            </FieldContent>
          </Field>
        </div>
      </FieldGroup>

      <FieldGroup>
        <Field data-invalid={!!errors.scheduled_start}>
          <FieldLabel htmlFor="scheduled_start">Fecha y Horario *</FieldLabel>
          <FieldContent>
            <Calendar20
              startValue={
                watch('scheduled_start') ? new Date(watch('scheduled_start')) : undefined
              }
              endValue={
                watch('scheduled_end') ? new Date(watch('scheduled_end')) : undefined
              }
              onStartChange={(date) =>
                setValue('scheduled_start', date?.toISOString() || '')
              }
              onEndChange={(date) =>
                setValue('scheduled_end', date?.toISOString() || '')
              }
              placeholder="Seleccionar fecha y horario"
              minDate={new Date()}
              availableTimeSlots={availableTimeSlots}
            />
            <FieldError errors={[errors.scheduled_start]} />
          </FieldContent>
        </Field>
      </FieldGroup>

      <FieldGroup>
        <Field data-invalid={!!errors.status}>
          <FieldLabel htmlFor="status">Estado *</FieldLabel>
          <FieldContent>
            <Select {...control.register('status')}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                {APPOINTMENT_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

      <FieldGroup>
        <Field data-invalid={!!errors.notes}>
          <FieldLabel htmlFor="notes">Notas</FieldLabel>
          <FieldContent>
            <Textarea
              id="notes"
              placeholder="Notas adicionales sobre la cita..."
              className="resize-none"
              {...control.register('notes')}
            />
            <FieldError errors={[errors.notes]} />
          </FieldContent>
        </Field>
      </FieldGroup>
    </div>
  )
}
