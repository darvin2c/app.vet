'use client'

import { EntitySelect } from '@/components/ui/entity-select'
import { useAppointmentTypeList } from '@/hooks/appointment-types/use-appointment-type-list'
import { AppointmentTypeCreate } from './appointment-type-create'
import { AppointmentTypeEdit } from './appointment-type-edit'
import { Database } from '@/types/supabase.types'
import { useState } from 'react'

type AppointmentType = Database['public']['Tables']['appointment_types']['Row']

interface AppointmentTypeSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  className?: string
  placeholder?: string
}

export function AppointmentTypeSelect({
  value,
  onValueChange,
  disabled,
  className,
  placeholder = 'Seleccionar tipo de cita...',
}: AppointmentTypeSelectProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const { data, isLoading } = useAppointmentTypeList({
    search: searchTerm,
    pagination: {
      page: 1,
      pageSize: 50,
    },
    filters: [
      {
        field: 'is_active',
        operator: 'eq',
        value: true,
      },
    ],
  })

  const appointmentTypes = data?.data || []

  return (
    <EntitySelect<AppointmentType>
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      className={className}
      placeholder={placeholder}
      items={appointmentTypes}
      isPending={isLoading}
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
      renderCreate={(props) => <AppointmentTypeCreate {...props} />}
      renderEdit={(props) => {
        const type = appointmentTypes.find((t) => t.id === props.id)
        if (!type) return null
        return <AppointmentTypeEdit {...props} appointmentType={type} />
      }}
      renderItem={(type) => (
        <div className="flex items-center gap-2">
          <span
            className="w-4 h-4 rounded-full"
            style={{ background: type.color || 'inherit' }}
          />
          <div className="flex flex-col">
            <span>{type.name}</span>
            {type.description && (
              <span className="text-sm text-muted-foreground">
                {type.description}
              </span>
            )}
          </div>
        </div>
      )}
      renderSelected={(type) => (
        <div className="flex items-center gap-2">
          <span
            className="w-4 h-4 rounded-full"
            style={{ background: type.color || 'inherit' }}
          />
          <span>{type.name}</span>
        </div>
      )}
    />
  )
}
