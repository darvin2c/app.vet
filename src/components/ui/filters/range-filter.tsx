import React from 'react'
import { FilterComponentProps } from './types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface RangeFilterProps {
  config: any // Temporal para evitar errores de tipado
  value: any
  onChange: (value: any) => void
}

export default function RangeFilter({ config, value, onChange }: RangeFilterProps) {
  const [fromValue, setFromValue] = React.useState('')
  const [toValue, setToValue] = React.useState('')

  React.useEffect(() => {
    if (value && typeof value === 'object' && value.from !== undefined && value.to !== undefined) {
      setFromValue(String(value.from))
      setToValue(String(value.to))
    }
  }, [value])

  const handleFromChange = (newFrom: string) => {
    setFromValue(newFrom)
    onChange({ from: newFrom, to: toValue })
  }

  const handleToChange = (newTo: string) => {
    setToValue(newTo)
    onChange({ from: fromValue, to: newTo })
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs">Desde</Label>
          <Input
            type={config.field.toLowerCase().includes('date') ? 'date' : 'number'}
            placeholder="Desde"
            value={fromValue}
            onChange={(e) => handleFromChange(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Hasta</Label>
          <Input
            type={config.field.toLowerCase().includes('date') ? 'date' : 'number'}
            placeholder="Hasta"
            value={toValue}
            onChange={(e) => handleToChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}