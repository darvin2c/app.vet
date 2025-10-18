import { ArrowLeft, Edit, Heart, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { Tables } from '@/types/supabase.types'
import { PetStatusBadge } from './pet-status-badge'
import { calculateAge, formatSex, getSexIcon, getSexColor, formatDate, formatWeight } from '@/lib/pet-utils'

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
}

export function PetProfileHeader({ pet }: PetProfileHeaderProps) {
  const router = useRouter()





  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </div>

        <div className="flex items-start gap-6">
          <Avatar className="h-24 w-24">
            <AvatarFallback className="text-2xl">
              {pet.name?.charAt(0)?.toUpperCase() || 'M'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{pet.name}</h1>
                <span className={`text-2xl ${getSexColor(pet.sex)}`}>
                  {getSexIcon(pet.sex)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>
                  {pet.breeds?.name ||
                    pet.species?.name ||
                    'Raza no especificada'}
                </span>
                {pet.breeds?.name && pet.species?.name && (
                  <>
                    <span>•</span>
                    <span>{pet.species.name}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{calculateAge(pet.birth_date)}</span>
              </div>
              {pet.birth_date && (
                <div className="text-muted-foreground">
                  Nacido el {formatDate(pet.birth_date)}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <PetStatusBadge status="active" />
              {pet.microchip && (
                <Badge variant="outline">Microchip: {pet.microchip}</Badge>
              )}
              {pet.weight && <Badge variant="outline">{formatWeight(pet.weight)}</Badge>}
            </div>

            {pet.notes && (
              <p className="text-sm text-muted-foreground max-w-2xl">
                {pet.notes}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
