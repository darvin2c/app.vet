'use client'

import { useEffect, useState } from 'react'
import { useMaskito } from '@maskito/react'
import {
  maskitoNumberOptionsGenerator,
  maskitoStringifyNumber,
  maskitoParseNumber,
  MaskitoNumberParams,
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

  // Estado de visualización para permitir escribir valores parciales (p.ej. ".")
  const [displayValue, setDisplayValue] = useState<string>('')

  // Sincronizar cuando el valor controlado cambie externamente
  useEffect(() => {
    const next =
      props.value != null ? maskitoStringifyNumber(props.value, maskParams) : ''
    setDisplayValue(next)
  }, [props.value])

  return (
    <InputGroup>
      <InputGroupAddon align="inline-start">{currency?.symbol}</InputGroupAddon>
      <InputGroupInput
        ref={maskedInputRef}
        placeholder={placeholder}
        value={displayValue}
        onChange={(e) => {
          const raw = e.target.value
          // Mantener lo que el usuario escribe (incluye casos como '.')
          setDisplayValue(raw)
          const parsed = maskitoParseNumber(raw, maskParams)
          // Emitir solo si es un número válido; permitir escritura parcial sin resetear el campo
          if (parsed != null) {
            props.onChange?.(parsed)
          }
        }}
        onBlur={(e) => {
          const parsed = maskitoParseNumber(e.target.value, maskParams)
          // Al salir, confirmar el valor (incluye null para vacío/inválido)
          props.onChange?.(parsed ?? null)
        }}
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
