import PageBase from '@/components/page-base'
import { AppointmentTypeList } from '@/components/appointment-types/appointment-type-list'
import { AppointmentTypeCreateButton } from '@/components/appointment-types/appointment-type-create-button'
import { SearchInput } from '@/components/ui/search-input'
import { Calendar } from 'lucide-react'

export default function AppointmentTypesPage() {
  return (
    <PageBase
      title={
        <div className="flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          Tipos de Cita
        </div>
      }
      subtitle="Configurar tipos de citas disponibles en el sistema"
      search={<SearchInput placeholder="Buscar tipos de cita..." />}
    >
      <AppointmentTypeList />
    </PageBase>
  )
}
