import PageBase from '@/components/page-base'
import { AppointmentList } from '@/components/appointments/appointment-list'
import CanAccess from '@/components/ui/can-access'

export default function AppointmentsPage() {
  return (
    <CanAccess resource="appointments" action="read">
      <PageBase title="Citas" subtitle="Gestiona las citas médicas programadas">
        <AppointmentList />
      </PageBase>
    </CanAccess>
  )
}
