'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DrawerForm } from '@/components/ui/drawer-form'
import { DrawerFooter } from '@/components/ui/drawer'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { StaffSpecialtyForm } from './staff-specialty-form'
import { CreateStaffSpecialtySchema, createStaffSpecialtySchema } from '@/schemas/staff-specialties.schema'
import useStaffSpecialtyCreate from '@/hooks/staff-specialties/use-staff-specialty-create'

interface StaffSpecialtyCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  staffId?: string
  specialtyId?: string
}

export function StaffSpecialtyCreate({ 
  open, 
  onOpenChange, 
  staffId, 
  specialtyId 
}: StaffSpecialtyCreateProps) {
  const { mutate: createStaffSpecialty, isPending } = useStaffSpecialtyCreate()
  
  const form = useForm<CreateStaffSpecialtySchema>({
    resolver: zodResolver(createStaffSpecialtySchema),
    defaultValues: {
      staff_id: staffId || '',
      specialty_id: specialtyId || '',
    },
  })

  const onSubmit = (data: CreateStaffSpecialtySchema) => {
    createStaffSpecialty(data, {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    })
  }

  return (
    <DrawerForm
      open={open}
      onOpenChange={onOpenChange}
      title="Asignar Especialidad"
      description="Asigna una especialidad a un miembro del staff"
      form={form}
      onSubmit={onSubmit}
    >
      <StaffSpecialtyForm />
      
      <DrawerFooter>
        <ResponsiveButton
          type="submit"
          loading={isPending}
          disabled={isPending}
        >
          Asignar Especialidad
        </ResponsiveButton>
        <ResponsiveButton
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isPending}
        >
          Cancelar
        </ResponsiveButton>
      </DrawerFooter>
    </DrawerForm>
  )
}