'use client'

import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useHospitalizations } from '@/hooks/hospitalizations/use-hospitalization-list'

interface HospitalizationSelectProps {
  value?: string
  onValueChange?: (value: string | null) => void
  placeholder?: string
  petId?: string
}

export function HospitalizationSelect({
  value,
  onValueChange,
  placeholder = 'Seleccionar hospitalización',
  petId,
}: HospitalizationSelectProps) {
  const { data: hospitalizations = [], isLoading } = useHospitalizations({
    petId,
    filters: [],
    orders: [],
    search: '',
  })

  return (
    <Select
      value={value || 'none'}
      onValueChange={(val) => onValueChange?.(val === 'none' ? null : val)}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">Sin hospitalización</SelectItem>
        {isLoading ? (
          <SelectItem value="loading" disabled>
            Cargando...
          </SelectItem>
        ) : (
          hospitalizations.map((hospitalization) => (
            <SelectItem key={hospitalization.id} value={hospitalization.id}>
              Hospitalización -{' '}
              {new Date(hospitalization.admission_at).toLocaleDateString()}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  )
}
