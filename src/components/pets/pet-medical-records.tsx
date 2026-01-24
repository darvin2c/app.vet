'use client'

import { MedicalRecordList } from '../medical-records/medical-record-list'

interface PetMedicalRecordsProps {
  petId: string
}

export function PetMedicalRecords({ petId }: PetMedicalRecordsProps) {
  return (
    <MedicalRecordList
      petId={petId}
      filterConfig={[]}
      orderByConfig={{
        columns: [],
      }}
    />
  )
}
