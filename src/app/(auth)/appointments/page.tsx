import PageBase from '@/components/page-base'
import { AppointmentList } from '@/components/appointments/appointment-list'

export default function AppointmentsPage() {
  return (
    <PageBase title="Citas" subtitle="Gestiona las citas médicas programadas">
      <AppointmentList />
    </PageBase>
  )
}
