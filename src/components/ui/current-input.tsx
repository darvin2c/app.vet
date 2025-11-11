'use client'

import { useMaskito } from '@maskito/react'
import {
  maskitoNumberOptionsGenerator,
  MaskitoNumberParams,
} from '@maskito/kit'
import { InputGroup, InputGroupAddon, InputGroupInput } from './input-group'
import { useCurrency } from './currency-select'

type CurrencyInputProps = React.ComponentProps<'input'> & {
  children?: React.ReactNode
  format?: string
}

const maskParams: MaskitoNumberParams = {
  thousandSeparator: ' ',
  decimalSeparator: '.',
  maximumFractionDigits: 2,
  min: 0,
}

const maskOptions = maskitoNumberOptionsGenerator(maskParams)

export function CurrencyInput({
  children,
  placeholder = '0.00',
  ...props
}: CurrencyInputProps) {
  const { currency } = useCurrency()

  const maskedInputRef = useMaskito({ options: maskOptions })
  return (
    <InputGroup>
      <InputGroupAddon align="inline-start">{currency?.symbol}</InputGroupAddon>
      <InputGroupInput
        placeholder={placeholder}
        {...props}
        ref={maskedInputRef}
      />
      {children}
    </InputGroup>
  )
}

CurrencyInput.displayName = 'CurrencyInput'

type CurrencyDisplayProps = React.ComponentProps<'span'> & {
  value?: number
}

export function CurrencyDisplay({
  children,
  value = 0,
  ...props
}: CurrencyDisplayProps) {
  const { currency } = useCurrency()
  if (isNaN(value)) {
    return null
  }
  return (
    <span {...props}>
      {currency?.symbol} {value.toFixed(2)}
    </span>
  )
}

CurrencyDisplay.displayName = 'CurrencyDisplay'
