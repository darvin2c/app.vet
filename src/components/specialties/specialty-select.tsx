'use client'

import { EntitySelect } from '@/components/ui/entity-select'
import { supabase } from '@/lib/supabase/client'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'
import { Tables } from '@/types/supabase.types'
import { useQuery } from '@tanstack/react-query'
import { GraduationCap } from 'lucide-react'
import { useState } from 'react'

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
  const { currentTenant } = useCurrentTenantStore()

  const { data: specialties = [], isLoading } = useQuery({
    queryKey: ['specialties', currentTenant?.id, searchTerm],
    queryFn: async () => {
      if (!currentTenant?.id) return []

      let query = supabase
        .from('specialties')
        .select('*')
        .eq('tenant_id', currentTenant.id)
        .eq('is_active', true)
        .order('name')

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Error al obtener especialidades: ${error.message}`)
      }

      return data || []
    },
    enabled: !!currentTenant?.id,
  })

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
