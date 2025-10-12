'use client'

import { useFormContext } from 'react-hook-form'
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import { StaffSelect } from '@/components/staff/staff-select'
import { SpecialtySelect } from '@/components/specialties/specialty-select'
import { CreateStaffSpecialtySchema } from '@/schemas/staff-specialties.schema'

export function StaffSpecialtyForm() {
  const { setValue, watch, formState: { errors } } = useFormContext<CreateStaffSpecialtySchema>()
  
  const staffId = watch('staff_id')
  const specialtyId = watch('specialty_id')

  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel htmlFor="staff_id">Miembro del Staff *</FieldLabel>
        <FieldContent>
          <StaffSelect
            value={staffId}
            onValueChange={(value) => setValue('staff_id', value)}
            placeholder="Seleccionar miembro del staff..."
          />
          <FieldError errors={[errors.staff_id]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="specialty_id">Especialidad *</FieldLabel>
        <FieldContent>
          <SpecialtySelect
            value={specialtyId ? [specialtyId] : []}
            onValueChange={(value) => setValue('specialty_id', value[0] || '')}
            placeholder="Seleccionar especialidad..."
            multiple={false}
          />
          <FieldError errors={[errors.specialty_id]} />
        </FieldContent>
      </Field>
    </div>
  )
}