'use client'

import { Input } from '@/components/ui/input'
import { Tables } from '@/types/supabase.types'

interface ProductCostInputProps {
  mode: 'create' | 'edit'
  value?: number
  onChange?: (value: number | undefined) => void
  product?: Tables<'products'>
  disabled?: boolean
  placeholder?: string
}

export function ProductCostInput({
  mode,
  value,
  onChange,
  product,
  disabled = false,
  placeholder = '0.00',
}: ProductCostInputProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    onChange?.(inputValue === '' ? undefined : Number(inputValue))
  }

  if (mode === 'create') {
    return (
      <Input
        type="number"
        step="0.01"
        min="0"
        placeholder={placeholder}
        value={value || ''}
        onChange={handleInputChange}
        disabled={disabled}
      />
    )
  }

  // Modo edit
  return (
    <Input
      type="number"
      step="0.01"
      value={product?.cost || 0}
      className="bg-muted"
      disabled
    />
  )
}
