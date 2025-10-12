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
import { PatientSelect } from '@/components/patients/patient-select'
import { StaffSelect } from '@/components/staff/staff-select'
import { AppointmentTypeSelect } from '@/components/appointment-types/appointment-type-select'
import { ProcedureSelect } from '@/components/procedures/procedure-select'
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
  disablePatientSelection?: boolean
}

export function AppointmentForm({
  disablePatientSelection = false,
}: AppointmentFormProps) {
  // context
  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<CreateAppointmentSchema>()

  // Watch staff and date changes to get available time slots
  const staffId = watch('staff_id')
  const startTime = watch('start_time')

  // Get available time slots for the selected date and staff
  const selectedDate = startTime ? new Date(startTime) : undefined
  const { data: availableTimeSlots = [] } = useAvailableTimeSlots({
    date: selectedDate,
    staffId,
  })

  return (
    <div className="space-y-6">
      <FieldGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field data-invalid={!!errors.patient_id}>
            <FieldLabel htmlFor="patient_id">Paciente *</FieldLabel>
            <FieldContent>
              <PatientSelect
                value={watch('patient_id') || ''}
                onValueChange={(value) => setValue('patient_id', value)}
                placeholder="Seleccionar paciente"
                disabled={disablePatientSelection}
              />
              <FieldError errors={[errors.patient_id]} />
            </FieldContent>
          </Field>

          <Field data-invalid={!!errors.staff_id}>
            <FieldLabel htmlFor="staff_id">Personal Médico *</FieldLabel>
            <FieldContent>
              <StaffSelect
                value={watch('staff_id') || ''}
                onValueChange={(value) => setValue('staff_id', value)}
                placeholder="Seleccionar personal"
              />
              <FieldError errors={[errors.staff_id]} />
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

          <Field data-invalid={!!errors.procedure_id}>
            <FieldLabel htmlFor="procedure_id">Procedimiento</FieldLabel>
            <FieldContent>
              <ProcedureSelect
                value={watch('procedure_id') || ''}
                onValueChange={(value) =>
                  setValue('procedure_id', value || undefined)
                }
                placeholder="Seleccionar procedimiento"
              />
              <FieldError errors={[errors.procedure_id]} />
            </FieldContent>
          </Field>
        </div>
      </FieldGroup>

      <FieldGroup>
        <Field data-invalid={!!errors.start_time}>
          <FieldLabel htmlFor="start_time">Fecha y Horario *</FieldLabel>
          <FieldContent>
            <Calendar20
              startValue={
                watch('start_time') ? new Date(watch('start_time')) : undefined
              }
              endValue={
                watch('end_time') ? new Date(watch('end_time')) : undefined
              }
              onStartChange={(date) =>
                setValue('start_time', date?.toISOString() || '')
              }
              onEndChange={(date) =>
                setValue('end_time', date?.toISOString() || '')
              }
              placeholder="Seleccionar fecha y horario"
              minDate={new Date()}
              availableTimeSlots={availableTimeSlots}
            />
            <FieldError errors={[errors.start_time]} />
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
