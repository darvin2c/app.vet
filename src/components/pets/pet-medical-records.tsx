'use client'

import { useState } from 'react'
import { MedicalRecordCreateButton } from '../medical-records/medical-record-create-button'
import { usePetMedicalRecords } from '@/hooks/pets/use-pet-medical-records'
import { PetMedicalRecordsList } from './pet-medical-records-list'

interface PetMedicalRecordsProps {
  petId: string
}

export function PetMedicalRecords({ petId }: PetMedicalRecordsProps) {
  const { data: medicalRecords = [] } = usePetMedicalRecords(petId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Registros Médicos
          </h2>
          <p className="text-muted-foreground">
            Historial completo de tratamientos y procedimientos médicos
          </p>
        </div>
        <MedicalRecordCreateButton petId={petId} />
      </div>
      <PetMedicalRecordsList
        petId={petId}
        medicalRecords={medicalRecords}
        isLoading={false}
      />
    </div>
  )
}
