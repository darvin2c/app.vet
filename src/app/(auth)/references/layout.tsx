import type { Metadata } from 'next'
import { ReferenceSidebar } from '@/components/references/reference-sidebar'

export const metadata: Metadata = {
  title: {
    template: '%s | App Vet',
    default: 'Referencias',
  },
  description:
    'Gestión de referencias y configuraciones básicas del sistema veterinario',
}

export default function ReferencesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ReferenceSidebar>{children}</ReferenceSidebar>
}
