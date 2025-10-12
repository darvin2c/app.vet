'use client'

import * as React from 'react'
import { MapPin, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDebounce } from '@/hooks/use-debounce'
import { setOptions, importLibrary } from '@googlemaps/js-api-loader'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import type {
  AddressInputProps,
  PlacePrediction,
  PlaceResult,
  AddressInputState,
} from '@/types/address.types'

// Variable global para el loader de Google Maps
let isGoogleMapsInitialized = false
let useLegacyAPI = false

// Función para inicializar Google Maps API
const initializeGoogleMaps = async () => {
  if (!isGoogleMapsInitialized) {
    setOptions({
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      v: 'weekly',
    })
    isGoogleMapsInitialized = true
  }

  return importLibrary('places')
}

// Función para detectar si el error es de API bloqueada
const isAPIBlockedError = (error: any): boolean => {
  const errorMessage = error?.message || error?.toString() || ''
  return (
    errorMessage.includes('AutocompletePlaces are blocked') ||
    errorMessage.includes('places.googleapis.com') ||
    errorMessage.includes('RpcError')
  )
}

// Función para buscar predicciones usando Google Places API Legacy
const searchPredictionsLegacy = async (
  input: string,
  options?: {
    countryRestriction?: string[]
    types?: string[]
  }
): Promise<PlacePrediction[]> => {
  if (!input.trim()) return []

  try {
    const placesLibrary = await initializeGoogleMaps()
    const { AutocompleteService } = placesLibrary as any

    const autocompleteService = new AutocompleteService()

    const request: google.maps.places.AutocompletionRequest = {
      input,
      componentRestrictions: options?.countryRestriction
        ? { country: options.countryRestriction }
        : undefined,
      types: options?.types,
    }

    return new Promise((resolve, reject) => {
      autocompleteService.getPlacePredictions(
        request,
        (
          predictions: google.maps.places.AutocompletePrediction[] | null,
          status: google.maps.places.PlacesServiceStatus
        ) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            const formattedPredictions: PlacePrediction[] = predictions.map(
              (prediction) => ({
                placeId: prediction.place_id,
                text: {
                  text: prediction.description,
                  matches:
                    prediction.matched_substrings?.map((match) => ({
                      startOffset: match.offset,
                      endOffset: match.offset + match.length,
                    })) || [],
                },
                structuredFormat: {
                  mainText: {
                    text:
                      prediction.structured_formatting?.main_text ||
                      prediction.description,
                    matches:
                      prediction.structured_formatting?.main_text_matched_substrings?.map(
                        (match) => ({
                          startOffset: match.offset,
                          endOffset: match.offset + match.length,
                        })
                      ) || [],
                  },
                  secondaryText: {
                    text:
                      prediction.structured_formatting?.secondary_text || '',
                    matches: [],
                  },
                },
                types: prediction.types || [],
                // Mantenemos compatibilidad con la API legacy
                place_id: prediction.place_id,
                description: prediction.description,
                matched_substrings: prediction.matched_substrings || [],
                structured_formatting: {
                  main_text:
                    prediction.structured_formatting?.main_text ||
                    prediction.description,
                  secondary_text:
                    prediction.structured_formatting?.secondary_text || '',
                  main_text_matched_substrings:
                    prediction.structured_formatting
                      ?.main_text_matched_substrings || [],
                },
                terms: prediction.terms || [],
              })
            )
            resolve(formattedPredictions)
          } else {
            resolve([])
          }
        }
      )
    })
  } catch (error) {
    console.error('Error searching predictions with legacy API:', error)
    throw error
  }
}

// Función para buscar predicciones usando Google Places API (Nueva API)
const searchPredictions = async (
  input: string,
  options?: {
    countryRestriction?: string[]
    types?: string[]
  }
): Promise<PlacePrediction[]> => {
  if (!input.trim()) return []

  // Si ya sabemos que debemos usar la API legacy, usarla directamente
  if (useLegacyAPI) {
    return searchPredictionsLegacy(input, options)
  }

  try {
    const placesLibrary = await initializeGoogleMaps()
    const { AutocompleteSuggestion } = placesLibrary as any

    const request: google.maps.places.AutocompleteRequest = {
      input,
      includedRegionCodes: options?.countryRestriction,
      includedPrimaryTypes: options?.types,
    }

    const response =
      await AutocompleteSuggestion.fetchAutocompleteSuggestions(request)

    if (response.suggestions) {
      const formattedPredictions: PlacePrediction[] = response.suggestions
        .filter((suggestion: any) => suggestion.placePrediction)
        .map((suggestion: any) => {
          const prediction = suggestion.placePrediction
          return {
            place_id: prediction.placeId,
            description: prediction.text.text,
            matched_substrings:
              prediction.text.matches?.map((match: any) => ({
                offset: match.startOffset,
                length: match.endOffset - match.startOffset,
              })) || [],
            structured_formatting: {
              main_text:
                prediction.structuredFormat?.mainText?.text ||
                prediction.text.text,
              secondary_text:
                prediction.structuredFormat?.secondaryText?.text || '',
              main_text_matched_substrings:
                prediction.structuredFormat?.mainText?.matches?.map(
                  (match: any) => ({
                    offset: match.startOffset,
                    length: match.endOffset - match.startOffset,
                  })
                ) || [],
            },
            terms: [], // La nueva API no proporciona términos de la misma manera
            types: prediction.types || [],
          }
        })
      return formattedPredictions
    }

    return []
  } catch (error) {
    console.error('Error searching predictions:', error)

    // Detectar si es un error de API bloqueada y hacer fallback a legacy API
    if (isAPIBlockedError(error)) {
      console.warn(
        '⚠️ New Places API is blocked. Falling back to legacy Places API. Consider enabling "Places API (New)" in your Google Cloud Console.'
      )
      useLegacyAPI = true
      return searchPredictionsLegacy(input, options)
    }

    throw error
  }
}

