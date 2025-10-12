'use client'

import { ColumnDef, Row } from '@tanstack/react-table'
import { Tables } from '@/types/supabase.types'
import { OrderByTableHeader } from '@/components/ui/order-by'
import { IsActiveDisplay } from '@/components/ui/is-active-field'
import { PetActions } from './pet-actions'

// Tipo inferido del hook useOrderBy
type UseOrderByReturn = ReturnType<
  typeof import('@/hooks/use-order-by').useOrderBy
>

// Tipo para mascota con relaciones
type Pet = Tables<'pets'> & {
  clients: Tables<'clients'> | null
  breeds: Tables<'breeds'> | null
  species: Tables<'species'> | null
}

export function getPetTableColumns(
  orderByHook: UseOrderByReturn
): ColumnDef<Pet>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ header }) => (
        <OrderByTableHeader field="name" orderByHook={orderByHook}>
          Nombre
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Pet> }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'clients.name',
      header: ({ header }) => (
        <OrderByTableHeader field="client_id" orderByHook={orderByHook}>
          Cliente
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Pet> }) => (
        <div className="text-sm">
          {row.original.clients?.full_name || 'Sin cliente'}
        </div>
      ),
    },
    {
      accessorKey: 'species.name',
      header: ({ header }) => (
        <OrderByTableHeader field="species_id" orderByHook={orderByHook}>
          Especie
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Pet> }) => (
        <div className="text-sm text-muted-foreground">
          {row.original.species?.name || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'breeds.name',
      header: ({ header }) => (
        <OrderByTableHeader field="breed_id" orderByHook={orderByHook}>
          Raza
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Pet> }) => (
        <div className="text-sm text-muted-foreground">
          {row.original.breeds?.name || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'sex',
      header: ({ header }) => (
        <OrderByTableHeader field="sex" orderByHook={orderByHook}>
          Sexo
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Pet> }) => (
        <div className="text-sm text-muted-foreground">
          {row.getValue('sex') === 'M' ? 'Macho' : 'Hembra'}
        </div>
      ),
    },
    {
      accessorKey: 'birth_date',
      header: ({ header }) => (
        <OrderByTableHeader field="birth_date" orderByHook={orderByHook}>
          Fecha Nacimiento
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Pet> }) => {
        const birthDate = row.getValue('birth_date') as string
        return (
          <div className="text-sm text-muted-foreground">
            {birthDate ? new Date(birthDate).toLocaleDateString() : '-'}
          </div>
        )
      },
    },
    {
      accessorKey: 'weight',
      header: ({ header }) => (
        <OrderByTableHeader field="weight" orderByHook={orderByHook}>
          Peso
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Pet> }) => {
        const weight = row.getValue('weight') as number
        return (
          <div className="text-sm text-muted-foreground">
            {weight ? `${weight} kg` : '-'}
          </div>
        )
      },
    },
    {
      accessorKey: 'microchip',
      header: ({ header }) => (
        <OrderByTableHeader field="microchip" orderByHook={orderByHook}>
          Microchip
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Pet> }) => (
        <div className="text-sm text-muted-foreground font-mono">
          {row.getValue('microchip') || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'is_active',
      header: ({ header }) => (
        <OrderByTableHeader field="is_active" orderByHook={orderByHook}>
          Estado
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Pet> }) => (
        <IsActiveDisplay value={row.getValue('is_active')} />
      ),
    },
    {
      id: 'actions',
      cell: ({ row }: { row: Row<Pet> }) => <PetActions pet={row.original} />,
    },
  ]
}
