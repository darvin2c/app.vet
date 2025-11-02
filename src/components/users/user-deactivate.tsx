'use client'

import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { useUserDeactivate } from '@/hooks/users/use-user-deactivate'
import { UserWithRole } from '@/hooks/users/use-user-list'

interface UserDeactivateProps {
  user: UserWithRole
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserDeactivate({
  user,
  open,
  onOpenChange,
}: UserDeactivateProps) {
  const deactivateUser = useUserDeactivate()

  const handleConfirm = async () => {
    await deactivateUser.mutateAsync({
      userId: user.id,
    })
    onOpenChange(false)
  }

  const userName = `${user.first_name} ${user.last_name}`.trim()

  return (
    <AlertConfirmation
      isOpen={open}
      onClose={() => onOpenChange(false)}
      onConfirm={handleConfirm}
      title="Desactivar Usuario"
      description={
        <div className="space-y-2">
          <div>
            ¿Estás seguro de que deseas desactivar al usuario{' '}
            <strong>{userName}</strong>?
          </div>
          <div className="text-sm text-muted-foreground">
            El usuario no podrá acceder al sistema hasta que sea reactivado.
            Esta acción se puede revertir posteriormente.
          </div>
          <div className="text-sm font-medium">
            Para confirmar, escribe: <strong>DESACTIVAR</strong>
          </div>
        </div>
      }
      confirmText="DESACTIVAR"
      isLoading={deactivateUser.isPending}
    />
  )
}