// Función para obtener detalles del lugar usando Google Places API Legacy
const getPlaceDetailsLegacy = async (placeId: string): Promise<PlaceResult> => {
  try {
    const placesLibrary = await initializeGoogleMaps()
    const { PlacesService } = placesLibrary as any

    // Crear un div temporal para el servicio de Places
    const tempDiv = document.createElement('div')
    const placesService = new PlacesService(tempDiv)

    const request: google.maps.places.PlaceDetailsRequest = {
      placeId,
      fields: [
        'place_id',
        'formatted_address',
        'geometry',
        'address_components',
        'name',
        'types',
      ],
    }

    return new Promise((resolve, reject) => {
      placesService.getDetails(
        request,
        (
          place: google.maps.places.PlaceResult | null,
          status: google.maps.places.PlacesServiceStatus
        ) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            const placeResult: PlaceResult = {
              // Nueva API (camelCase) - para compatibilidad
              placeId: place.place_id || '',
              formattedAddress: place.formatted_address || '',
              addressComponents:
                place.address_components?.map((component) => ({
                  longText: component.long_name,
                  shortText: component.short_name,
                  types: component.types,
                  // Compatibilidad con API legacy
                  long_name: component.long_name,
                  short_name: component.short_name,
                })) || [],
              displayName: place.name || '',
              // API legacy (snake_case)
              place_id: place.place_id || '',
              formatted_address: place.formatted_address || '',
              address_components:
                place.address_components?.map((component) => ({
                  longText: component.long_name,
                  shortText: component.short_name,
                  types: component.types,
                  long_name: component.long_name,
                  short_name: component.short_name,
                })) || [],
              geometry: {
                location: {
                  lat: place.geometry?.location?.lat() || 0,
                  lng: place.geometry?.location?.lng() || 0,
                },
                viewport: place.geometry?.viewport
                  ? {
                      northeast: {
                        lat: place.geometry.viewport.getNorthEast().lat(),
                        lng: place.geometry.viewport.getNorthEast().lng(),
                      },
                      southwest: {
                        lat: place.geometry.viewport.getSouthWest().lat(),
                        lng: place.geometry.viewport.getSouthWest().lng(),
                      },
                    }
                  : undefined,
              },
              name: place.name || '',
              types: place.types || [],
            }

            resolve(placeResult)
          } else {
            reject(new Error(`Places service failed with status: ${status}`))
          }
        }
      )
    })
  } catch (error) {
    console.error('Error getting place details with legacy API:', error)
    throw error
  }
}

