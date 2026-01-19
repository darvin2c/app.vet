'use client'

import { EntitySelect } from '@/components/ui/entity-select'
import { useRoleList } from '@/hooks/roles/use-role-list'
import { Tables } from '@/types/supabase.types'
import { RoleCreate } from './role-create'
import { RoleEdit } from './role-edit'
import { Shield } from 'lucide-react'
import { useState } from 'react'

type Role = Tables<'roles'>

interface RoleSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function RoleSelect({
  value,
  onValueChange,
  placeholder = 'Seleccionar rol...',
  disabled = false,
  className,
}: RoleSelectProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const { data, isLoading } = useRoleList({
    search: searchTerm,
  })

  const roles = data?.data || []

  return (
    <EntitySelect<Role>
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      className={className}
      placeholder={placeholder}
      items={roles}
      isPending={isLoading}
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
      renderCreate={(props) => <RoleCreate {...props} />}
      renderEdit={(props) => {
        const role = roles.find((r) => r.id === props.id)
        if (!role) return null
        return <RoleEdit {...props} role={role} />
      }}
      renderItem={(role) => (
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="font-medium">{role.name}</span>
            {role.description && (
              <span className="text-sm text-muted-foreground">
                {role.description}
              </span>
            )}
          </div>
        </div>
      )}
      renderSelected={(role) => (
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{role.name}</span>
        </div>
      )}
    />
  )
}
