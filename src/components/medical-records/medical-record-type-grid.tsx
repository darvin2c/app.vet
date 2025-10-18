'use client'

import { cn } from '@/lib/utils'
import {
  Item,
  ItemGroup,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from '@/components/ui/item'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible'
import { ChevronDown } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { useState } from 'react'
import useRecordType from '@/hooks/medical-records/use-record-type'
import { Enums } from '@/types/supabase.types'

interface MedicalRecordTypeGridProps {
  value?: Enums<'record_type'>
  onValueChange?: (value: string) => void
  disabled?: boolean
  className?: string
}

export function MedicalRecordTypeGrid({
  value,
  onValueChange,
  className,
}: MedicalRecordTypeGridProps) {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(true)
  const { recordTypes, getRecordType } = useRecordType()
  // Encontrar el tipo seleccionado
  const selectedType = getRecordType(value)

  const handleSelection = (selectedValue: string) => {
    onValueChange?.(selectedValue)
    setIsOpen(false) // Colapsar automáticamente después de seleccionar
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className={className}>
      {/* Trigger que muestra la selección cuando está colapsado */}
      {!isOpen && selectedType && (
        <CollapsibleTrigger asChild>
          <Item
            variant="outline"
            className="cursor-pointer transition-all duration-200 hover:shadow-md border-2 border-primary bg-primary/5 shadow-md mb-3"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex gap-4 items-center">
                <ItemMedia
                  variant="icon"
                  className="bg-primary text-primary-foreground border-primary"
                >
                  {selectedType.icon}
                </ItemMedia>
                <div>
                  <ItemTitle className="text-primary">
                    {selectedType.label}
                  </ItemTitle>
                  {!isMobile && (
                    <ItemDescription className="text-sm text-muted-foreground">
                      {selectedType.description}
                    </ItemDescription>
                  )}
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-primary" />
            </div>
          </Item>
        </CollapsibleTrigger>
      )}

      {/* Contenido colapsable con el grid */}
      <CollapsibleContent>
        <ItemGroup
          className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3')}
        >
          {recordTypes.map((type) => {
            const Icon = type.icon
            const isSelected = value === type.value

            return (
              <Item
                key={type.value}
                variant={isSelected ? 'outline' : 'muted'}
                className={cn(
                  'cursor-pointer transition-all duration-200 hover:shadow-md flex-col text-center',
                  'border-2 hover:border-primary/50',
                  isSelected && 'border-primary bg-primary/5 shadow-md'
                )}
                onClick={() => handleSelection(type.value)}
              >
                <div className="flex gap-4 w-full">
                  <ItemMedia
                    variant="icon"
                    className={cn(
                      'transition-colors',
                      isSelected
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {Icon}
                  </ItemMedia>
                  <ItemTitle
                    className={cn(
                      'justify-center',
                      isSelected && 'text-primary'
                    )}
                  >
                    {type.label}
                  </ItemTitle>
                </div>
                {!isMobile && (
                  <ItemContent className="text-center">
                    <ItemDescription className="text-center">
                      {type.description}
                    </ItemDescription>
                  </ItemContent>
                )}
              </Item>
            )
          })}
        </ItemGroup>
      </CollapsibleContent>
    </Collapsible>
  )
}
