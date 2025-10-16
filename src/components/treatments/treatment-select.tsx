'use client'

import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePetTreatments } from '@/hooks/pets/use-pet-treatments'

interface TreatmentSelectProps {
  value?: string
  onValueChange?: (value: string | null) => void
  placeholder?: string
  petId?: string
}

export function TreatmentSelect({
  value,
  onValueChange,
  placeholder = 'Seleccionar tratamiento',
  petId,
}: TreatmentSelectProps) {
  const { data: treatments = [], isLoading } = usePetTreatments(petId || '')

  return (
    <Select
      value={value || ''}
      onValueChange={(val) => onValueChange?.(val === '' ? null : val)}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">Sin tratamiento</SelectItem>
        {isLoading ? (
          <SelectItem value="" disabled>
            Cargando...
          </SelectItem>
        ) : (
          treatments.map((treatment) => (
            <SelectItem key={treatment.id} value={treatment.id}>
              {treatment.treatment_type} -{' '}
              {new Date(treatment.treatment_date).toLocaleDateString()}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  )
}
