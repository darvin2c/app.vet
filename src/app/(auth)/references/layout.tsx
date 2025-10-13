'use client'

import { Settings } from 'lucide-react'
import { ReferenceSidebar } from '@/components/references/reference-sidebar'
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'

export default function ReferencesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider className="items-start relative">
      <ReferenceSidebar />
      <SidebarInset>
        {/* Header móvil */}
        <div className="lg:hidden border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                <h1 className="font-semibold">Referencias</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <main className="h-full">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
