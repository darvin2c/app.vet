'use client'

import { ReferenceSidebar } from '@/components/references/reference-sidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar-left'

export default function ReferencesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ReferenceSidebar>{children}</ReferenceSidebar>
}
