import { ArrowLeft, Calendar, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { Tables } from '@/types/supabase.types'
import { PetStatusBadge } from './pet-status-badge'
import { PetActions } from './pet-actions'
import {
  calculateAge,
  getSexIcon,
  getSexColor,
  formatDate,
  formatWeight,
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
    <Card className="mb-4 md:mb-6">
      <CardContent className="p-4 md:p-6">
        {/* Mobile Header Actions */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="p-2 md:px-3"
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

        {/* Pet Information */}
        <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
          {/* Avatar */}
          <div className="flex justify-center md:justify-start">
            <Avatar className="h-20 w-20 md:h-24 md:w-24">
              <AvatarFallback className="text-xl md:text-2xl">
                {pet.name?.charAt(0)?.toUpperCase() || 'M'}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Pet Details */}
          <div className="flex-1 space-y-3 text-center md:text-left">
            {/* Name and Sex */}
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 md:gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold">{pet.name}</h1>
                <span className={`text-xl md:text-2xl ${getSexColor(pet.sex)}`}>
                  {getSexIcon(pet.sex)}
                </span>
              </div>

              {/* Breed and Species */}
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 text-sm md:text-base text-muted-foreground">
                <span>
                  {pet.breeds?.name ||
                    pet.species?.name ||
                    'Raza no especificada'}
                </span>
                {pet.breeds?.name && pet.species?.name && (
                  <>
                    <span className="hidden md:inline">•</span>
                    <span>{pet.species.name}</span>
                  </>
                )}
              </div>
            </div>

            {/* Age and Birth Date */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm">
              <div className="flex items-center justify-center md:justify-start gap-1">
                <Calendar className="h-4 w-4" />
                <span>{calculateAge(pet.birth_date)}</span>
              </div>
              {pet.birth_date && (
                <div className="text-muted-foreground text-xs md:text-sm">
                  Nacido el {formatDate(pet.birth_date)}
                </div>
              )}
            </div>

            {/* Status and Additional Info */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3">
              <PetStatusBadge status="active" />
              {pet.microchip && (
                <Badge variant="outline" className="text-xs">
                  Microchip: {pet.microchip}
                </Badge>
              )}
              {pet.weight && (
                <Badge variant="outline" className="text-xs">
                  {formatWeight(pet.weight)}
                </Badge>
              )}
            </div>

            {/* Notes */}
            {pet.notes && (
              <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                {pet.notes}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
