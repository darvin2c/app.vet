'use client'

import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import useStaffSpecialtyDelete from '@/hooks/staff-specialties/use-staff-specialty-delete'
import { Tables } from '@/types/supabase.types'

interface StaffSpecialtyDeleteProps {
  staffSpecialty: Tables<'staff_specialties'> & {
    staff?: { first_name: string; last_name: string } | null
    specialties?: { name: string } | null
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StaffSpecialtyDelete({ staffSpecialty, open, onOpenChange }: StaffSpecialtyDeleteProps) {
  const { mutate: deleteStaffSpecialty, isPending } = useStaffSpecialtyDelete()

  const handleDelete = () => {
    deleteStaffSpecialty(
      { 
        staffId: staffSpecialty.staff_id, 
        specialtyId: staffSpecialty.specialty_id 
      },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      }
    )
  }

  const staffName = staffSpecialty.staff 
    ? `${staffSpecialty.staff.first_name} ${staffSpecialty.staff.last_name}`
    : 'Staff'
  
  const specialtyName = staffSpecialty.specialties?.name || 'Especialidad'

  return (
    <AlertConfirmation
      open={open}
      onOpenChange={onOpenChange}
      title="Desasignar Especialidad"
      description={`¿Estás seguro de que deseas desasignar la especialidad "${specialtyName}" de "${staffName}"? Esta acción no se puede deshacer.`}
      confirmText={specialtyName}
      onConfirm={handleDelete}
      loading={isPending}
      variant="destructive"
    />
  )
}