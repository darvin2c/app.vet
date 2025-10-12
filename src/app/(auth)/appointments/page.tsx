import PageBase from '@/components/page-base'
import { AppointmentList } from '@/components/appointments/appointment-list'
import { AppointmentCreateButton } from '@/components/appointments/appointment-create-button'

export default function AppointmentsPage() {
  return (
    <PageBase
      title="Citas"
      subtitle="Gestiona las citas médicas programadas"
      actions={<AppointmentCreateButton />}
    >
      <AppointmentList />
    </PageBase>
  )
}