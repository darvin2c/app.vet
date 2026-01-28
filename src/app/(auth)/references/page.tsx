import type { Metadata } from 'next'
import PageBase from '@/components/page-base'
import { ReferenceList } from '@/components/references/reference-list'
import CanAccess from '@/components/ui/can-access'

export default function ReferencesPage() {
  return (
    <CanAccess resource="references" action="read">
      <PageBase breadcrumbs={[{ label: 'Referencias del Sistema' }]}>
        <ReferenceList />
      </PageBase>
    </CanAccess>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Referencias del Sistema',
    description:
      'Administra referencias del sistema: catálogos y configuraciones base para la clínica veterinaria.',
  }
}
