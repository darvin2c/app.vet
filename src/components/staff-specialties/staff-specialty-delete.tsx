'use client'

import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { getStaffFullName } from '@/lib/staff-utils'
import useStaffSpecialtyDelete from '@/hooks/staff-specialties/use-staff-specialty-delete'
import { Tables } from '@/types/supabase.types'

interface StaffSpecialtyDeleteProps {
  staffSpecialty: Tables<'staff_specialties'> & {
    staff?: {
      id: string
      first_name: string
      last_name: string | null
      email: string | null
      is_active: boolean
    } | null
    specialties?: {
      id: string
      name: string
      is_active: boolean
    } | null
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StaffSpecialtyDelete({
  staffSpecialty,
  open,
  onOpenChange,
}: StaffSpecialtyDeleteProps) {
  const { mutate: deleteStaffSpecialty, isPending } = useStaffSpecialtyDelete()

  const handleDelete = () => {
    deleteStaffSpecialty(
      {
        staffId: staffSpecialty.staff_id,
        specialtyId: staffSpecialty.specialty_id,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      }
    )
  }

  const staffName = staffSpecialty.staff
    ? getStaffFullName(staffSpecialty.staff)
    : 'Staff'
  const specialtyName = staffSpecialty.specialties?.name || 'Especialidad'

  return (
    <AlertConfirmation
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Eliminar asignación de especialidad"
      description={`¿Estás seguro de que deseas eliminar la asignación de la especialidad "${specialtyName}" del staff "${staffName}"?`}
      confirmText={`eliminar ${specialtyName}`}
      onConfirm={handleDelete}
      isLoading={isPending}
    />
  )
}
