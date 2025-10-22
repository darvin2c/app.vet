'use client'

import { MedicalRecordCreateButton } from '../medical-records/medical-record-create-button'
import { MedicalRecordList } from '../medical-records/medical-record-list'

interface PetMedicalRecordsProps {
  petId: string
}

export function PetMedicalRecords({ petId }: PetMedicalRecordsProps) {
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
      <MedicalRecordList
        petId={petId}
        filterConfig={[]}
        orderByConfig={{
          columns: [],
        }}
      />
    </div>
  )
}
