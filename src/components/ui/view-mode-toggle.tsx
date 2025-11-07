'use client'

import * as React from 'react'
import { Table2, Grid3X3, List } from 'lucide-react'
import { ButtonGroup } from '@/components/ui/button-group'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export type ViewMode = 'table' | 'cards' | 'list'

const viewModeConfig = [
  {
    value: 'table' as const,
    icon: Table2,
    tooltip: 'Vista de tabla',
  },
  {
    value: 'cards' as const,
    icon: Grid3X3,
    tooltip: 'Vista de tarjetas',
  },
  {
    value: 'list' as const,
    icon: List,
    tooltip: 'Vista de lista',
  },
]

// Función para obtener el valor desde localStorage
function getStoredViewMode(resource: string): ViewMode {
  if (typeof window === 'undefined') return 'table'

  try {
    const storageKey = `${resource}-view-mode`
    const stored = localStorage.getItem(storageKey)
    if (stored && ['table', 'cards', 'list'].includes(stored)) {
      return stored as ViewMode
    }
  } catch (error) {
    console.warn('Error reading from localStorage:', error)
  }

  return 'table'
}

// Función para guardar el valor en localStorage
function setStoredViewMode(resource: string, value: ViewMode) {
  if (typeof window === 'undefined') return

  try {
    const storageKey = `${resource}-view-mode`
    localStorage.setItem(storageKey, value)
  } catch (error) {
    console.warn('Error writing to localStorage:', error)
  }
}

export interface ViewModeToggleProps {
  onValueChange?: (value: ViewMode) => void
  onChange?: (value: ViewMode) => void // Compatibilidad con uso previo
  value?: ViewMode // Compatibilidad con uso previo
  className?: string
  resource?: string
}

export function ViewModeToggle({
  onValueChange,
  onChange,
  value,
  className,
  resource = 'products',
}: ViewModeToggleProps) {
  // Estado interno que maneja completamente el valor con localStorage
  const [currentValue, setCurrentValue] = React.useState<ViewMode>(() =>
    value ?? getStoredViewMode(resource)
  )

  const handleValueChange = (newValue: ViewMode) => {
    // Actualizar estado interno
    setCurrentValue(newValue)

    // Guardar en localStorage
    setStoredViewMode(resource, newValue)

    // Llamar callback si existe
    onValueChange?.(newValue)
    onChange?.(newValue)
  }

  // No necesitamos useEffect para notificar el valor inicial
  // El componente padre debe manejar su propio estado inicial

  return (
    <TooltipProvider>
      <ButtonGroup className={cn('border rounded-md', className)}>
        {viewModeConfig.map(({ value: mode, icon: Icon, tooltip }) => (
          <Tooltip key={mode}>
            <TooltipTrigger asChild>
              <Button
                variant={currentValue === mode ? 'default' : 'outline'}
                size="sm"
                className="h-8 w-8 p-0 border-0"
                onClick={() => handleValueChange(mode)}
                aria-label={tooltip}
              >
                <Icon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </ButtonGroup>
    </TooltipProvider>
  )
}
