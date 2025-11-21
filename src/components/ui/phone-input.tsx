'use client'

import * as React from 'react'
import { forwardRef, useState, useEffect, useMemo, useRef } from 'react'
import {
  parsePhoneNumberWithError as parsePhoneNumber,
  isValidPhoneNumber,
  getCountryCallingCode,
  CountryCode,
} from 'libphonenumber-js'
import { useFormContext, Controller } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldError,
} from '@/components/ui/field'
import { cn } from '@/lib/utils'
import { Phone, Check, AlertCircle } from 'lucide-react'

// Lista de países más comunes con sus códigos y banderas
const COUNTRIES: { code: CountryCode; name: string; flag: string }[] = [
  // Países de América Latina
  { code: 'PE', name: 'Perú', flag: '🇵🇪' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴' },
  { code: 'BR', name: 'Brasil', flag: '🇧🇷' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷' },
  { code: 'CU', name: 'Cuba', flag: '🇨🇺' },
  { code: 'DO', name: 'República Dominicana', flag: '🇩🇴' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨' },
  { code: 'SV', name: 'El Salvador', flag: '🇸🇻' },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹' },
  { code: 'HN', name: 'Honduras', flag: '🇭🇳' },
  { code: 'MX', name: 'México', flag: '🇲🇽' },
  { code: 'NI', name: 'Nicaragua', flag: '🇳🇮' },
  { code: 'PA', name: 'Panamá', flag: '🇵🇦' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪' },

  // América del Norte
  { code: 'US', name: 'Estados Unidos', flag: '🇺🇸' },
  { code: 'CA', name: 'Canadá', flag: '🇨🇦' },

  // Europa
  { code: 'ES', name: 'España', flag: '🇪🇸' },
  { code: 'FR', name: 'Francia', flag: '🇫🇷' },
  { code: 'DE', name: 'Alemania', flag: '🇩🇪' },
  { code: 'IT', name: 'Italia', flag: '🇮🇹' },
  { code: 'GB', name: 'Reino Unido', flag: '🇬🇧' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'NL', name: 'Países Bajos', flag: '🇳🇱' },
  { code: 'BE', name: 'Bélgica', flag: '🇧🇪' },
  { code: 'CH', name: 'Suiza', flag: '🇨🇭' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'SE', name: 'Suecia', flag: '🇸🇪' },
  { code: 'NO', name: 'Noruega', flag: '🇳🇴' },
  { code: 'DK', name: 'Dinamarca', flag: '🇩🇰' },
  { code: 'FI', name: 'Finlandia', flag: '🇫🇮' },
  { code: 'IE', name: 'Irlanda', flag: '🇮🇪' },
  { code: 'PL', name: 'Polonia', flag: '🇵🇱' },
  { code: 'CZ', name: 'República Checa', flag: '🇨🇿' },
  { code: 'HU', name: 'Hungría', flag: '🇭🇺' },
  { code: 'GR', name: 'Grecia', flag: '🇬🇷' },
  { code: 'RU', name: 'Rusia', flag: '🇷🇺' },

  // Asia
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'JP', name: 'Japón', flag: '🇯🇵' },
  { code: 'KR', name: 'Corea del Sur', flag: '🇰🇷' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'TH', name: 'Tailandia', flag: '🇹🇭' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'PH', name: 'Filipinas', flag: '🇵🇭' },
  { code: 'MY', name: 'Malasia', flag: '🇲🇾' },
  { code: 'SG', name: 'Singapur', flag: '🇸🇬' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰' },
  { code: 'TW', name: 'Taiwán', flag: '🇹🇼' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱' },
  { code: 'AE', name: 'Emiratos Árabes Unidos', flag: '🇦🇪' },
  { code: 'SA', name: 'Arabia Saudí', flag: '🇸🇦' },
  { code: 'TR', name: 'Turquía', flag: '🇹🇷' },

  // Oceanía
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'NZ', name: 'Nueva Zelanda', flag: '🇳🇿' },

  // África
  { code: 'ZA', name: 'Sudáfrica', flag: '🇿🇦' },
  { code: 'EG', name: 'Egipto', flag: '🇪🇬' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'KE', name: 'Kenia', flag: '🇰🇪' },
  { code: 'MA', name: 'Marruecos', flag: '🇲🇦' },
]

export interface PhoneInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'onChange'
  > {
  value?: string
  onChange?: (value: string, isValid: boolean) => void
  defaultCountry?: CountryCode
  variant?: 'form' | 'display' | 'compact'
  showCountrySelect?: boolean
  error?: boolean
  countries?: CountryCode[]
}

export interface PhoneDisplayProps {
  value: string
  variant?: 'default' | 'compact'
  showIcon?: boolean
  className?: string
}

// Hook para manejar la lógica del teléfono
function usePhoneValidation(value: string, country: CountryCode) {
  return useMemo(() => {
    if (!value || value.trim() === '') {
      return {
        isValid: false,
        formatted: '',
        international: '',
      }
    }

    try {
      // Intentar parsear el número
      const phoneNumber = parsePhoneNumber(value, country)

      if (phoneNumber && phoneNumber.isValid()) {
        return {
          isValid: true,
          formatted: phoneNumber.formatNational(),
          international: phoneNumber.formatInternational(),
        }
      }

      // Si no es válido con el país actual, intentar detectar automáticamente
      const autoDetected = parsePhoneNumber(value)
      if (autoDetected && autoDetected.isValid()) {
        return {
          isValid: true,
          formatted: autoDetected.formatNational(),
          international: autoDetected.formatInternational(),
          detectedCountry: autoDetected.country,
        }
      }

      return {
        isValid: false,
        formatted: value,
        international: value,
      }
    } catch {
      return {
        isValid: false,
        formatted: value,
        international: value,
      }
    }
  }, [value, country])
}

// Componente principal PhoneInput
export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      value = '',
      onChange,
      defaultCountry = 'PE',
      variant = 'form',
      showCountrySelect = true,
      error = false,
      countries = COUNTRIES.map((c) => c.code),
      className,
      placeholder = 'Ingrese número de teléfono',
      ...props
    },
    ref
  ) => {
    const normalizeToNational = (val: string): string => {
      try {
        const parsed = parsePhoneNumber(val)
        if (parsed) {
          const nationalRaw = (parsed as any).nationalNumber
          const national = nationalRaw
            ? String(nationalRaw)
            : parsed.number?.replace(
                `+${getCountryCallingCode(parsed.country as CountryCode)}`,
                ''
              )
          return String(national).replace(/\D/g, '')
        }
        return val
      } catch {
        return val
      }
    }

    const [inputValue, setInputValue] = useState(() =>
      normalizeToNational(value)
    )
    const [selectedCountry, setSelectedCountry] =
      useState<CountryCode>(defaultCountry)

    const buildE164 = (nationalValue: string, country: CountryCode) => {
      try {
        const phoneNumber = parsePhoneNumber(nationalValue, country)
        return (
          phoneNumber?.number ||
          `+${getCountryCallingCode(country)}${nationalValue.replace(/\D/g, '')}`
        )
      } catch {
        return `+${getCountryCallingCode(country)}${nationalValue.replace(/\D/g, '')}`
      }
    }

    const validation = usePhoneValidation(inputValue, selectedCountry)

    // Sincronizar con el valor externo solo si viene de fuera (no de nuestro onChange)
    const prevValueRef = useRef(value)
    useEffect(() => {
      if (value !== prevValueRef.current) {
        try {
          const parsed = parsePhoneNumber(value)
          if (parsed) {
            if (parsed.country)
              setSelectedCountry(parsed.country as CountryCode)
            const nationalRaw = (parsed as any).nationalNumber
            const national = nationalRaw
              ? String(nationalRaw)
              : parsed.number?.replace(
                  `+${getCountryCallingCode(parsed.country as CountryCode)}`,
                  ''
                )
            setInputValue(String(national).replace(/\D/g, ''))
          } else {
            setInputValue(value)
          }
        } catch {
          setInputValue(value)
        }
        prevValueRef.current = value
      }
    }, [value])

    useEffect(() => {
      if (onChange) {
        const output = buildE164(inputValue, selectedCountry)
        const valid = isValidPhoneNumber(output)
        onChange(output, valid)
      }
    }, [inputValue, selectedCountry])

    // Detectar país automáticamente si el número es válido
    useEffect(() => {
      if (
        validation.detectedCountry &&
        validation.detectedCountry !== selectedCountry
      ) {
        setSelectedCountry(validation.detectedCountry)
      }
    }, [validation.detectedCountry, selectedCountry])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value
      setInputValue(rawValue)

      if (onChange) {
        const output = buildE164(rawValue, selectedCountry)
        const valid = isValidPhoneNumber(output)
        onChange(output, valid)
      }
    }

    const handleCountryChange = (newCountry: string) => {
      const country = newCountry as CountryCode
      setSelectedCountry(country)
      if (onChange) {
        const output = buildE164(inputValue, country)
        const valid = isValidPhoneNumber(output)
        onChange(output, valid)
      }
    }

    const getCountryPrefix = (countryCode: CountryCode) => {
      try {
        return `+${getCountryCallingCode(countryCode)}`
      } catch {
        return ''
      }
    }

    const selectedCountryData = COUNTRIES.find(
      (c) => c.code === selectedCountry
    )

    // Variante compact
    if (variant === 'compact') {
      return (
        <InputGroup className={className}>
          <InputGroupAddon>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            ref={ref}
            type="tel"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            className={cn(
              error && 'border-destructive focus-visible:ring-destructive',
              validation.isValid &&
                inputValue &&
                'border-green-500 focus-visible:ring-green-500',
              !validation.isValid &&
                inputValue &&
                'border-yellow-500 focus-visible:ring-yellow-500'
            )}
            {...props}
          />
          {inputValue && (
            <InputGroupAddon align="inline-end">
              {validation.isValid ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              )}
            </InputGroupAddon>
          )}
        </InputGroup>
      )
    }

    // Variante display (solo lectura)
    if (variant === 'display') {
      return (
        <div className={cn('flex items-center space-x-2', className)}>
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {validation.international || inputValue || 'No especificado'}
          </span>
          {validation.isValid && inputValue && (
            <Check className="h-4 w-4 text-green-600" />
          )}
        </div>
      )
    }

    // Variante form (principal)
    return (
      <InputGroup className={className}>
        {showCountrySelect && (
          <InputGroupAddon>
            <Select value={selectedCountry} onValueChange={handleCountryChange}>
              <SelectTrigger className="w-[120px] border-0 shadow-none focus:ring-0 bg-transparent">
                <SelectValue>
                  <div className="flex items-center space-x-1">
                    <span className="text-base">
                      {selectedCountryData?.flag || '🌍'}
                    </span>
                    <span className="text-xs font-mono">
                      {getCountryPrefix(selectedCountry)}
                    </span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.filter((c) => countries.includes(c.code)).map(
                  (country) => (
                    <SelectItem key={country.code} value={country.code}>
                      <div className="flex items-center space-x-2">
                        <span className="text-base">{country.flag}</span>
                        <span className="text-sm">{country.name}</span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {getCountryPrefix(country.code)}
                        </span>
                      </div>
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </InputGroupAddon>
        )}

        <InputGroupInput
          ref={ref}
          type="tel"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={cn(
            error && 'border-destructive focus-visible:ring-destructive',
            validation.isValid &&
              inputValue &&
              'border-green-500 focus-visible:ring-green-500',
            !validation.isValid &&
              inputValue &&
              'border-yellow-500 focus-visible:ring-yellow-500'
          )}
          {...props}
        />

        {inputValue && (
          <InputGroupAddon align="inline-end">
            {validation.isValid ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            )}
          </InputGroupAddon>
        )}
      </InputGroup>
    )
  }
)

