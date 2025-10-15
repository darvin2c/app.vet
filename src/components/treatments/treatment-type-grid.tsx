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
  Stethoscope,
  Syringe,
  Scissors,
  Bath,
  Building2,
  Bug,
  Home,
  GraduationCap,
} from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'

interface TreatmentTypeGridProps {
  value?: string
  onValueChange?: (value: string) => void
  className?: string
}

const treatmentTypes = [
  {
    value: 'consultation',
    label: 'Consulta',
    icon: Stethoscope,
    description: 'Consulta médica general',
  },
  {
    value: 'vaccination',
    label: 'Vacunación',
    icon: Syringe,
    description: 'Aplicación de vacunas',
  },
  {
    value: 'surgery',
    label: 'Cirugía',
    icon: Scissors,
    description: 'Procedimientos quirúrgicos',
  },
  {
    value: 'grooming',
    label: 'Peluquería',
    icon: Bath,
    description: 'Servicios de estética',
  },
  {
    value: 'hospitalization',
    label: 'Hospitalización',
    icon: Building2,
    description: 'Internación y cuidados',
  },
  {
    value: 'deworming',
    label: 'Desparasitación',
    icon: Bug,
    description: 'Tratamiento antiparasitario',
  },
  {
    value: 'boarding',
    label: 'Hospedaje',
    icon: Home,
    description: 'Alojamiento temporal',
  },
  {
    value: 'training',
    label: 'Entrenamiento',
    icon: GraduationCap,
    description: 'Adiestramiento y educación',
  },
]

export function TreatmentTypeGrid({
  value,
  onValueChange,
  className,
}: TreatmentTypeGridProps) {
  const isMobile = useIsMobile()
  return (
    <ItemGroup
      className={cn(
        'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3',
        className
      )}
    >
      {treatmentTypes.map((type) => {
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
            onClick={() => onValueChange?.(type.value)}
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
                <Icon className="h-5 w-5" />
              </ItemMedia>
              <ItemTitle
                className={cn('justify-center', isSelected && 'text-primary')}
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
  )
}
