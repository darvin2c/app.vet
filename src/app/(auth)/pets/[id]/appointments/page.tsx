'use client'

import { useParams } from 'next/navigation'
import { AppointmentList } from '@/components/appointments/appointment-list'
import { AppointmentCreateButton } from '@/components/appointments/appointment-create-button'
import PageBase from '@/components/page-base'

export default function PetAppointmentsPage() {
  const params = useParams()
  const petId = params.id as string

  return (
    <PageBase
      title="Citas"
      subtitle="Historial de citas de la mascota"
      actions={<AppointmentCreateButton petId={petId} />}
    >
      <AppointmentList
        filters={[{ field: 'pet_id', operator: 'eq', value: petId }]}
      />
    </PageBase>
  )
}
