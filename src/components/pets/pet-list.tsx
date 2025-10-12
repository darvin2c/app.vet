'use client'

import { useState } from 'react'
import { usePets } from '@/hooks/pets/use-pet-list'
import { PetFilters } from '@/schemas/pets.schema'
import { Tables } from '@/types/supabase.types'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import { Empty } from '@/components/ui/empty'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PetActions } from './pet-actions'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

type Pet = Tables<'pets'> & {
  clients: Tables<'clients'> | null
  breeds: Tables<'breeds'> | null
}

interface PetListProps {
  filters?: PetFilters
}

export function PetList({ filters }: PetListProps) {
  const { data: pets, isLoading } = usePets(filters)

  if (isLoading) {
    return <TableSkeleton />
  }

  if (!pets || pets.length === 0) {
    return (
      <Empty
        title="No hay mascotas"
        description="No se encontraron mascotas con los filtros aplicados."
      />
    )
  }

  return (
    <div className="grid gap-4">
      {pets.map((pet) => (
        <Card key={pet.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-lg">{pet.name}</CardTitle>

              </div>
              <PetActions pet={pet} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Cliente:</span>
                <p className="mt-1">{pet.clients?.name || 'Sin cliente'}</p>
              </div>
              
              <div>
                <span className="font-medium text-muted-foreground">Especie:</span>
                <p className="mt-1 capitalize">{pet.species}</p>
              </div>
              
              {pet.sex && (
                <div>
                  <span className="font-medium text-muted-foreground">Género:</span>
                  <p className="mt-1 capitalize">
                    {pet.sex === 'M' ? 'Macho' : 
                     pet.sex === 'F' ? 'Hembra' : 'Desconocido'}
                  </p>
                </div>
              )}
              
              {pet.birth_date && (
                <div>
                  <span className="font-medium text-muted-foreground">Fecha de Nacimiento:</span>
                  <p className="mt-1">
                    {format(new Date(pet.birth_date), 'dd/MM/yyyy', { locale: es })}
                  </p>
                </div>
              )}
              
              {pet.weight && (
                <div>
                  <span className="font-medium text-muted-foreground">Peso:</span>
                  <p className="mt-1">{pet.weight} kg</p>
                </div>
              )}
              
              {pet.color && (
                <div>
                  <span className="font-medium text-muted-foreground">Color:</span>
                  <p className="mt-1">{pet.color}</p>
                </div>
              )}
              
              {pet.microchip && (
                <div>
                  <span className="font-medium text-muted-foreground">Microchip:</span>
                  <p className="mt-1">{pet.microchip}</p>
                </div>
              )}
              
              {pet.breeds && (
                <div>
                  <span className="font-medium text-muted-foreground">Raza:</span>
                  <p className="mt-1">{pet.breeds.name}</p>
                </div>
              )}
              
              <div>
                <span className="font-medium text-muted-foreground">Registrado:</span>
                <p className="mt-1">
                  {format(new Date(pet.created_at), 'dd/MM/yyyy', { locale: es })}
                </p>
              </div>
            </div>
            
            {pet.notes && (
              <div className="mt-4 pt-4 border-t">
                <div>
                  <span className="font-medium text-muted-foreground">Notas:</span>
                  <p className="mt-1 text-sm">{pet.notes}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}