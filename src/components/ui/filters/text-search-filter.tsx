import React from 'react'
import { FilterComponentProps } from './types'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface TextSearchFilterProps {
  config: any // Temporal para evitar errores de tipado
  value: any
  onChange: (value: any) => void
}

export default function TextSearchFilter({ config, value, onChange }: TextSearchFilterProps) {
  const [searchType, setSearchType] = React.useState(config.searchType || 'fts')
  const [searchValue, setSearchValue] = React.useState(value?.query || '')

  React.useEffect(() => {
    if (value && typeof value === 'object') {
      setSearchType(value.type || 'fts')
      setSearchValue(value.query || '')
    } else if (typeof value === 'string') {
      setSearchValue(value)
    }
  }, [value])

  const handleTypeChange = (newType: string) => {
    setSearchType(newType)
    if (searchValue.trim()) {
      onChange({
        type: newType,
        query: searchValue.trim(),
        config: config.searchConfig
      })
    }
  }

  const handleValueChange = (newValue: string) => {
    setSearchValue(newValue)
    if (newValue.trim()) {
      onChange({
        type: searchType,
        query: newValue.trim(),
        config: config.searchConfig
      })
    } else {
      onChange(null)
    }
  }

  return (
    <div className="space-y-2">
      <Select value={searchType} onValueChange={handleTypeChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fts">Búsqueda de texto completo</SelectItem>
          <SelectItem value="plfts">Búsqueda de texto parcial</SelectItem>
          <SelectItem value="phfts">Búsqueda de frase</SelectItem>
          <SelectItem value="wfts">Búsqueda de palabras web</SelectItem>
        </SelectContent>
      </Select>
      
      <Input
        placeholder={config.placeholder || 'Buscar...'}
        value={searchValue}
        onChange={(e) => handleValueChange(e.target.value)}
        className="w-full"
      />
    </div>
  )
}