// Función para obtener detalles del lugar usando Google Places API (Nueva API)
const getPlaceDetails = async (placeId: string): Promise<PlaceResult> => {
  // Si ya sabemos que debemos usar la API legacy, usarla directamente
  if (useLegacyAPI) {
    return getPlaceDetailsLegacy(placeId)
  }

  try {
    const placesLibrary = await initializeGoogleMaps()
    const { Place } = placesLibrary as any

    const place = new Place({
      id: placeId,
    })

    const fields = [
      'id',
      'formattedAddress',
      'location',
      'viewport',
      'addressComponents',
      'displayName',
      'types',
    ]

    await place.fetchFields({ fields })

    const placeResult: PlaceResult = {
      // Nueva API (camelCase)
      placeId: place.id,
      formattedAddress: place.formattedAddress || '',
      addressComponents:
        place.addressComponents?.map((component: any) => ({
          longText: component.longText,
          shortText: component.shortText,
          types: component.types,
          // Compatibilidad con API legacy
          long_name: component.longText,
          short_name: component.shortText,
        })) || [],
      displayName: place.displayName?.text || place.displayName,
      // Compatibilidad con API legacy
      place_id: place.id,
      formatted_address: place.formattedAddress || '',
      address_components:
        place.addressComponents?.map((component: any) => ({
          longText: component.longText,
          shortText: component.shortText,
          types: component.types,
          long_name: component.longText,
          short_name: component.shortText,
        })) || [],
      geometry: {
        location: {
          lat: place.location?.lat() || 0,
          lng: place.location?.lng() || 0,
        },
        viewport: place.viewport
          ? {
              northeast: {
                lat: place.viewport.getNorthEast().lat(),
                lng: place.viewport.getNorthEast().lng(),
              },
              southwest: {
                lat: place.viewport.getSouthWest().lat(),
                lng: place.viewport.getSouthWest().lng(),
              },
            }
          : undefined,
      },
      name: place.displayName?.text || place.displayName,
      types: place.types || [],
    }

    return placeResult
  } catch (error) {
    console.error('Error getting place details:', error)

    // Detectar si es un error de API bloqueada y hacer fallback a legacy API
    if (isAPIBlockedError(error)) {
      console.warn(
        '⚠️ New Places API is blocked. Falling back to legacy Places API for place details.'
      )
      useLegacyAPI = true
      return getPlaceDetailsLegacy(placeId)
    }

    throw error
  }
}

export const AddressInput = React.forwardRef<
  HTMLInputElement,
  AddressInputProps
