'use client'

import { EntitySelect } from '@/components/ui/entity-select'
import { useUserList, UserWithRole } from '@/hooks/users/use-user-list'
import { User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useState } from 'react'

interface UserSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function UserSelect({
  value,
  onValueChange,
  placeholder = 'Seleccionar usuario...',
  disabled = false,
  className,
}: UserSelectProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const { data, isLoading } = useUserList({
    search: searchTerm,
  })

  const users = data?.data || []

  return (
    <EntitySelect<UserWithRole>
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      className={className}
      placeholder={placeholder}
      items={users}
      isPending={isLoading}
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
      renderItem={(user) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-4 w-4">
            <AvatarImage src={''} />
            <AvatarFallback className="text-xs">
              {user.first_name?.[0]}
              {user.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span>
              {user.first_name} {user.last_name}
            </span>
            <span className="text-sm text-muted-foreground">{user.email}</span>
          </div>
        </div>
      )}
      renderSelected={(user) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          <div className="flex items-center gap-1">
            <span>
              {user.first_name} {user.last_name}
            </span>
            {user.email && (
              <span className="text-xs text-muted-foreground">
                ({user.email})
              </span>
            )}
          </div>
        </div>
      )}
    />
  )
}
