'use client'

import {
  User,
  FileText,
  Calendar,
  ShoppingBag
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarRail,
  SidebarSeparator
} from '@/components/ui/multi-sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'
import { usePetDetail } from '@/hooks/pets/use-pet-detail'
import { calculateAge, formatSex } from '@/lib/pet-utils'
import { IsActiveDisplay } from '@/components/ui/is-active-field'
import { PetActions } from './pet-actions'

interface PetProfileSidebarProps {
  petId: string
  activeTab: string
  onTabChange: (tab: string) => void
}

export function PetProfileSidebar({
  petId,
  activeTab,
  onTabChange,
}: PetProfileSidebarProps) {
  const router = useRouter()
  const { data: pet, isLoading } = usePetDetail(petId)

  if (isLoading) {
    return (
       <Sidebar side="left" collapsible="offcanvas" className="border-r">
          <SidebarHeader className="h-14 border-b flex flex-row items-center px-4">
             <Skeleton className="h-8 w-8 rounded-full" />
             <Skeleton className="h-4 w-20 ml-2" />
          </SidebarHeader>
          <SidebarContent className="p-4 space-y-6">
             <div className="flex flex-col items-center space-y-3">
               <Skeleton className="h-24 w-24 rounded-full" />
               <Skeleton className="h-6 w-32" />
               <Skeleton className="h-4 w-24" />
             </div>
             <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
             </div>
          </SidebarContent>
       </Sidebar>
    )
  }

  if (!pet) return null

  const menuItems = [
    {
      id: "general",
      label: "Información General",
      icon: User,
    },
    {
      id: "clinical-records",
      label: "Historial Médico",
      icon: FileText,
    },
    {
      id: "appointments",
      label: "Citas",
      icon: Calendar,
    },
    {
      id: "orders",
      label: "Ordenes",
      icon: ShoppingBag,
    },
  ]

  return (
    <Sidebar side="right" collapsible="icon" className="absolute top-0 left-0  bg-sidebar h-full">
  

      <SidebarContent className="pt-6">
        <div className="flex flex-col items-center px-6 text-center mb-6">
            <Avatar className="h-28 w-28 mb-4 border-4 border-sidebar-accent shadow-sm">
               <AvatarFallback className="text-3xl bg-sidebar-accent text-sidebar-accent-foreground">
                 {pet.name?.charAt(0)?.toUpperCase()}
               </AvatarFallback>
            </Avatar>
            
            <div className="space-y-1 mb-3">
                <h2 className="text-xl font-bold tracking-tight">{pet.name}</h2>
                <p className="text-sm text-sidebar-foreground/60 font-medium">
                {pet.breeds?.name || pet.species?.name}
                </p>
            </div>

             <div className="flex flex-wrap justify-center gap-2 mb-4">
                <Badge variant="secondary" className="px-2 py-0.5 font-normal">
                  {formatSex(pet.sex)}
                </Badge>
                 <Badge variant="outline" className="px-2 py-0.5 font-normal border-sidebar-border">
                   {calculateAge(pet.birth_date)}
                 </Badge>
             </div>

             <div className="w-full flex justify-center">
                 <PetActions pet={pet} />
             </div>
        </div>

        <div className="px-3">
             <SidebarSeparator className="mb-4" />
        </div>

        <SidebarMenu className="px-3">
           {menuItems.map((item) => (
             <SidebarMenuItem key={item.id}>
               <SidebarMenuButton
                 isActive={activeTab === item.id}
                 onClick={() => onTabChange(item.id)}
                 tooltip={item.label}
                 size="default"
                 className="font-medium"
               >
                 <item.icon className="h-4 w-4 opacity-70" />
                 <span>{item.label}</span>
               </SidebarMenuButton>
             </SidebarMenuItem>
           ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
         <div className="flex items-center justify-between px-2">
            <span className="text-xs text-sidebar-foreground/50 font-medium uppercase tracking-wider">Estado</span>
            <IsActiveDisplay value={pet.is_active ?? true} />
         </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
