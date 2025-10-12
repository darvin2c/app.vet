'use client'

import * as React from 'react'
import { MapPin, AlertCircle, CheckCircle2 } from 'lucide-react'
import PageBase from '@/components/page-base'
import { AddressInput } from '@/components/ui/address-input'
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldError,
} from '@/components/ui/field'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import type { PlaceResult } from '@/types/address.types'

export default function AddressInputDemoPage() {
  const [basicValue, setBasicValue] = React.useState('')
  const [validationValue, setValidationValue] = React.useState('')
  const [selectedAddress, setSelectedAddress] =
    React.useState<PlaceResult | null>(null)
  const [formData, setFormData] = React.useState({
    homeAddress: '',
    workAddress: '',
    billingAddress: '',
  })
  const [validationError, setValidationError] = React.useState('')

  // Manejar selección de dirección básica
  const handleBasicAddressSelect = (address: PlaceResult) => {
    console.log('Dirección seleccionada:', address)
    setSelectedAddress(address)
  }

  // Manejar validación
  const handleValidationChange = (value: string) => {
    setValidationValue(value)
    if (value.length > 0 && value.length < 10) {
      setValidationError('La dirección debe tener al menos 10 caracteres')
    } else {
      setValidationError('')
    }
  }

  // Manejar formulario múltiple
  const handleFormAddressSelect = (field: string) => (address: PlaceResult) => {
    setFormData((prev) => ({
      ...prev,
      [field]: address.formatted_address,
    }))
  }

  return (
    <PageBase
      title="AddressInput Component"
      subtitle="Componente de entrada de direcciones con autocompletado de Google Maps"
      actions={<></>}
      search={<></>}
    >
      <div className="space-y-8">
        {/* Configuración de API */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Configuración requerida:</strong> Para usar este componente
            en producción, necesitas configurar la variable de entorno{' '}
            <code className="bg-muted px-1 py-0.5 rounded text-sm">
              NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
            </code>{' '}
            con tu clave de Google Maps Places API. Actualmente se muestran
            datos de ejemplo.
          </AlertDescription>
        </Alert>

        {/* Ejemplo Básico */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Ejemplo Básico
            </CardTitle>
            <CardDescription>
              Uso básico del componente AddressInput con autocompletado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <Field>
                <FieldLabel>Dirección</FieldLabel>
                <FieldContent>
                  <AddressInput
                    value={basicValue}
                    onChange={setBasicValue}
                    onAddressSelect={handleBasicAddressSelect}
                    placeholder="Buscar dirección..."
                  />
                </FieldContent>
              </Field>

              {selectedAddress && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Dirección Seleccionada
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Dirección:</strong>{' '}
                      {selectedAddress.formatted_address}
                    </div>
                    <div>
                      <strong>Place ID:</strong> {selectedAddress.place_id}
                    </div>
                    <div>
                      <strong>Coordenadas:</strong>{' '}
                      {selectedAddress.geometry.location.lat},{' '}
                      {selectedAddress.geometry.location.lng}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <strong>Tipos:</strong>
                      {selectedAddress.types.map((type) => (
                        <Badge
                          key={type}
                          variant="secondary"
                          className="text-xs"
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Diferentes Tamaños */}
        <Card>
          <CardHeader>
            <CardTitle>Tamaños Disponibles</CardTitle>
            <CardDescription>
              El componente soporta diferentes tamaños: sm, md (default), lg
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <Field>
                <FieldLabel>Tamaño Pequeño (sm)</FieldLabel>
                <FieldContent>
                  <AddressInput size="sm" placeholder="Dirección pequeña..." />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Tamaño Mediano (md) - Default</FieldLabel>
                <FieldContent>
                  <AddressInput placeholder="Dirección mediana..." />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Tamaño Grande (lg)</FieldLabel>
                <FieldContent>
                  <AddressInput size="lg" placeholder="Dirección grande..." />
                </FieldContent>
              </Field>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Con Validación */}
        <Card>
          <CardHeader>
            <CardTitle>Con Validación</CardTitle>
            <CardDescription>
              Ejemplo con validación de errores y estados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <Field>
                <FieldLabel>
                  Dirección con Validación
                  <span className="text-destructive ml-1">*</span>
                </FieldLabel>
                <FieldContent>
                  <AddressInput
                    value={validationValue}
                    onChange={handleValidationChange}
                    placeholder="Ingresa una dirección válida..."
                    required
                    error={validationError}
                  />
                  {validationError && (
                    <FieldError>{validationError}</FieldError>
                  )}
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Campo Deshabilitado</FieldLabel>
                <FieldContent>
                  <AddressInput
                    disabled
                    value="Av. Javier Prado Este 4200, San Borja, Lima"
                    placeholder="Campo deshabilitado..."
                  />
                </FieldContent>
              </Field>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Formulario Múltiple */}
        <Card>
          <CardHeader>
            <CardTitle>Formulario con Múltiples Direcciones</CardTitle>
            <CardDescription>
              Ejemplo de uso en un formulario con múltiples campos de dirección
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-6">
              <Field>
                <FieldLabel>Dirección de Casa</FieldLabel>
                <FieldContent>
                  <AddressInput
                    value={formData.homeAddress}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, homeAddress: value }))
                    }
                    onAddressSelect={handleFormAddressSelect('homeAddress')}
                    placeholder="Ingresa tu dirección de casa..."
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Dirección de Trabajo</FieldLabel>
                <FieldContent>
                  <AddressInput
                    value={formData.workAddress}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, workAddress: value }))
                    }
                    onAddressSelect={handleFormAddressSelect('workAddress')}
                    placeholder="Ingresa tu dirección de trabajo..."
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Dirección de Facturación</FieldLabel>
                <FieldContent>
                  <AddressInput
                    value={formData.billingAddress}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        billingAddress: value,
                      }))
                    }
                    onAddressSelect={handleFormAddressSelect('billingAddress')}
                    placeholder="Ingresa tu dirección de facturación..."
                  />
                </FieldContent>
              </Field>

              {(formData.homeAddress ||
                formData.workAddress ||
                formData.billingAddress) && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Datos del Formulario</h4>
                  <div className="space-y-1 text-sm">
                    {formData.homeAddress && (
                      <div>
                        <strong>Casa:</strong> {formData.homeAddress}
                      </div>
                    )}
                    {formData.workAddress && (
                      <div>
                        <strong>Trabajo:</strong> {formData.workAddress}
                      </div>
                    )}
                    {formData.billingAddress && (
                      <div>
                        <strong>Facturación:</strong> {formData.billingAddress}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Configuración Avanzada */}
        <Card>
          <CardHeader>
            <CardTitle>Configuración Avanzada</CardTitle>
            <CardDescription>
              Ejemplos con configuraciones personalizadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <Field>
                <FieldLabel>Búsqueda Rápida (debounce 100ms)</FieldLabel>
                <FieldContent>
                  <AddressInput
                    debounceMs={100}
                    placeholder="Búsqueda más rápida..."
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Búsqueda Lenta (debounce 1000ms)</FieldLabel>
                <FieldContent>
                  <AddressInput
                    debounceMs={1000}
                    placeholder="Búsqueda más lenta..."
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Con Clase Personalizada</FieldLabel>
                <FieldContent>
                  <AddressInput
                    className="border-2 border-blue-200 focus-within:border-blue-500"
                    placeholder="Estilo personalizado..."
                  />
                </FieldContent>
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* Información Técnica */}
        <Card>
          <CardHeader>
            <CardTitle>Información Técnica</CardTitle>
            <CardDescription>
              Detalles de implementación y configuración
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Props Principales:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>
                    <code>value</code>: Valor actual del input
                  </li>
                  <li>
                    <code>onChange</code>: Callback cuando cambia el valor
                  </li>
                  <li>
                    <code>onAddressSelect</code>: Callback cuando se selecciona
                    una dirección
                  </li>
                  <li>
                    <code>placeholder</code>: Texto de placeholder
                  </li>
                  <li>
                    <code>disabled</code>: Deshabilitar el componente
                  </li>
                  <li>
                    <code>size</code>: Tamaño del componente (sm, md, lg)
                  </li>
                  <li>
                    <code>debounceMs</code>: Tiempo de debounce para búsquedas
                  </li>
                  <li>
                    <code>required</code>: Campo requerido
                  </li>
                  <li>
                    <code>error</code>: Mensaje de error
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Características:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Autocompletado con Google Maps Places API</li>
                  <li>Debounce configurable para optimizar consultas</li>
                  <li>Estados de loading y error</li>
                  <li>Integración con sistema Field para validación</li>
                  <li>Responsive design y accesibilidad</li>
                  <li>Botón de limpiar integrado</li>
                  <li>Soporte para TypeScript</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">
                  Configuración de Producción:
                </h4>
                <div className="bg-muted p-3 rounded-md">
                  <code className="text-xs">
                    # .env.local
                    <br />
                    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
                  </code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageBase>
  )
}
