'use client'

import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePetMedicalRecords } from '@/hooks/pets/use-pet-medical-records'

interface MedicalRecordSelectProps {
  petId?: string
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
}

export function MedicalRecordSelect({
  petId,
  value,
  onValueChange,
  placeholder = 'Seleccionar registro médico',
}: MedicalRecordSelectProps) {
  const { data: medicalRecords = [], isLoading } = usePetMedicalRecords(
    petId || ''
  )

  const handleValueChange = (val: string) => {
    if (val === 'none') {
      onValueChange?.('')
    } else {
      onValueChange?.(val)
    }
  }

  return (
    <Select value={value || 'none'} onValueChange={handleValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">Sin registro médico</SelectItem>
        {isLoading ? (
          <SelectItem value="loading" disabled>
            Cargando...
          </SelectItem>
        ) : (
          medicalRecords.map((medicalRecord) => (
            <SelectItem key={medicalRecord.id} value={medicalRecord.id}>
              {medicalRecord.record_type} -{' '}
              {new Date(medicalRecord.record_date).toLocaleDateString()}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  )
}
