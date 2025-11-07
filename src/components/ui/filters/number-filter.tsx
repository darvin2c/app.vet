'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDebounce } from '@/hooks/use-debounce'

import type { NumberFilterConfig } from './types'

interface NumberFilterProps {
  config: any // Temporal para evitar errores de tipado
  value: string
  onChange: (value: string) => void
}

export default React.memo(function NumberFilter({
  config,
  value,
  onChange,
}: NumberFilterProps) {
  const [localValue, setLocalValue] = useState(value)
  const debouncedValue = useDebounce(localValue, 400)

  React.useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue)
    }
  }, [debouncedValue, onChange, value])

  React.useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalValue(e.target.value)
    },
    []
  )

  const handleClear = () => {
    setLocalValue('')
    onChange('')
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={config.field} className="text-sm font-medium">
          {config.label}
        </Label>
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
      <Input
        id={config.field}
        type="number"
        placeholder={config.placeholder}
        value={localValue}
        onChange={handleChange}
      />
    </div>
  )
})
