import PageBase from '@/components/page-base'
import { ReferenceList } from '@/components/references/reference-list'

export default function ReferencesPage() {
  return (
    <PageBase
      title="Referencias del Sistema"
      subtitle="Gestiona las referencias y configuraciones básicas del sistema"
    >
      <ReferenceList />
    </PageBase>
  )
}
