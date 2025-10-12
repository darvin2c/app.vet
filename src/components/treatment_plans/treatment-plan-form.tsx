'use client'

import { useFormContext } from 'react-hook-form'
import { TreatmentPlanCreate } from '@/schemas/treatment-plans.schema'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldError,
} from '@/components/ui/field'
import useStaff from '@/hooks/staff/use-staff'
import { PatientSelect } from '@/components/patients/patient-select'

interface TreatmentPlanFormProps {
  disablePatientSelection?: boolean
}

export function TreatmentPlanForm({
  disablePatientSelection = false,
}: TreatmentPlanFormProps) {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<TreatmentPlanCreate>()

  const { data: staff = [] } = useStaff()
  const selectedStaffId = watch('staff_id')
  const selectedPatientId = watch('patient_id')

  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel htmlFor="title">Título del Plan *</FieldLabel>
        <FieldContent>
          <Input
            id="title"
            placeholder="Ej: Plan de Rehabilitación Oral Completa"
            {...control.register('title')}
          />
          <FieldError errors={[errors.title]} />
        </FieldContent>
      </Field>

      {!disablePatientSelection && (
        <Field>
          <FieldLabel htmlFor="patient_id">Paciente *</FieldLabel>
          <FieldContent>
            <PatientSelect
              value={selectedPatientId}
              onValueChange={(value) => setValue('patient_id', value)}
              placeholder="Seleccione el paciente"
            />
            <FieldError errors={[errors.patient_id]} />
          </FieldContent>
        </Field>
      )}

      <Field>
        <FieldLabel htmlFor="staff_id">Profesional Responsable *</FieldLabel>
        <FieldContent>
          <Select
            value={selectedStaffId}
            onValueChange={(value) => setValue('staff_id', value)}
          >
            <SelectTrigger id="staff_id">
              <SelectValue placeholder="Seleccione el profesional" />
            </SelectTrigger>
            <SelectContent>
              {staff.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.first_name} {member.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError errors={[errors.staff_id]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="notes">Notas del Plan</FieldLabel>
        <FieldContent>
          <Textarea
            id="notes"
            placeholder="Describa los objetivos y consideraciones del plan de tratamiento"
            className="resize-none"
            rows={4}
            {...control.register('notes')}
          />
          <FieldError errors={[errors.notes]} />
        </FieldContent>
      </Field>
    </div>
  )
}
