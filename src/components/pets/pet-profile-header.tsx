import { ArrowLeft, Edit, Heart, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { Tables } from '@/types/supabase.types'
import { PetStatusBadge } from './pet-status-badge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

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

  const getAgeText = (birthDate: string | null) => {
    if (!birthDate) return 'Edad desconocida'
    
    const birth = new Date(birthDate)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - birth.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 30) {
      return `${diffDays} días`
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30)
      return `${months} ${months === 1 ? 'mes' : 'meses'}`
    } else {
      const years = Math.floor(diffDays / 365)
      const remainingMonths = Math.floor((diffDays % 365) / 30)
      if (remainingMonths === 0) {
        return `${years} ${years === 1 ? 'año' : 'años'}`
      }
      return `${years} ${years === 1 ? 'año' : 'años'} y ${remainingMonths} ${remainingMonths === 1 ? 'mes' : 'meses'}`
    }
  }

  const getSexIcon = (sex: string | null) => {
    if (sex === 'male' || sex === 'macho') return '♂'
    if (sex === 'female' || sex === 'hembra') return '♀'
    return '?'
  }

  const getSexColor = (sex: string | null) => {
    if (sex === 'male' || sex === 'macho') return 'text-blue-600'
    if (sex === 'female' || sex === 'hembra') return 'text-pink-600'
    return 'text-muted-foreground'
  }

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
                <span>{pet.breeds?.name || pet.species?.name || 'Raza no especificada'}</span>
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
                <span>{getAgeText(pet.birth_date)}</span>
              </div>
              {pet.birth_date && (
                <div className="text-muted-foreground">
                  Nacido el {format(new Date(pet.birth_date), 'dd/MM/yyyy', { locale: es })}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <PetStatusBadge status="active" />
              {pet.microchip && (
                <Badge variant="outline">
                  Microchip: {pet.microchip}
                </Badge>
              )}
              {pet.weight && (
                <Badge variant="outline">
                  {pet.weight} kg
                </Badge>
              )}
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