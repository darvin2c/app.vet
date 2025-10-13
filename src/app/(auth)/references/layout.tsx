'use client'

import { ReferenceSidebar } from '@/components/references/reference-sidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'

export default function ReferencesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider className="items-start relative">
      <ReferenceSidebar />
      <SidebarInset>
        {/* Contenido principal */}
        <main className="h-full">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
