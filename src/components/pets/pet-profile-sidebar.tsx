'use client'

import { User, FileText, Calendar, ShoppingBag } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/multi-sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { usePetDetail } from '@/hooks/pets/use-pet-detail'
import { calculateAge, formatSex } from '@/lib/pet-utils'
import { IsActiveDisplay } from '@/components/ui/is-active-field'
import { PetActions } from './pet-actions'

interface PetProfileSidebarProps {
  petId: string
}

export function PetProfileSidebar({ petId }: PetProfileSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
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
      id: 'general',
      label: 'Información General',
      href: `/pets/${petId}`,
      icon: User,
      exact: true,
    },
    {
      id: 'clinical-records',
      label: 'Historial Médico',
      href: `/pets/${petId}/medical-history`,
      icon: FileText,
    },
    {
      id: 'appointments',
      label: 'Citas',
      href: `/pets/${petId}/appointments`,
      icon: Calendar,
    },
    {
      id: 'orders',
      label: 'Ordenes',
      href: `/pets/${petId}/orders`,
      icon: ShoppingBag,
    },
  ]

  return (
    <Sidebar
      side="right"
      collapsible="icon"
      className="bg-sidebar h-full border-l"
    >
      <SidebarContent className="pt-6">
        <div className="flex flex-col items-center px-6 group-data-[collapsible=icon]:px-0 text-center mb-6">
          <Avatar className="h-28 w-28 mb-4 border-4 border-sidebar-accent shadow-sm transition-[width,height,margin] group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:mb-0 group-data-[collapsible=icon]:border-2">
            <AvatarFallback className="text-3xl group-data-[collapsible=icon]:text-lg bg-sidebar-accent text-sidebar-accent-foreground">
              {pet.name?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1 mb-3 group-data-[collapsible=icon]:hidden">
            <h2 className="text-xl font-bold tracking-tight">{pet.name}</h2>
            <p className="text-sm text-sidebar-foreground/60 font-medium">
              {pet.breeds?.name || pet.species?.name}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-4 group-data-[collapsible=icon]:hidden">
            <Badge variant="secondary" className="px-2 py-0.5 font-normal">
              {formatSex(pet.sex)}
            </Badge>
            <Badge
              variant="outline"
              className="px-2 py-0.5 font-normal border-sidebar-border"
            >
              {calculateAge(pet.birth_date)}
            </Badge>
          </div>

          <div className="w-full flex justify-center group-data-[collapsible=icon]:hidden">
            <PetActions pet={pet} />
          </div>
        </div>

        <div className="px-3 group-data-[collapsible=icon]:hidden">
          <SidebarSeparator className="mb-4" />
        </div>

        <SidebarMenu className="px-3">
          {menuItems.map((item) => {
            // Simple active check logic
            // For general (root), exact match usually wanted, but simplified here:
            // If item.exact is true, strict match.
            // Else startswith
            const isActive = item.exact
              ? pathname === item.href
              : pathname?.startsWith(item.href)

            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  isActive={isActive}
                  asChild
                  tooltip={item.label}
                  size="default"
                  className="font-medium"
                >
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4 opacity-70" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs text-sidebar-foreground/50 font-medium uppercase tracking-wider">
            Estado
          </span>
          <IsActiveDisplay value={pet.is_active ?? true} />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
