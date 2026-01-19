'use client'

import { EntitySelect } from '@/components/ui/entity-select'
import useAppointmentTypes from '@/hooks/appointment-types/use-appointment-type-list'
import { AppointmentTypeCreate } from './appointment-type-create'
import { AppointmentTypeEdit } from './appointment-type-edit'
import { Database } from '@/types/supabase.types'
import { Circle } from 'lucide-react'

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
  const { appointmentTypes, isLoading, searchTerm, setSearchTerm } =
    useAppointmentTypes()

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
      renderEdit={(props) => <AppointmentTypeEdit {...props} />}
      renderItem={(type) => (
        <div className="flex items-center gap-2">
          <Circle
            className="w-4 h-4 text-muted-foreground"
            style={{ color: type.color || 'inherit' }}
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
          <Circle
            className="w-4 h-4 text-muted-foreground"
            style={{ color: type.color || 'inherit' }}
          />
          <span>{type.name}</span>
        </div>
      )}
    />
  )
}
