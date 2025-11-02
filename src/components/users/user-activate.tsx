'use client'

import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { useUserActivate } from '@/hooks/users/use-user-activate'
import { UserWithRole } from '@/hooks/users/use-user-list'

interface UserActivateProps {
  user: UserWithRole
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserActivate({ user, open, onOpenChange }: UserActivateProps) {
  const activateUser = useUserActivate()

  const handleConfirm = async () => {
    await activateUser.mutateAsync({
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
      title="Activar Usuario"
      description={
        <div className="space-y-2">
          <div>
            ¿Estás seguro de que deseas activar al usuario{' '}
            <strong>{userName}</strong>?
          </div>
          <div className="text-sm text-muted-foreground">
            El usuario podrá acceder al sistema nuevamente y realizar todas las
            acciones permitidas por su rol.
          </div>
          <div className="text-sm font-medium">
            Para confirmar, escribe: <strong>ACTIVAR</strong>
          </div>
        </div>
      }
      confirmText="ACTIVAR"
      isLoading={activateUser.isPending}
    />
  )
}
