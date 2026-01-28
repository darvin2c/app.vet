'use client'

import * as React from 'react'
import {
  maskitoNumberOptionsGenerator,
  maskitoParseNumber,
  maskitoStringifyNumber,
} from '@maskito/kit'
import { useMaskito } from '@maskito/react'

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useCurrency } from '@/components/ui/currency-select'

type DiscountMode = 'fixed' | 'percentage'

interface DiscountInputProps
  extends Omit<React.ComponentProps<'input'>, 'value' | 'onChange'> {
  value: number
  onChange: (value: number) => void
  totalAmount: number
  currencySymbol?: string
}

export function DiscountInput({
  value,
  onChange,
  totalAmount,
  currencySymbol,
  className,
  placeholder,
  disabled,
  ...props
}: DiscountInputProps) {
  const { currency } = useCurrency()
  const symbol = currencySymbol ?? currency?.symbol ?? '$'
  const [mode, setMode] = React.useState<DiscountMode>('percentage')

  // Mask for currency
  const currencyMaskOptions = React.useMemo(
    () =>
      maskitoNumberOptionsGenerator({
        thousandSeparator: ' ',
        decimalSeparator: '.',
        maximumFractionDigits: 2,
        min: 0,
      }),
    []
  )

  // Mask for percentage (0-100)
  const percentageMaskOptions = React.useMemo(
    () =>
      maskitoNumberOptionsGenerator({
        decimalSeparator: '.',
        maximumFractionDigits: 2,
        min: 0,
        max: 100,
      }),
    []
  )

  const maskOptions =
    mode === 'fixed' ? currencyMaskOptions : percentageMaskOptions

  const inputRef = useMaskito({ options: maskOptions })

  // Calculate display value based on mode
  const displayValue = React.useMemo(() => {
    if (mode === 'fixed') {
      return maskitoStringifyNumber(value, {
        thousandSeparator: ' ',
        decimalSeparator: '.',
        maximumFractionDigits: 2,
      })
    } else {
      // Avoid division by zero
      if (!totalAmount) return '0'
      const percentage = (value / totalAmount) * 100
      return maskitoStringifyNumber(percentage, {
        decimalSeparator: '.',
        maximumFractionDigits: 2,
      })
    }
  }, [value, mode, totalAmount])

  // Internal state to manage input value and avoid cursor jumping or decimal issues
  const [localValue, setLocalValue] = React.useState(displayValue)
  const lastEmittedValueRef = React.useRef(value)
  const lastModeRef = React.useRef(mode)

  // Sync local value when props change externally
  React.useEffect(() => {
    const valueChangedExternally = value !== lastEmittedValueRef.current
    const modeChanged = mode !== lastModeRef.current

    if (valueChangedExternally || modeChanged) {
      setLocalValue(displayValue)
      lastEmittedValueRef.current = value
      lastModeRef.current = mode
    }
  }, [value, mode, displayValue])

  const handleModeChange = (newMode: DiscountMode) => {
    if (!newMode) return // Prevent unselecting
    setMode(newMode)
    // No need to change value, value is always money amount
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setLocalValue(inputValue)

    const parsedValue = maskitoParseNumber(inputValue)

    if (isNaN(parsedValue)) {
      onChange(0)
      lastEmittedValueRef.current = 0
      return
    }

    let finalValue = 0
    if (mode === 'fixed') {
      finalValue = parsedValue
    } else {
      // Convert percentage to fixed amount
      finalValue = (parsedValue / 100) * totalAmount
    }

    // Round to 2 decimals to avoid floating point issues
    finalValue = Math.round(finalValue * 100) / 100

    onChange(finalValue)
    lastEmittedValueRef.current = finalValue
  }

  return (
    <InputGroup className={className}>
      <InputGroupAddon align={'inline-start'}>
        {mode === 'fixed' ? symbol : '%'}
      </InputGroupAddon>
      <InputGroupInput
        ref={inputRef}
        value={localValue}
        onChange={handleInputChange}
        placeholder={placeholder ?? '0.00'}
        disabled={disabled}
        {...props}
      />
      <InputGroupAddon align="inline-end" className="p-0">
        <ToggleGroup
          value={mode}
          onValueChange={(v) => handleModeChange(v as DiscountMode)}
          disabled={disabled}
          type="single"
          size="sm"
          className="gap-0"
        >
          <ToggleGroupItem
            value="percentage"
            className="rounded-none border-l-0 px-2 text-xs data-[state=on]:bg-muted data-[state=on]:text-foreground"
          >
            % Porcentaje
          </ToggleGroupItem>
          <ToggleGroupItem
            value="fixed"
            className="rounded-l-none border-l px-2 text-xs data-[state=on]:bg-muted data-[state=on]:text-foreground"
          >
            {symbol} Fijo
          </ToggleGroupItem>
        </ToggleGroup>
      </InputGroupAddon>
    </InputGroup>
  )
}
