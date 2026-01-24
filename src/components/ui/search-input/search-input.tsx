'use client'

import * as React from 'react'
import { Search as SearchIcon, X, Loader2 } from 'lucide-react'
import { useQueryState, parseAsString } from 'nuqs'
import { cn } from '@/lib/utils'
import { useDebounce } from '@/hooks/use-debounce'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import { Kbd } from '@/components/ui/kbd'

import { useIsFetching } from '@tanstack/react-query'
import { ButtonGroup } from '../button-group'

export interface SearchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  value?: string
  onValueChange?: (value: string) => void
  debounceMs?: number
  suffix?: React.ReactNode
  enableShortcut?: boolean
  isLoading?: boolean
  showClear?: boolean
  size?: 'sm' | 'default' | 'lg'
  containerClassName?: string
  urlParamName?: string
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchProps>(
  (props, ref) => {
    const {
      className,
      containerClassName,
      value,
      onChange,
      onValueChange,
      debounceMs = 300,
      suffix,
      enableShortcut = false,
      isLoading = false,
      showClear = true,
      size = 'default',
      placeholder = 'Buscar...',
      urlParamName = 'search',
      ...restProps
    } = props

    const [urlValue, setUrlValue] = useQueryState(
      urlParamName,
      parseAsString.withDefault('')
    )
    const inputRef = React.useRef<HTMLInputElement>(null)

    // Estado local para el valor del input (respuesta inmediata en UI)
    const [localValue, setLocalValue] = React.useState(urlValue)

    // Valor con debounce que se enviará a la URL
    const debouncedValue = useDebounce(localValue, debounceMs)

    const isFetching = useIsFetching()

    const sizeClasses = {
      sm: '!h-8',
      default: '!h-9',
      lg: '!h-12',
    }

    const iconSizeClasses = {
      sm: 'h-3 w-3',
      default: 'h-4 w-4',
      lg: 'h-5 w-5',
    }

    const currentValue = (value as string) || ''
    const showClearButton = showClear && currentValue.length > 0 && !isLoading
    const showSuffix = suffix && !isLoading
    const showShortcut = enableShortcut && !currentValue && !isLoading

    // Combine refs
    React.useImperativeHandle(ref, () => inputRef.current!, [])

    // Handle keyboard shortcuts
    React.useEffect(() => {
      if (!enableShortcut) return

      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault()
          inputRef.current?.focus()
        }
      }

      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, [enableShortcut])

    // Efecto para sincronizar el valor debounced con la URL
    React.useEffect(() => {
      if (debouncedValue !== urlValue) {
        setUrlValue(debouncedValue)
      }
    }, [debouncedValue, setUrlValue, urlValue])

    // Efecto para sincronizar cambios externos con el estado local
    React.useEffect(() => {
      setLocalValue(urlValue)
    }, [urlValue])

    // Handle debounce for onValueChange callback
    React.useEffect(() => {
      onValueChange?.(debouncedValue)
    }, [debouncedValue, onValueChange])

    // Sync external value changes
    React.useEffect(() => {
      if (value !== undefined && value !== localValue) {
        setLocalValue(value)
      }
    }, [value, localValue])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setLocalValue(newValue)
      onChange?.(e)
    }

    const handleClear = () => {
      setLocalValue('')
      inputRef.current?.focus()
    }

    return (
      <div className="flex gap-2 items-center">
        <ButtonGroup className="w-full">
          <InputGroup className={cn(sizeClasses[size], containerClassName)}>
            {/* Search icon - left side */}
            <InputGroupAddon align="inline-start">
              <SearchIcon className={iconSizeClasses[size]} />
            </InputGroupAddon>

            {/* Input field */}
            <InputGroupInput
              ref={inputRef}
              type="text"
              value={localValue}
              onChange={handleInputChange}
              placeholder={placeholder}
              className={cn(
                size === 'sm' && 'text-sm',
                size === 'lg' && 'text-lg',
                className
              )}
              {...restProps}
            />

            {/* Right side elements */}
            {/* Loading spinner - highest priority */}
            {isLoading || isFetching ? (
              <Loader2
                className={cn(
                  'animate-spin',
                  iconSizeClasses[size]
                )}
              />
            ) : null}

            {/* Clear button */}
            {showClearButton ? (
              <InputGroupButton
                type="button"
                onClick={handleClear}
                size={size === 'sm' ? 'icon-xs' : 'icon-sm'}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className={iconSizeClasses[size]} />
              </InputGroupButton>
            ) : null}

            {/* Keyboard shortcut hint */}
            {showShortcut ? (
              <InputGroupText className="text-xs pointer-events-none">
                <Kbd>Ctrl+K</Kbd>
              </InputGroupText>
            ) : null}

            {/* Suffix */}
          </InputGroup>
          {showSuffix ? suffix : null}
        </ButtonGroup>
      </div>
    )
  }
)

SearchInput.displayName = 'SearchInput'

export { SearchInput }