>(
  (
    {
      value = '',
      onChange,
      onAddressSelect,
      placeholder = 'Ingresa una dirección',
      countryRestriction,
      types,
      debounceMs = 300,
      disabled = false,
      required = false,
      size = 'default',
      className,
      error,
      ...props
    },
    ref
  ) => {
    const [state, setState] = React.useState<AddressInputState>({
      isLoading: false,
      predictions: [],
      selectedPrediction: null,
      isOpen: false,
      error: null,
    })

    const [inputValue, setInputValue] = React.useState(value)
    const [selectedIndex, setSelectedIndex] = React.useState(-1)
    const debouncedValue = useDebounce(inputValue, debounceMs)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const justSelectedRef = React.useRef(false) // Bandera para rastrear selecciones recientes

    // Buscar predicciones usando Google Places API
    const searchPlacePredictions = React.useCallback(
      async (query: string) => {
        if (!query.trim()) {
          setState((prev) => ({
            ...prev,
            predictions: [],
            isLoading: false,
            isOpen: false,
          }))
          return
        }

        setState((prev) => ({ ...prev, isLoading: true, error: null }))

        try {
          const predictions = await searchPredictions(query, {
            countryRestriction,
            types,
          })

          setState((prev) => ({
            ...prev,
            predictions,
            isLoading: false,
            isOpen: predictions.length > 0,
          }))
        } catch (err) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: 'Error al buscar direcciones',
            isOpen: false,
          }))
        }
      },
      [countryRestriction, types]
    )

    // Obtener detalles del lugar usando Google Places API
    const getPlaceDetailsById = React.useCallback(async (placeId: string) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true }))

        const placeDetails = await getPlaceDetails(placeId)

        setState((prev) => ({ ...prev, isLoading: false }))
        return placeDetails
      } catch (err) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: 'Error al obtener detalles de la dirección',
        }))
        return null
      }
    }, [])

    // Efecto para buscar predicciones cuando cambia el valor debounced
    React.useEffect(() => {
      // No buscar predicciones si acabamos de hacer una selección
      if (justSelectedRef.current) {
        justSelectedRef.current = false
        return
      }

      if (debouncedValue !== value) {
        searchPlacePredictions(debouncedValue)
      }
    }, [debouncedValue, value, searchPlacePredictions])

    // Reset selected index when predictions change
    React.useEffect(() => {
      setSelectedIndex(-1)
    }, [state.predictions])

    // Manejar cambio de input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setInputValue(newValue)
      onChange?.(newValue)
      setSelectedIndex(-1) // Reset selection when typing

      // Resetear la bandera cuando el usuario escribe activamente
      justSelectedRef.current = false

      if (!newValue.trim()) {
        setState((prev) => ({
          ...prev,
          predictions: [],
          isOpen: false,
          selectedPrediction: null,
        }))
      }
    }

    // Manejar selección de predicción
    const handlePredictionSelect = async (prediction: PlacePrediction) => {
      // Marcar que acabamos de hacer una selección
      justSelectedRef.current = true

      const displayText =
        prediction.text?.text ||
        prediction.description ||
        'Dirección seleccionada'
      setInputValue(displayText)
      onChange?.(displayText)
      setSelectedIndex(-1)

      setState((prev) => ({
        ...prev,
        selectedPrediction: prediction,
        isOpen: false,
      }))

      // Obtener detalles del lugar
      const placeId = prediction.placeId || prediction.place_id
      const placeDetails = await getPlaceDetailsById(placeId)
      if (placeDetails) {
        onAddressSelect?.(placeDetails)
      }
    }

    // Limpiar input
    const handleClear = () => {
      setInputValue('')
      onChange?.('')
      setSelectedIndex(-1)
      justSelectedRef.current = false // Resetear la bandera al limpiar
      setState((prev) => ({
        ...prev,
        predictions: [],
        selectedPrediction: null,
        isOpen: false,
      }))
    }

    // Manejar apertura/cierre del popover
    const handleOpenChange = (open: boolean) => {
      setState((prev) => ({ ...prev, isOpen: open }))
    }

    // Manejar eventos de foco del input
    const handleInputFocus = () => {
      if (inputValue.trim() && state.predictions.length > 0) {
        setState((prev) => ({ ...prev, isOpen: true }))
      }
    }

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // Solo cerrar si el foco no se mueve a un elemento dentro del popover
      const relatedTarget = e.relatedTarget as HTMLElement
      if (
        !relatedTarget ||
        !relatedTarget.closest('[data-radix-popover-content]')
      ) {
        setState((prev) => ({ ...prev, isOpen: false }))
      }
    }

    // Manejar navegación por teclado
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!state.isOpen || state.predictions.length === 0) {
        if (e.key === 'ArrowDown' && state.predictions.length > 0) {
          e.preventDefault()
          setState((prev) => ({ ...prev, isOpen: true }))
          setSelectedIndex(0)
        }
        return
      }

      switch (e.key) {
        case 'Escape':
          e.preventDefault()
          setState((prev) => ({ ...prev, isOpen: false }))
          setSelectedIndex(-1)
          inputRef.current?.focus()
          break

        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev < state.predictions.length - 1 ? prev + 1 : 0
          )
          break

        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : state.predictions.length - 1
          )
          break

        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0 && selectedIndex < state.predictions.length) {
            handlePredictionSelect(state.predictions[selectedIndex])
          }
          break

        case 'Tab':
          setState((prev) => ({ ...prev, isOpen: false }))
          setSelectedIndex(-1)
          break
      }
    }

    const hasValue = inputValue.length > 0
    const showClearButton = hasValue && !disabled
    const showLoadingSpinner = state.isLoading

    return (
      <div className="relative">
        <InputGroup
          className={cn(
            'cursor-text',
            error && 'border-destructive',
            className
          )}
          data-disabled={disabled}
        >
          <InputGroupAddon align="inline-start">
            <MapPin className="text-muted-foreground" />
          </InputGroupAddon>

          <InputGroupInput
            ref={(node) => {
              inputRef.current = node
              if (typeof ref === 'function') {
                ref(node)
              } else if (ref) {
                ref.current = node
              }
            }}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-expanded={state.isOpen}
            aria-haspopup="listbox"
            aria-activedescendant={
              selectedIndex >= 0 ? `prediction-${selectedIndex}` : undefined
            }
            role="combobox"
            className={cn(
              size === 'sm' && 'h-8 text-sm',
              size === 'lg' && 'h-11 text-base'
            )}
            {...props}
          />

          {(showLoadingSpinner || showClearButton) && (
            <InputGroupAddon align="inline-end">
              {showLoadingSpinner && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
              {showClearButton && !showLoadingSpinner && (
                <InputGroupButton
                  size="icon-xs"
                  variant="ghost"
                  onClick={handleClear}
                  type="button"
                  aria-label="Limpiar dirección"
                >
                  <X className="h-3 w-3" />
                </InputGroupButton>
              )}
            </InputGroupAddon>
          )}
        </InputGroup>

        <Popover open={state.isOpen} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <div className="absolute inset-0 pointer-events-none" />
          </PopoverTrigger>
          {state.predictions.length > 0 && (
            <PopoverContent
              className="w-[--radix-popover-trigger-width] p-0"
              align="start"
              side="bottom"
              sideOffset={4}
              onOpenAutoFocus={(e) => e.preventDefault()}
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <Command>
                <CommandList>
                  <CommandGroup>
                    {state.predictions.map((prediction, index) => (
                      <CommandItem
                        key={prediction.placeId || prediction.place_id}
                        id={`prediction-${index}`}
                        value={prediction.text?.text || prediction.description}
                        onSelect={() => handlePredictionSelect(prediction)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={cn(
                          'cursor-pointer',
                          selectedIndex === index && 'bg-accent'
                        )}
                        onMouseDown={(e) => e.preventDefault()} // Prevenir pérdida de foco
                      >
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {prediction.structuredFormat?.mainText?.text ||
                              prediction.text?.text ||
                              prediction.description ||
                              'Dirección'}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {prediction.structuredFormat?.secondaryText?.text ||
                              ''}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          )}
        </Popover>
      </div>
    )
  }
)

AddressInput.displayName = 'AddressInput'
