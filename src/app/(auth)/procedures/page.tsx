import PageBase from '@/components/page-base'
import { ProcedureList } from '@/components/procedures/procedure-list'
import { ProcedureCreateButton } from '@/components/procedures/procedure-create-button'
import { SearchInput } from '@/components/ui/search-input'
import { Activity } from 'lucide-react'

export default function ProceduresPage() {
  return (
    <PageBase
      title={
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6" />
          Procedimientos
        </div>
      }
      subtitle="Administrar procedimientos médicos y sus configuraciones"
      actions={<ProcedureCreateButton />}
      search={<SearchInput placeholder="Buscar procedimientos..." />}
    >
      <ProcedureList />
    </PageBase>
  )
}
