'use client'

import { EntitySelect } from '@/components/ui/entity-select'
import { Tables } from '@/types/supabase.types'
import { GraduationCap } from 'lucide-react'
import { useState } from 'react'
import { useSpecialtyList } from '@/hooks/specialties/use-specialty-list'

type Specialty = Tables<'specialties'>

interface SpecialtySelectProps {
  value?: string[]
  onValueChange?: (value: string[]) => void
  placeholder?: string
  disabled?: boolean
  multiple?: boolean
  className?: string
}

export function SpecialtySelect({
  value = [],
  onValueChange,
  placeholder = 'Seleccionar especialidad...',
  disabled = false,
  multiple = true,
  className,
}: SpecialtySelectProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const { data: result, isLoading } = useSpecialtyList({
    search: searchTerm,
    pagination: {
      page: 1,
      pageSize: 1000, // Load enough items
    },
  })

  const specialties = result?.data || []

  return (
    <EntitySelect<Specialty>
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      className={className}
      placeholder={placeholder}
      items={specialties}
      isPending={isLoading}
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
      multiple={multiple}
      renderItem={(specialty) => (
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span>{specialty.name}</span>
            {specialty.description && (
              <span className="text-sm text-muted-foreground">
                {specialty.description}
              </span>
            )}
          </div>
        </div>
      )}
      renderSelected={(specialty) => (
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-muted-foreground" />
          <span className="truncate">{specialty.name}</span>
        </div>
      )}
    />
  )
}
