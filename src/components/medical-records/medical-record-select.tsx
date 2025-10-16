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

  return (
    <Select
      value={value || ''}
      onValueChange={(val) => onValueChange?.(val === '' ? '' : val)}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">Sin registro médico</SelectItem>
        {isLoading ? (
          <SelectItem value="" disabled>
            Cargando...
          </SelectItem>
        ) : (
          medicalRecords.map((medicalRecord) => (
            <SelectItem key={medicalRecord.id} value={medicalRecord.id}>
              {medicalRecord.type} -{' '}
              {new Date(medicalRecord.date).toLocaleDateString()}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  )
}
