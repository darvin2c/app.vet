import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tables } from '@/types/supabase.types'
import { PetInfoField } from './pet-info-field'
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

interface PetGeneralInfoProps {
  pet: PetDetail
}

export function PetGeneralInfo({ pet }: PetGeneralInfoProps) {
  const getSexText = (sex: string | null) => {
    switch (sex?.toLowerCase()) {
      case 'male':
      case 'macho':
        return 'Macho'
      case 'female':
      case 'hembra':
        return 'Hembra'
      default:
        return 'No especificado'
    }
  }

  return (
    <div className="space-y-6">
      {/* Información Básica */}
      <Card>
        <CardHeader>
          <CardTitle>Información Básica</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PetInfoField
              label="Nombre"
              value={pet.name}
            />
            
            <PetInfoField
              label="Estado"
            >
              <PetStatusBadge status="active" />
            </PetInfoField>
            
            <PetInfoField
              label="Especie"
              value={pet.species?.name}
            />
            
            <PetInfoField
              label="Raza"
              value={pet.breeds?.name}
            />
            
            <PetInfoField
              label="Sexo"
              value={getSexText(pet.sex)}
            />
            
            <PetInfoField
              label="Color"
              value={pet.color}
            />
            
            <PetInfoField
              label="Peso"
              value={pet.weight ? `${pet.weight} kg` : undefined}
            />
            
            <PetInfoField
              label="Fecha de nacimiento"
              value={pet.birth_date ? format(new Date(pet.birth_date), 'dd/MM/yyyy', { locale: es }) : undefined}
            />
          </dl>
        </CardContent>
      </Card>

      {/* Identificación */}
      <Card>
        <CardHeader>
          <CardTitle>Identificación</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PetInfoField
              label="Microchip"
              value={pet.microchip}
            />
            
            <PetInfoField
              label="Número de registro"
              value={pet.id}
            />
          </dl>
        </CardContent>
      </Card>

      {/* Información Adicional */}
      <Card>
        <CardHeader>
          <CardTitle>Información Adicional</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            {pet.notes && (
              <PetInfoField
                label="Notas"
                value={pet.notes}
              />
            )}
          </dl>
        </CardContent>
      </Card>

      {/* Fechas de Registro */}
      <Card>
        <CardHeader>
          <CardTitle>Fechas de Registro</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PetInfoField
              label="Fecha de registro"
              value={pet.created_at ? format(new Date(pet.created_at), 'dd/MM/yyyy HH:mm', { locale: es }) : undefined}
            />
            
            <PetInfoField
              label="Última actualización"
              value={pet.updated_at ? format(new Date(pet.updated_at), 'dd/MM/yyyy HH:mm', { locale: es }) : undefined}
            />
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}