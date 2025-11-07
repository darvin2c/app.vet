import type { Metadata } from 'next'
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

export function generateMetadata(): Metadata {
  return {
    title: 'Referencias del Sistema',
    description:
      'Administra referencias del sistema: catálogos y configuraciones base para la clínica veterinaria.',
  }
}
