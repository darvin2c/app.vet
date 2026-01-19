'use client'

import { EntitySelect } from '@/components/ui/entity-select'
import useStaffList from '@/hooks/staff/use-staff-list'
import { StaffCreate } from './staff-create'
import { StaffEdit } from './staff-edit'
import { Database, Tables } from '@/types/supabase.types'
import { UserCheck } from 'lucide-react'
import { useState } from 'react'

type Staff = Tables<'staff'> & {
  staff_specialties: {
    specialty_id: string
    specialties: {
      id: string
      name: string
      is_active: boolean
    } | null
  }[]
}

interface StaffSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  className?: string
  placeholder?: string
}

export function StaffSelect({
  value,
  onValueChange,
  disabled,
  className,
  placeholder = 'Seleccionar personal...',
}: StaffSelectProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const { data, isLoading } = useStaffList({
    search: searchTerm,
  })
  const staff = data?.data || []

  const getStaffFullName = (member: Staff) => {
    return `${member.first_name} ${member.last_name}`
  }

  return (
    <EntitySelect<Staff>
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      className={className}
      placeholder={placeholder}
      items={staff}
      isPending={isLoading}
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
      renderCreate={(props) => <StaffCreate {...props} />}
      renderEdit={(props) => {
        const member = staff.find((s) => s.id === props.id)
        if (!member) return null
        return <StaffEdit {...props} staff={member} />
      }}
      renderItem={(member) => (
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="font-medium">{getStaffFullName(member)}</span>
            {member.email && (
              <span className="text-sm text-muted-foreground">
                {member.email}
              </span>
            )}
          </div>
        </div>
      )}
      renderSelected={(member) => (
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="font-medium">{getStaffFullName(member)}</span>
            {member.email && (
              <span className="text-xs text-muted-foreground">
                {member.email}
              </span>
            )}
          </div>
        </div>
      )}
    />
  )
}
