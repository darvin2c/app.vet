'use client'

import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'

import type { MultiSelectFilterConfig } from './types'

interface MultiSelectFilterProps {
  config: MultiSelectFilterConfig
  value: string[]
  onChange: (value: string[]) => void
}

export function MultiSelectFilter({
  config,
  value,
  onChange,
}: MultiSelectFilterProps) {
  const toggleOption = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue]
    onChange(newValue)
  }

  const handleClear = () => {
    onChange([])
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{config.label}</Label>
        {value.length > 0 && (
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
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            {value.length === 0
              ? config.placeholder || 'Seleccionar...'
              : `${value.length} seleccionado${value.length > 1 ? 's' : ''}`}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <div className="p-4 space-y-2">
            {config.options.map((option) => (
              <div
                key={option.value.toString()}
                className="flex items-center space-x-2"
              >
                <Checkbox
                  id={`${config.key}-${option.value}`}
                  checked={value.includes(option.value.toString())}
                  onCheckedChange={() => toggleOption(option.value.toString())}
                />
                <Label
                  htmlFor={`${config.key}-${option.value}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Mostrar badges de selecciones */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {value.map((selectedValue) => {
            const option = config.options.find(
              (opt) => opt.value.toString() === selectedValue
            )
            return option ? (
              <Badge
                key={selectedValue}
                variant="secondary"
                className="text-xs"
              >
                {option.label}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => toggleOption(selectedValue)}
                />
              </Badge>
            ) : null
          })}
        </div>
      )}
    </div>
  )
}
