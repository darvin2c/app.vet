'use client'

import React from 'react'
import { Label } from '@/components/ui/label'

import type { CustomFilterConfig } from './types'

interface CustomFilterProps {
  config: CustomFilterConfig
  value: string
  onChange: (value: string) => void
}

export function CustomFilter({ config, value, onChange }: CustomFilterProps) {
  const Component = config.component

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{config.label}</Label>
      <div>
        <Component value={value} onValueChange={onChange} />
      </div>
    </div>
  )
}
