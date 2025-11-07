import React from 'react'
import { FilterComponentProps } from './types'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'

interface ArrayFilterProps {
  config: any // Temporal para evitar errores de tipado
  value: string[]
  onChange: (value: string[]) => void
}

export default function ArrayFilter({
  config,
  value = [],
  onChange,
}: ArrayFilterProps) {
  const [inputValue, setInputValue] = React.useState('')

  const handleAdd = () => {
    if (inputValue.trim()) {
      const newArray = Array.isArray(value)
        ? [...value, inputValue.trim()]
        : [inputValue.trim()]
      onChange(newArray)
      setInputValue('')
    }
  }

  const handleRemove = (index: number) => {
    const newArray = Array.isArray(value)
      ? value.filter((_, i) => i !== index)
      : []
    onChange(newArray)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder={config.placeholder || 'Agregar valor...'}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleAdd}
          disabled={!inputValue.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {Array.isArray(value) && value.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {value.map((item, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {String(item)}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-3 w-3 p-0 hover:bg-transparent"
                onClick={() => handleRemove(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
