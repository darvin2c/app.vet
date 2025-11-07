'use client'

import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import type { SelectFilterConfig } from './types'

interface SelectFilterProps {
  config: any // Temporal para evitar errores de tipado
  value: string
  onChange: (value: string) => void
}

export default function SelectFilter({ config, value, onChange }: SelectFilterProps) {
  const handleValueChange = (newValue: string) => {
    if (newValue === '__all__') {
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
      <Select value={value || '__all__'} onValueChange={handleValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={config.placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Todos</SelectItem>
          {config.options.map((option: any) => (
            <SelectItem
              key={option.value.toString()}
              value={option.value.toString()}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
