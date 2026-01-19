'use client'

import { EntitySelect } from '@/components/ui/entity-select'
import { useHospitalizations } from '@/hooks/hospitalizations/use-hospitalization-list'
import { Tables } from '@/types/supabase.types'
import { Activity } from 'lucide-react'
import { useState } from 'react'

type Hospitalization = Tables<'hospitalizations'>

interface HospitalizationSelectProps {
  value?: string
  onValueChange?: (value: string | null) => void
  placeholder?: string
  petId?: string
  className?: string
  disabled?: boolean
}

export function HospitalizationSelect({
  value,
  onValueChange,
  placeholder = 'Seleccionar hospitalización',
  petId,
  className,
  disabled,
}: HospitalizationSelectProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: hospitalizations = [], isLoading } = useHospitalizations({
    petId,
    filters: [],
    orders: [],
    search: searchTerm,
  })

  const handleValueChange = (val: string) => {
    onValueChange?.(val || null)
  }

  return (
    <EntitySelect<Hospitalization>
      value={value || ''}
      onValueChange={handleValueChange}
      disabled={disabled}
      className={className}
      placeholder={placeholder}
      items={hospitalizations}
      isPending={isLoading}
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
      renderItem={(hospitalization) => (
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span>Hospitalización</span>
            {hospitalization.admission_at && (
              <span className="text-sm text-muted-foreground">
                Ingreso:{' '}
                {new Date(hospitalization.admission_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      )}
      renderSelected={(hospitalization) => (
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-muted-foreground" />
          <span>
            Hospitalización (
            {new Date(hospitalization.admission_at).toLocaleDateString()})
          </span>
        </div>
      )}
    />
  )
}
