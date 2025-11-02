'use client'

import { useState } from 'react'
import { MoreHorizontal, UserCheck, UserX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UserWithRole } from '@/hooks/users/use-user-list'
import { UserRolesEdit } from './user-roles-edit'
import { UserDeactivate } from './user-deactivate'

interface UserActionsProps {
  user: UserWithRole
}

export function UserActions({ user }: UserActionsProps) {
  const [showRolesDialog, setShowRolesDialog] = useState(false)
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false)

  // Transformar user a UserWithRoleForEdit para UserRolesEdit
  const userForEdit = {
    ...user,
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {user.is_active && (
            <DropdownMenuItem onClick={() => setShowRolesDialog(true)}>
              <UserCheck className="mr-2 h-4 w-4" />
              Asignar rol
            </DropdownMenuItem>
          )}
          {user.is_active && (
            <DropdownMenuItem
              onClick={() => setShowDeactivateDialog(true)}
              className="text-destructive"
              variant="destructive"
            >
              <UserX className="mr-2 h-4 w-4" />
              Desactivar usuario
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <UserRolesEdit
        user={userForEdit}
        open={showRolesDialog}
        onOpenChange={setShowRolesDialog}
      />

      <UserDeactivate
        user={user}
        open={showDeactivateDialog}
        onOpenChange={setShowDeactivateDialog}
      />
    </>
  )
}
