import { ReferencePageLayout } from '@/components/references/reference-page-layout'
import { AppointmentTypeList } from '@/components/appointment-types/appointment-type-list'
import { SearchInput } from '@/components/ui/search-input'
import { Calendar } from 'lucide-react'

export default function AppointmentTypesPage() {
  return (
    <ReferencePageLayout
      title="Tipos de Cita"
      subtitle="Configurar tipos de citas disponibles en el sistema"
      icon={Calendar}
      search={<SearchInput placeholder="Buscar tipos de cita..." />}
    >
      <AppointmentTypeList />
    </ReferencePageLayout>
  )
}