PhoneInput.displayName = 'PhoneInput'

// Componente para mostrar teléfonos (solo lectura)
export const PhoneDisplay = ({
  value,
  variant = 'default',
  showIcon = true,
  className,
}: PhoneDisplayProps) => {
  const formattedPhone = useMemo(() => {
    if (!value) return 'No especificado'

    try {
      const phoneNumber = parsePhoneNumber(value)
      return phoneNumber && phoneNumber.isValid()
        ? phoneNumber.formatInternational()
        : value
    } catch {
      return value
    }
  }, [value])

  const isValid = useMemo(() => {
    if (!value) return false
    try {
      return isValidPhoneNumber(value)
    } catch {
      return false
    }
  }, [value])

  if (variant === 'compact') {
    return (
      <span className={cn('text-sm font-mono', className)}>
        {formattedPhone}
      </span>
    )
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      {showIcon && <Phone className="h-4 w-4 text-muted-foreground" />}
      <span className="text-sm font-mono">{formattedPhone}</span>
      {isValid && value && <Check className="h-4 w-4 text-green-600" />}
    </div>
  )
}

// Utilidades exportadas
export const phoneUtils = {
  format: (phoneNumber: string, country?: CountryCode): string => {
    try {
      const parsed = parsePhoneNumber(phoneNumber, country)
      return parsed && parsed.isValid()
        ? parsed.formatInternational()
        : phoneNumber
    } catch {
      return phoneNumber
    }
  },

  validate: (phone: string, country?: CountryCode): boolean => {
    try {
      return isValidPhoneNumber(phone, country)
    } catch {
      return false
    }
  },

  parse: (phone: string, country?: CountryCode) => {
    try {
      return parsePhoneNumber(phone, country)
    } catch {
      return null
    }
  },

  getCountryCode: (phone: string): CountryCode | undefined => {
    try {
      const parsed = parsePhoneNumber(phone)
      return parsed?.country
    } catch {
      return undefined
    }
  },
}

