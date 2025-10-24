'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

/**
 * Lista de monedas más comunes organizadas por región
 */
const CURRENCIES = [
  // Latinoamérica
  { value: 'PEN', label: 'Sol Peruano', symbol: 'S/', region: 'Latinoamérica' },
  {
    value: 'USD',
    label: 'Dólar Estadounidense',
    symbol: '$',
    region: 'Latinoamérica',
  },
  {
    value: 'MXN',
    label: 'Peso Mexicano',
    symbol: '$',
    region: 'Latinoamérica',
  },
  {
    value: 'COP',
    label: 'Peso Colombiano',
    symbol: '$',
    region: 'Latinoamérica',
  },
  {
    value: 'ARS',
    label: 'Peso Argentino',
    symbol: '$',
    region: 'Latinoamérica',
  },
  { value: 'CLP', label: 'Peso Chileno', symbol: '$', region: 'Latinoamérica' },
  {
    value: 'BRL',
    label: 'Real Brasileño',
    symbol: 'R$',
    region: 'Latinoamérica',
  },
  {
    value: 'VES',
    label: 'Bolívar Venezolano',
    symbol: 'Bs.',
    region: 'Latinoamérica',
  },
  {
    value: 'UYU',
    label: 'Peso Uruguayo',
    symbol: '$U',
    region: 'Latinoamérica',
  },
  { value: 'BOB', label: 'Boliviano', symbol: 'Bs', region: 'Latinoamérica' },
  {
    value: 'PYG',
    label: 'Guaraní Paraguayo',
    symbol: '₲',
    region: 'Latinoamérica',
  },
  {
    value: 'ECU',
    label: 'Dólar (Ecuador)',
    symbol: '$',
    region: 'Latinoamérica',
  },

  // Principales
  { value: 'EUR', label: 'Euro', symbol: '€', region: 'Principales' },
  {
    value: 'GBP',
    label: 'Libra Esterlina',
    symbol: '£',
    region: 'Principales',
  },
  { value: 'JPY', label: 'Yen Japonés', symbol: '¥', region: 'Principales' },
  { value: 'CHF', label: 'Franco Suizo', symbol: 'CHF', region: 'Principales' },
  {
    value: 'CAD',
    label: 'Dólar Canadiense',
    symbol: 'C$',
    region: 'Principales',
  },
  {
    value: 'AUD',
    label: 'Dólar Australiano',
    symbol: 'A$',
    region: 'Principales',
  },

  // Asia
  { value: 'CNY', label: 'Yuan Chino', symbol: '¥', region: 'Asia' },
  { value: 'KRW', label: 'Won Surcoreano', symbol: '₩', region: 'Asia' },
  { value: 'INR', label: 'Rupia India', symbol: '₹', region: 'Asia' },
  { value: 'SGD', label: 'Dólar de Singapur', symbol: 'S$', region: 'Asia' },

  // Otras
  { value: 'RUB', label: 'Rublo Ruso', symbol: '₽', region: 'Otras' },
  { value: 'ZAR', label: 'Rand Sudafricano', symbol: 'R', region: 'Otras' },
  { value: 'TRY', label: 'Lira Turca', symbol: '₺', region: 'Otras' },
]

export interface CurrencyInputProps {
  /** Valor actual de la moneda (código ISO) */
  value?: string
  /** Función que se ejecuta cuando cambia el valor */
  onChange?: (value: string) => void
  /** Texto placeholder cuando no hay selección */
  placeholder?: string
  /** Si el componente está deshabilitado */
  disabled?: boolean
  /** Clase CSS adicional */
  className?: string
  /** Nombre del campo para formularios */
  name?: string
  /** Si mostrar el símbolo de la moneda en la selección */
  showSymbol?: boolean
}

/**
 * Componente de entrada para seleccionar moneda
 *
 * @example
 * ```tsx
 * <CurrencyInput
 *   value={currency}
 *   onChange={setCurrency}
 *   placeholder="Seleccionar moneda"
 *   showSymbol={true}
 * />
 * ```
 */
const CurrencyInput = React.forwardRef<HTMLButtonElement, CurrencyInputProps>(
  (
    {
      value,
      onChange,
      placeholder = 'Seleccionar moneda...',
      disabled,
      className,
      name,
      showSymbol = true,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false)

    const selectedCurrency = CURRENCIES.find(
      (currency) => currency.value === value
    )

    // Agrupar monedas por región
    const currenciesByRegion = CURRENCIES.reduce(
      (acc, currency) => {
        if (!acc[currency.region]) {
          acc[currency.region] = []
        }
        acc[currency.region].push(currency)
        return acc
      },
      {} as Record<string, typeof CURRENCIES>
    )

    const formatCurrencyLabel = (currency: (typeof CURRENCIES)[0]) => {
      if (showSymbol) {
        return `${currency.symbol} ${currency.label} (${currency.value})`
      }
      return `${currency.label} (${currency.value})`
    }

    const formatSelectedLabel = (currency: (typeof CURRENCIES)[0]) => {
      if (showSymbol) {
        return `${currency.symbol} ${currency.value}`
      }
      return `${currency.value} - ${currency.label}`
    }

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn('w-full justify-between', className)}
            disabled={disabled}
            name={name}
          >
            {selectedCurrency
              ? formatSelectedLabel(selectedCurrency)
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar moneda..." />
            <CommandList>
              <CommandEmpty>No se encontró ninguna moneda.</CommandEmpty>
              {Object.entries(currenciesByRegion).map(
                ([region, currencies]) => (
                  <CommandGroup key={region} heading={region}>
                    {currencies.map((currency) => (
                      <CommandItem
                        key={currency.value}
                        value={currency.value}
                        onSelect={(currentValue) => {
                          onChange?.(currentValue === value ? '' : currentValue)
                          setOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            value === currency.value
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                        <div className="flex items-center gap-2">
                          {showSymbol && (
                            <span className="font-mono text-sm text-muted-foreground">
                              {currency.symbol}
                            </span>
                          )}
                          <span>{currency.label}</span>
                          <span className="text-sm text-muted-foreground">
                            ({currency.value})
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)

CurrencyInput.displayName = 'CurrencyInput'

export { CurrencyInput }
