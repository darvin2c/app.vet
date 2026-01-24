'use client'

import { useParams } from 'next/navigation'
import { SidebarProvider, SidebarInset } from '@/components/ui/multi-sidebar'
import { PetProfileSidebar } from '@/components/pets/pet-profile-sidebar'

export default function PetProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const petId = params.id as string

  return (
    <SidebarProvider id="pet-profile" className="relative h-[calc(100vh-4rem)]">
      <SidebarInset className="overflow-hidden">
        {children}
      </SidebarInset>
      <PetProfileSidebar petId={petId} />
    </SidebarProvider>
  )
}