export default PhoneInput

// Componente PhoneField para integración con react-hook-form
export interface PhoneFieldProps {
  name?: string
  label?: string
  description?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  defaultCountry?: CountryCode
  showCountrySelect?: boolean
  countries?: CountryCode[]
  variant?: 'form' | 'compact'
}

export function PhoneField({
  name = 'phone',
  label = 'Teléfono',
  description,
  placeholder = 'Ingrese el número de teléfono',
  required = false,
  disabled = false,
  className,
  defaultCountry = 'PE',
  showCountrySelect = true,
  countries,
  variant = 'form',
}: PhoneFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  const error = errors[name]

  return (
    <Field className={className}>
      <FieldLabel htmlFor={name}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </FieldLabel>
      <FieldContent>
        <Controller
          name={name}
          control={control}
          render={({ field: { value, onChange } }) => (
            <PhoneInput
              id={name}
              value={value || ''}
              onChange={(newValue, isValid) => onChange(newValue)}
              placeholder={placeholder}
              disabled={disabled}
              defaultCountry={defaultCountry}
              showCountrySelect={showCountrySelect}
              countries={countries}
              variant={variant}
              error={!!error}
            />
          )}
        />
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        <FieldError errors={error ? [error] : []} />
      </FieldContent>
    </Field>
  )
}

// Componente de conveniencia para formularios
export function PhoneFormField(props: Omit<PhoneFieldProps, 'variant'>) {
  return <PhoneField {...props} variant="form" />
}

// Componente de conveniencia compacto
export function PhoneCompactField(props: Omit<PhoneFieldProps, 'variant'>) {
  return <PhoneField {...props} variant="compact" />
}
