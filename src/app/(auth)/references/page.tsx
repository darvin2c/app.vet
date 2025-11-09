import type { Metadata } from 'next'
import PageBase from '@/components/page-base'
import { ReferenceList } from '@/components/references/reference-list'
import CanAccess from '@/components/ui/can-access'

export default function ReferencesPage() {
  return (
    <CanAccess resource="references" action="read">
      <PageBase
        title="Referencias del Sistema"
        subtitle="Gestiona las referencias y configuraciones básicas del sistema"
      >
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
