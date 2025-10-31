'use client'

import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { Tables } from '@/types/supabase.types'
import { useRoleDelete } from '@/hooks/roles/use-role-delete'

interface RoleDeleteProps {
  role: Tables<'roles'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RoleDelete({ role, open, onOpenChange }: RoleDeleteProps) {
  const deleteRole = useRoleDelete()

  const handleConfirm = async () => {
    await deleteRole.mutateAsync(role.id)
    onOpenChange(false)
  }

  return (
    <AlertConfirmation
      isOpen={open}
      onClose={() => onOpenChange(false)}
      onConfirm={handleConfirm}
      title="Eliminar Rol"
      description={
        <>
          ¿Estás seguro de que deseas eliminar el rol{' '}
          <strong>{role.name}</strong>? Esta acción no se puede deshacer y se
          perderán todos los datos asociados.
          {role.perms && role.perms.length > 0 && (
            <div className="mt-2 text-sm text-muted-foreground">
              Este rol tiene {role.perms.length} permiso
              {role.perms.length !== 1 ? 's' : ''} asignado
              {role.perms.length !== 1 ? 's' : ''}.
            </div>
          )}
        </>
      }
      confirmText="ELIMINAR"
      isLoading={deleteRole.isPending}
    />
  )
}
