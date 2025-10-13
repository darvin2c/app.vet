import { AppointmentTypeList } from '@/components/appointment-types/appointment-type-list'
import { SearchInput } from '@/components/ui/search-input'
import PageBase from '@/components/page-base'

export default function AppointmentTypesPage() {
  return (
    <PageBase
      title="Tipos de Cita"
      subtitle="Configurar tipos de citas disponibles en el sistema"
      search={<SearchInput placeholder="Buscar tipos de cita..." />}
    >
      <AppointmentTypeList />
    </PageBase>
  )
}
