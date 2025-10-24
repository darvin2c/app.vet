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
 * Lista de zonas horarias más comunes organizadas por región
 */
const TIMEZONES = [
  // América
  { value: 'America/Lima', label: 'Lima (UTC-5)', region: 'América' },
  {
    value: 'America/New_York',
    label: 'Nueva York (UTC-5/-4)',
    region: 'América',
  },
  {
    value: 'America/Los_Angeles',
    label: 'Los Ángeles (UTC-8/-7)',
    region: 'América',
  },
  { value: 'America/Chicago', label: 'Chicago (UTC-6/-5)', region: 'América' },
  { value: 'America/Denver', label: 'Denver (UTC-7/-6)', region: 'América' },
  {
    value: 'America/Mexico_City',
    label: 'Ciudad de México (UTC-6/-5)',
    region: 'América',
  },
  { value: 'America/Bogota', label: 'Bogotá (UTC-5)', region: 'América' },
  {
    value: 'America/Buenos_Aires',
    label: 'Buenos Aires (UTC-3)',
    region: 'América',
  },
  {
    value: 'America/Santiago',
    label: 'Santiago (UTC-4/-3)',
    region: 'América',
  },
  { value: 'America/Caracas', label: 'Caracas (UTC-4)', region: 'América' },

  // Europa
  { value: 'Europe/London', label: 'Londres (UTC+0/+1)', region: 'Europa' },
  { value: 'Europe/Madrid', label: 'Madrid (UTC+1/+2)', region: 'Europa' },
  { value: 'Europe/Paris', label: 'París (UTC+1/+2)', region: 'Europa' },
  { value: 'Europe/Berlin', label: 'Berlín (UTC+1/+2)', region: 'Europa' },
  { value: 'Europe/Rome', label: 'Roma (UTC+1/+2)', region: 'Europa' },

  // Asia
  { value: 'Asia/Tokyo', label: 'Tokio (UTC+9)', region: 'Asia' },
  { value: 'Asia/Shanghai', label: 'Shanghái (UTC+8)', region: 'Asia' },
  { value: 'Asia/Dubai', label: 'Dubái (UTC+4)', region: 'Asia' },
  { value: 'Asia/Kolkata', label: 'Kolkata (UTC+5:30)', region: 'Asia' },

  // Oceanía
  {
    value: 'Australia/Sydney',
    label: 'Sídney (UTC+10/+11)',
    region: 'Oceanía',
  },
  {
    value: 'Pacific/Auckland',
    label: 'Auckland (UTC+12/+13)',
    region: 'Oceanía',
  },
]

export interface TimezoneInputProps {
  /** Valor actual de la zona horaria */
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
}

/**
 * Componente de entrada para seleccionar zona horaria
 *
 * @example
 * ```tsx
 * <TimezoneInput
 *   value={timezone}
 *   onChange={setTimezone}
 *   placeholder="Seleccionar zona horaria"
 * />
 * ```
 */
const TimezoneInput = React.forwardRef<HTMLButtonElement, TimezoneInputProps>(
  (
    {
      value,
      onChange,
      placeholder = 'Seleccionar zona horaria...',
      disabled,
      className,
      name,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false)

    const selectedTimezone = TIMEZONES.find(
      (timezone) => timezone.value === value
    )

    // Agrupar zonas horarias por región
    const timezonesByRegion = TIMEZONES.reduce(
      (acc, timezone) => {
        if (!acc[timezone.region]) {
          acc[timezone.region] = []
        }
        acc[timezone.region].push(timezone)
        return acc
      },
      {} as Record<string, typeof TIMEZONES>
    )

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
            {selectedTimezone ? selectedTimezone.label : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar zona horaria..." />
            <CommandList>
              <CommandEmpty>No se encontró ninguna zona horaria.</CommandEmpty>
              {Object.entries(timezonesByRegion).map(([region, timezones]) => (
                <CommandGroup key={region} heading={region}>
                  {timezones.map((timezone) => (
                    <CommandItem
                      key={timezone.value}
                      value={timezone.value}
                      onSelect={(currentValue) => {
                        onChange?.(currentValue === value ? '' : currentValue)
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value === timezone.value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {timezone.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)

TimezoneInput.displayName = 'TimezoneInput'

export { TimezoneInput }
