'use client'

import React from 'react'
import { Label } from '@/components/ui/label'

import type { CustomFilterConfig } from './types'

interface CustomFilterProps {
  config: any // Temporal para evitar errores de tipado
  value: string
  onChange: (value: string) => void
}

export default function CustomFilter({
  config,
  value,
  onChange,
}: CustomFilterProps) {
  const Component = config.component

  // Si el componente es un elemento React, clonar e inyectar props
  if (React.isValidElement(Component)) {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">{config.label}</Label>
        <div>
          {React.cloneElement(Component as React.ReactElement<any>, {
            value,
            onValueChange: onChange,
          })}
        </div>
      </div>
    )
  }

  // Si es un componente tipo, renderizar con las props esperadas
  const CompType = Component as React.ComponentType<any>

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{config.label}</Label>
      <div>
        <CompType value={value} onValueChange={onChange} />
      </div>
    </div>
  )
}
