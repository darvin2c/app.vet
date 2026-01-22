'use client'

import { ArrowLeft, Calendar, Menu, User, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { Tables } from '@/types/supabase.types'
import { IsActiveDisplay } from '@/components/ui/is-active-field'
import { PetActions } from './pet-actions'
import { DateDisplay } from '@/components/ui/date-picker'
import {
  calculateAge,
  formatSex,
  formatDate,
  formatWeight,
  getCustomerFullName,
} from '@/lib/pet-utils'

type PetDetail = Tables<'pets'> & {
  customers: Tables<'customers'> | null
  breeds:
    | (Tables<'breeds'> & {
        species: Tables<'species'> | null
      })
    | null
  species: Tables<'species'> | null
}

interface PetProfileHeaderProps {
  pet: PetDetail
  onMenuClick?: () => void
  onEdit?: () => void
  onScheduleAppointment?: () => void
  onDelete?: () => void
}

export function PetProfileHeader({
  pet,
  onMenuClick,
  onEdit,
  onScheduleAppointment,
  onDelete,
}: PetProfileHeaderProps) {
  const router = useRouter()

  return (
    <div className="pb-4 md:pb-6 border-b mb-4 md:mb-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="p-2 md:px-3 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Volver</span>
        </Button>

        <div className="flex items-center gap-2">
          <PetActions pet={pet} size="sm" />
          {onMenuClick && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="p-2 md:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="block md:hidden">
        <div className="flex items-center space-x-3">
          <Avatar className="h-14 w-14 flex-shrink-0">
            <AvatarFallback className="text-lg">
              {pet.name?.charAt(0)?.toUpperCase() || 'M'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-lg font-bold truncate">{pet.name}</h1>
              <Badge
                variant="outline"
                className="text-xs flex-shrink-0 font-normal"
              >
                {formatSex(pet.sex)}
              </Badge>
            </div>

            <div className="text-sm text-muted-foreground mb-2 truncate">
              {pet.breeds?.name || pet.species?.name || 'Raza no especificada'}
            </div>

            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                <Calendar className="h-3 w-3 mr-1" />
                {calculateAge(pet.birth_date)}
              </Badge>
              {pet.weight && (
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  {formatWeight(pet.weight)}
                </Badge>
              )}
              <IsActiveDisplay
                value={pet.is_active ?? true}
                className="scale-90 origin-left"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 flex-shrink-0">
            <AvatarFallback className="text-xl">
              {pet.name?.charAt(0)?.toUpperCase() || 'M'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{pet.name}</h1>
              <Badge
                variant="outline"
                className="text-sm px-2 py-1 font-normal"
              >
                {formatSex(pet.sex)}
              </Badge>
              <IsActiveDisplay value={pet.is_active ?? true} />
              <span className="text-muted-foreground">
                {pet.breeds?.name ||
                  pet.species?.name ||
                  'Raza no especificada'}
              </span>
              {pet.breeds?.name && pet.species?.name && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">
                    {pet.species.name}
                  </span>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="text-sm px-3 py-1 font-normal"
              >
                <Calendar className="h-3 w-3 mr-1" />
                {calculateAge(pet.birth_date)}
                {pet.birth_date && (
                  <span className="ml-1 text-xs opacity-70 flex items-center gap-1">
                    (<DateDisplay value={pet.birth_date} />)
                  </span>
                )}
              </Badge>

              {pet.weight && (
                <Badge
                  variant="outline"
                  className="text-sm px-3 py-1 font-normal"
                >
                  {formatWeight(pet.weight)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
