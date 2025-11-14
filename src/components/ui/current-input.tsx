'use client'

import { useMaskito } from '@maskito/react'
import {
  maskitoNumberOptionsGenerator,
  MaskitoNumberParams,
  maskitoParseNumber,
  maskitoStringifyNumber,
} from '@maskito/kit'
import { InputGroup, InputGroupAddon, InputGroupInput } from './input-group'
import { useCurrency } from './currency-select'

type CurrencyInputProps = React.ComponentProps<'input'> & {
  children?: React.ReactNode
  format?: string
  value?: number | null
  onChange?: (value?: number | null) => void
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
  const displayValue = props.value
    ? maskitoStringifyNumber(props.value, maskParams)
    : ''
  return (
    <InputGroup>
      <InputGroupAddon align="inline-start">{currency?.symbol}</InputGroupAddon>
      <InputGroupInput
        placeholder={placeholder}
        {...props}
        value={displayValue}
        onChange={(e) => {
          const v = maskitoParseNumber(e.target.value)
          if (!isNaN(v)) {
            props.onChange?.(v)
          } else {
            props.onChange?.(null)
          }
        }}
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

export function CurrencyDisplay({ value, ...props }: CurrencyDisplayProps) {
  const { currency } = useCurrency()
  if (!value || isNaN(value)) {
    return null
  }
  return (
    <span {...props}>
      {currency?.symbol} {value.toFixed(2)}
    </span>
  )
}

CurrencyDisplay.displayName = 'CurrencyDisplay'
