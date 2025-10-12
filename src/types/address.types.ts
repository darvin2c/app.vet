/**
 * Tipos TypeScript para el componente AddressInput y Google Places API
 */

// Tipos básicos de Google Places API (Nueva API - camelCase)
export interface AddressComponent {
  longText: string
  shortText: string
  types: string[]
  // Mantenemos compatibilidad con la API legacy
  long_name: string
  short_name: string
}

export interface PlaceGeometry {
  location: {
    lat: number
    lng: number
  }
  viewport?: {
    northeast: {
      lat: number
      lng: number
    }
    southwest: {
      lat: number
      lng: number
    }
  }
}

export interface PlaceResult {
  placeId: string
  formattedAddress: string
  addressComponents: AddressComponent[]
  geometry: PlaceGeometry
  displayName?: string
  types: string[]
  // Mantenemos compatibilidad con la API legacy
  place_id: string
  formatted_address: string
  address_components: AddressComponent[]
  name?: string
}

export interface PlacePrediction {
  placeId: string
  text: {
    text: string
    matches?: Array<{
      startOffset: number
      endOffset: number
    }>
  }
  structuredFormat?: {
    mainText?: {
      text: string
      matches?: Array<{
        startOffset: number
        endOffset: number
      }>
    }
    secondaryText?: {
      text: string
    }
  }
  types: string[]
  // Mantenemos compatibilidad con la API legacy
  place_id: string
  description: string
  matched_substrings: Array<{
    length: number
    offset: number
  }>
  structured_formatting: {
    main_text: string
    main_text_matched_substrings?: Array<{
      length: number
      offset: number
    }>
    secondary_text: string
  }
  terms: Array<{
    offset: number
    value: string
  }>
}

// Tipos para el componente AddressInput
export interface AddressInputProps {
  value?: string
  onChange?: (value: string) => void
  onAddressSelect?: (address: PlaceResult) => void
  placeholder?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
  debounceMs?: number
  countryRestriction?: string[]
  types?: string[]
  required?: boolean
  error?: string
}

// Estados del componente
export interface AddressInputState {
  isLoading: boolean
  predictions: PlacePrediction[]
  selectedPrediction: PlacePrediction | null
  isOpen: boolean
  error: string | null
}
