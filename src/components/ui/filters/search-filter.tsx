'use client'

import React, { useState } from 'react'
import { Search, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDebounce } from '@/hooks/use-debounce'

import type { SearchFilterConfig } from './types'

interface SearchFilterProps {
  config: SearchFilterConfig
  value: string
  onChange: (value: string) => void
}

export const SearchFilter = React.memo(function SearchFilter({
  config,
  value,
  onChange,
}: SearchFilterProps) {
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

  const handleClear = React.useCallback(() => {
    setLocalValue('')
    onChange('')
  }, [onChange])

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={config.key} className="text-sm font-medium">
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
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id={config.key}
          placeholder={config.placeholder}
          value={localValue}
          onChange={handleChange}
          className="pl-9"
        />
      </div>
    </div>
  )
})
