'use client'

import { useParams } from 'next/navigation'
import { PetMedicalRecords } from '@/components/pets/pet-medical-records'
import { MedicalRecordCreateButton } from '@/components/medical-records/medical-record-create-button'
import PageBase from '@/components/page-base'

export default function PetMedicalHistoryPage() {
  const params = useParams()
  const petId = params.id as string

  return (
    <PageBase
      title="Registros Médicos"
      subtitle="Historial completo de tratamientos y procedimientos médicos"
      actions={<MedicalRecordCreateButton petId={petId} />}
    >
      <PetMedicalRecords petId={petId} />
    </PageBase>
  )
}
