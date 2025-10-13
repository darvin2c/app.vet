'use client'

import { BreedList } from './breed-list'
import { BreedCreateButton } from './breed-create-button'
import { FilterConfig } from '@/types/filters.types'
import { OrderByConfig } from '@/types/order-by.types'

interface BreedsListProps {
  speciesId?: string
  filterConfig?: FilterConfig[]
  orderByConfig?: OrderByConfig
  showCreateButton?: boolean
}

export function BreedsList({
  speciesId,
  filterConfig,
  orderByConfig,
  showCreateButton = true,
}: BreedsListProps) {
  return (
    <div className="space-y-4">
      {showCreateButton && (
        <div className="flex justify-end">
          <BreedCreateButton selectedSpeciesId={speciesId} />
        </div>
      )}

      <BreedList
        speciesId={speciesId}
        filterConfig={filterConfig}
        orderByConfig={orderByConfig}
      />
    </div>
  )
}
