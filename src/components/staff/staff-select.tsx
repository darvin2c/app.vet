'use client'

import { EntitySelect } from '@/components/ui/entity-select'
import useStaffList from '@/hooks/staff/use-staff-list'
import { StaffCreate } from './staff-create'
import { StaffEdit } from './staff-edit'
import { Database } from '@/types/supabase.types'
import { UserCheck } from 'lucide-react'

type Staff = Database['public']['Tables']['staff']['Row']

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
  const { staff, isLoading, searchTerm, setSearchTerm } = useStaffList()

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
      renderEdit={(props) => <StaffEdit {...props} />}
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
