'use client'

import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ButtonGroup } from '@/components/ui/button-group'
import { cn } from '@/lib/utils'

import type { BooleanFilterConfig } from './types'

interface BooleanFilterProps {
  config: any // Temporal para evitar errores de tipado
  value: string
  onChange: (value: string) => void
}

export default function BooleanFilter({ config, value, onChange }: BooleanFilterProps) {
  const handleValueChange = (newValue: string) => {
    if (value === newValue) {
      onChange('')
    } else {
      onChange(newValue)
    }
  }

  const handleClear = () => {
    onChange('')
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{config.label}</Label>
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      <ButtonGroup>
        <Button
          type="button"
          variant={value === 'true' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleValueChange('true')}
          className={cn(
            'px-3 py-2 text-sm font-medium',
            value === 'true'
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-background text-foreground hover:bg-green-50 hover:text-green-700'
          )}
        >
          Sí
        </Button>
        <Button
          type="button"
          variant={value === 'false' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleValueChange('false')}
          className={cn(
            'px-3 py-2 text-sm font-medium',
            value === 'false'
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-background text-foreground hover:bg-red-50 hover:text-red-700'
          )}
        >
          No
        </Button>
      </ButtonGroup>
    </div>
  )
}
