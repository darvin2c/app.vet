'use client'

import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { Database } from '@/types/supabase.types'
import useDeleteStaff from '@/hooks/staff/use-staff-delete'
import { getStaffFullName } from '@/lib/staff-utils'

type Staff = Database['public']['Tables']['staff']['Row']

interface StaffDeleteProps {
  staff: Staff
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StaffDelete({ staff, open, onOpenChange }: StaffDeleteProps) {
  const deleteStaff = useDeleteStaff()

  const handleConfirm = async () => {
    await deleteStaff.mutateAsync(staff.id)
    onOpenChange(false)
  }

  const staffName = getStaffFullName(staff)

  return (
    <AlertConfirmation
      isOpen={open}
      onClose={() => onOpenChange(false)}
      onConfirm={handleConfirm}
      title="Eliminar Miembro del Staff"
      description={`¿Estás seguro de que deseas eliminar al miembro del staff "${staffName}"? Esta acción no se puede deshacer y se perderán todos los datos asociados.`}
      confirmText="ELIMINAR"
      isLoading={deleteStaff.isPending}
    />
  )
}
