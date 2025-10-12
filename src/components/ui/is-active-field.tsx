'use client'

import * as React from 'react'
import { useFormContext } from 'react-hook-form'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldError,
} from '@/components/ui/field'
import { cn } from '@/lib/utils'
import { CheckCircle, XCircle, Power } from 'lucide-react'

// Tipos para el componente
export interface IsActiveFieldProps {
  variant?: 'form' | 'display' | 'filter' | 'compact'
  name?: string
  label?: string
  description?: string
  value?: boolean
  onChange?: (value: boolean) => void
  disabled?: boolean
  className?: string
  showIcon?: boolean
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  // Props específicas para variant="filter"
  onFilterChange?: (value: 'all' | 'active' | 'inactive') => void
  filterValue?: 'all' | 'active' | 'inactive'
  // Props para personalización de textos
  activeText?: string
  inactiveText?: string
  allText?: string
}

// Opciones para el filtro
const filterOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Activos' },
  { value: 'inactive', label: 'Inactivos' },
] as const

// Componente principal
export function IsActiveField({
  variant = 'form',
  name = 'is_active',
  label = 'Estado Activo',
  description,
  value,
  onChange,
  disabled = false,
  className,
  showIcon = true,
  showLabel = true,
  size = 'md',
  onFilterChange,
  filterValue = 'all',
  activeText = 'Activo',
  inactiveText = 'Inactivo',
  allText = 'Todos',
}: IsActiveFieldProps) {
  // Para variant="form", usar react-hook-form si está disponible
  const formContext = useFormContext()
  const isFormVariant = variant === 'form' && formContext

  // Obtener valor y función de cambio
  const currentValue = isFormVariant
    ? formContext.watch(name)
    : (value ?? false)

  const handleChange = React.useCallback(
    (newValue: boolean) => {
      if (isFormVariant) {
        formContext.setValue(name, newValue)
      }
      onChange?.(newValue)
    },
    [isFormVariant, formContext, name, onChange]
  )

  // Obtener errores si es variant="form"
  const error = isFormVariant ? formContext.formState.errors[name] : undefined

  // Estilos según el tamaño
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  // Renderizar según la variante
  switch (variant) {
    case 'form':
      return (
        <Field className={className}>
          {showLabel && (
            <FieldLabel htmlFor={name} className={sizeClasses[size]}>
              {label}
            </FieldLabel>
          )}
          <FieldContent>
            <div className="flex items-center space-x-3">
              <Switch
                id={name}
                checked={currentValue}
                onCheckedChange={handleChange}
                disabled={disabled}
                className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-300"
              />
              <div className="flex items-center space-x-2">
                {showIcon &&
                  (currentValue ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-400" />
                  ))}
                <span
                  className={cn(
                    'font-medium transition-colors',
                    currentValue ? 'text-green-700' : 'text-gray-500',
                    sizeClasses[size]
                  )}
                >
                  {currentValue ? activeText : inactiveText}
                </span>
              </div>
            </div>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">
                {description}
              </p>
            )}
            <FieldError errors={error ? [error] : []} />
          </FieldContent>
        </Field>
      )

    case 'display':
      return (
        <div className={cn('flex items-center space-x-2', className)}>
          {showIcon &&
            (currentValue ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-gray-400" />
            ))}
          <Badge
            variant={currentValue ? 'default' : 'secondary'}
            className={cn(
              'transition-colors',
              currentValue
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
              sizeClasses[size]
            )}
          >
            {currentValue ? activeText : inactiveText}
          </Badge>
        </div>
      )

    case 'filter':
      return (
        <div className={cn('space-y-2', className)}>
          {showLabel && (
            <label className={cn('text-sm font-medium', sizeClasses[size])}>
              {label}
            </label>
          )}
          <Select
            value={filterValue}
            onValueChange={(value: 'all' | 'active' | 'inactive') =>
              onFilterChange?.(value)
            }
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center space-x-2">
                  <Power className="h-4 w-4 text-gray-500" />
                  <span>{allText}</span>
                </div>
              </SelectItem>
              <SelectItem value="active">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>{activeText}</span>
                </div>
              </SelectItem>
              <SelectItem value="inactive">
                <div className="flex items-center space-x-2">
                  <XCircle className="h-4 w-4 text-gray-400" />
                  <span>{inactiveText}</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      )

    case 'compact':
      return (
        <div className={cn('flex items-center space-x-2', className)}>
          <Switch
            checked={currentValue}
            onCheckedChange={handleChange}
            disabled={disabled}
            className="data-[state=checked]:bg-green-600"
          />
          {showIcon &&
            (currentValue ? (
              <CheckCircle className="h-3 w-3 text-green-600" />
            ) : (
              <XCircle className="h-3 w-3 text-gray-400" />
            ))}
          {showLabel && (
            <span
              className={cn(
                'text-xs font-medium',
                currentValue ? 'text-green-700' : 'text-gray-500'
              )}
            >
              {currentValue ? activeText : inactiveText}
            </span>
          )}
        </div>
      )

    default:
      return null
  }
}

// Hook personalizado para manejar el estado is_active
export function useIsActiveField(initialValue: boolean = true) {
  const [isActive, setIsActive] = React.useState(initialValue)

  const toggle = React.useCallback(() => {
    setIsActive((prev) => !prev)
  }, [])

  const activate = React.useCallback(() => {
    setIsActive(true)
  }, [])

  const deactivate = React.useCallback(() => {
    setIsActive(false)
  }, [])

  return {
    isActive,
    setIsActive,
    toggle,
    activate,
    deactivate,
  }
}

// Componente de conveniencia para formularios
export function IsActiveFormField(props: Omit<IsActiveFieldProps, 'variant'>) {
  return <IsActiveField {...props} variant="form" />
}

// Componente de conveniencia para visualización
export function IsActiveDisplay(props: Omit<IsActiveFieldProps, 'variant'>) {
  return <IsActiveField {...props} variant="display" />
}

// Componente de conveniencia para filtros
export function IsActiveFilter(props: Omit<IsActiveFieldProps, 'variant'>) {
  return <IsActiveField {...props} variant="filter" />
}

// Componente de conveniencia compacto
export function IsActiveCompact(props: Omit<IsActiveFieldProps, 'variant'>) {
  return <IsActiveField {...props} variant="compact" />
}
