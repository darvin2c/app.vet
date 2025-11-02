'use client'

import { useState } from 'react'
import { MoreHorizontal, UserCog, UserX } from 'lucide-react'
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
  const [showRolesEdit, setShowRolesEdit] = useState(false)
  const [showDeactivate, setShowDeactivate] = useState(false)

  const isActive = user.is_active

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
          <DropdownMenuItem onClick={() => setShowRolesEdit(true)}>
            <UserCog className="mr-2 h-4 w-4" />
            Asignar rol
          </DropdownMenuItem>
          {isActive && (
            <DropdownMenuItem
              onClick={() => setShowDeactivate(true)}
              variant="destructive"
            >
              <UserX className="mr-2 h-4 w-4" />
              Desactivar
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal para editar roles */}
      {showRolesEdit && (
        <UserRolesEdit
          user={user}
          open={showRolesEdit}
          onOpenChange={setShowRolesEdit}
        />
      )}

      {/* Modal para desactivar usuario */}
      <UserDeactivate
        user={user}
        open={showDeactivate}
        onOpenChange={setShowDeactivate}
      />
    </>
  )
}
