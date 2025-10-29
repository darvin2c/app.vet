'use client'

import { useMemo } from 'react'
import { useMaskito } from '@maskito/react'
import { maskitoNumberOptionsGenerator } from '@maskito/kit'
import { InputGroup, InputGroupAddon, InputGroupInput } from './input-group'
import { useCurrency } from './currency-select'

function parseFormat(format: string) {
  const hasThousandsSeparator = format.includes(',')
  const decimalIndex = format.indexOf('.')
  const decimals = decimalIndex >= 0 ? format.length - decimalIndex - 1 : 0
  return { hasThousandsSeparator, decimals }
}

type CurrencyInputProps = React.ComponentProps<'input'> & {
  children?: React.ReactNode
  format?: string
}

export function CurrencyInput({
  children,
  format = '#,##0.00',
  placeholder = '0.00',
  ...props
}: CurrencyInputProps) {
  const { currency } = useCurrency()

  const maskOptions = useMemo(() => {
    const { hasThousandsSeparator, decimals } = parseFormat(format)

    return maskitoNumberOptionsGenerator({
      thousandSeparator: hasThousandsSeparator ? ',' : '',
      decimalSeparator: '.',
      maximumFractionDigits: decimals,
      min: 0,
    })
  }, [format])

  const maskedInputRef = useMaskito({ options: maskOptions })

  return (
    <InputGroup>
      <InputGroupAddon align="inline-start">{currency?.symbol}</InputGroupAddon>
      <InputGroupInput
        ref={maskedInputRef}
        placeholder={placeholder}
        {...props}
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
