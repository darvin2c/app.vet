'use client'

import { useState } from 'react'
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  IsActiveField,
  IsActiveFormField,
  IsActiveDisplay,
  IsActiveFilter,
  IsActiveCompact,
  useIsActiveField,
} from '@/components/ui/is-active-field'

// Schema para el formulario de ejemplo
const demoSchema = z.object({
  is_active: z.boolean(),
  user_status: z.boolean(),
  feature_enabled: z.boolean(),
})

type DemoFormData = z.infer<typeof demoSchema>

export default function IsActiveFieldDemo() {
  // Estados para los ejemplos
  const [displayValue, setDisplayValue] = useState(true)
  const [compactValue, setCompactValue] = useState(false)
  const [filterValue, setFilterValue] = useState<'all' | 'active' | 'inactive'>(
    'all'
  )
  const [standaloneValue, setStandaloneValue] = useState(true)

  // Hook personalizado ejemplo
  const { isActive, toggle, activate, deactivate } = useIsActiveField(false)

  // Formulario de ejemplo
  const form = useForm<DemoFormData>({
    resolver: zodResolver(demoSchema),
    defaultValues: {
      is_active: true,
      user_status: false,
      feature_enabled: true,
    },
  })

  const onSubmit: SubmitHandler<DemoFormData> = (data) => {
    console.log('Form data:', data)
    alert(`Datos del formulario:\n${JSON.stringify(data, null, 2)}`)
  }

  // Datos simulados para la tabla
  const tableData = [
    { id: 1, name: 'Usuario 1', is_active: true },
    { id: 2, name: 'Usuario 2', is_active: false },
    { id: 3, name: 'Usuario 3', is_active: true },
    { id: 4, name: 'Usuario 4', is_active: false },
  ]

  // Filtrar datos según el filtro seleccionado
  const filteredData = tableData.filter((item) => {
    if (filterValue === 'all') return true
    if (filterValue === 'active') return item.is_active
    if (filterValue === 'inactive') return !item.is_active
    return true
  })

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">IsActiveField Component</h1>
        <p className="text-muted-foreground mt-2">
          Componente reutilizable para manejar estados de activación
        </p>
      </div>

      <div className="space-y-8">
        {/* Introducción */}
        <Card>
          <CardHeader>
            <CardTitle>Introducción</CardTitle>
            <CardDescription>
              El componente IsActiveField proporciona una interfaz consistente
              para manejar estados de activación en diferentes contextos:
              formularios, visualización, filtros y versión compacta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <Badge variant="outline" className="mb-2">
                  Form
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Para formularios con validación
                </p>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="mb-2">
                  Display
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Para mostrar estados
                </p>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="mb-2">
                  Filter
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Para filtrar listas
                </p>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="mb-2">
                  Compact
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Versión minimalista
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Variante Form */}
        <Card>
          <CardHeader>
            <CardTitle>Variante Form</CardTitle>
            <CardDescription>
              Integración completa con react-hook-form, incluyendo validación y
              manejo de errores.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <IsActiveFormField
                    name="is_active"
                    label="Estado del Usuario"
                    description="Determina si el usuario puede acceder al sistema"
                  />

                  <IsActiveFormField
                    name="user_status"
                    label="Estado Premium"
                    description="Usuario con suscripción premium activa"
                    activeText="Premium"
                    inactiveText="Básico"
                  />

                  <IsActiveFormField
                    name="feature_enabled"
                    label="Función Experimental"
                    description="Habilitar funciones en desarrollo"
                    size="lg"
                  />

                  <IsActiveFormField
                    name="is_active"
                    label="Sin Iconos"
                    description="Ejemplo sin iconos visuales"
                    showIcon={false}
                  />
                </div>

                <Separator />

                <div className="flex gap-4">
                  <Button type="submit">Enviar Formulario</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                  >
                    Resetear
                  </Button>
                </div>
              </form>
            </FormProvider>
          </CardContent>
        </Card>

        {/* Variante Display */}
        <Card>
          <CardHeader>
            <CardTitle>Variante Display</CardTitle>
            <CardDescription>
              Para mostrar estados de forma visual con badges y iconos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Estado actual:</span>
                <IsActiveDisplay value={displayValue} />
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Sin iconos:</span>
                <IsActiveDisplay value={displayValue} showIcon={false} />
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Textos personalizados:</span>
                <IsActiveDisplay
                  value={displayValue}
                  activeText="Habilitado"
                  inactiveText="Deshabilitado"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Tamaño pequeño:</span>
                <IsActiveDisplay value={displayValue} size="sm" />
              </div>

              <Button
                onClick={() => setDisplayValue(!displayValue)}
                variant="outline"
                size="sm"
              >
                Cambiar Estado
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Variante Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Variante Filter</CardTitle>
            <CardDescription>
              Para filtrar listas y tablas por estado de activación.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="max-w-xs">
                <IsActiveFilter
                  label="Filtrar por Estado"
                  filterValue={filterValue}
                  onFilterChange={setFilterValue}
                />
              </div>

              <div className="border rounded-lg">
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 font-medium">
                  <span>ID</span>
                  <span>Nombre</span>
                  <span>Estado</span>
                </div>
                {filteredData.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-3 gap-4 p-4 border-t"
                  >
                    <span>{item.id}</span>
                    <span>{item.name}</span>
                    <IsActiveDisplay value={item.is_active} />
                  </div>
                ))}
                {filteredData.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    No hay elementos que coincidan con el filtro seleccionado
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Variante Compact */}
        <Card>
          <CardHeader>
            <CardTitle>Variante Compact</CardTitle>
            <CardDescription>
              Versión minimalista para espacios reducidos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Compacto completo:</span>
                <IsActiveCompact
                  value={compactValue}
                  onChange={setCompactValue}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Solo switch:</span>
                <IsActiveCompact
                  value={compactValue}
                  onChange={setCompactValue}
                  showIcon={false}
                  showLabel={false}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Solo con etiqueta:</span>
                <IsActiveCompact
                  value={compactValue}
                  onChange={setCompactValue}
                  showIcon={false}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hook personalizado */}
        <Card>
          <CardHeader>
            <CardTitle>Hook useIsActiveField</CardTitle>
            <CardDescription>
              Hook personalizado para manejar el estado is_active con funciones
              de conveniencia.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Estado actual:</span>
                <IsActiveDisplay value={isActive} />
              </div>

              <div className="flex gap-2">
                <Button onClick={toggle} variant="outline" size="sm">
                  Toggle
                </Button>
                <Button onClick={activate} variant="outline" size="sm">
                  Activar
                </Button>
                <Button onClick={deactivate} variant="outline" size="sm">
                  Desactivar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Uso standalone */}
        <Card>
          <CardHeader>
            <CardTitle>Uso Standalone</CardTitle>
            <CardDescription>
              Uso del componente sin react-hook-form, controlado manualmente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <IsActiveField
                variant="form"
                label="Control Manual"
                description="Componente controlado sin formulario"
                value={standaloneValue}
                onChange={setStandaloneValue}
                showLabel={true}
              />

              <div className="text-sm text-muted-foreground">
                Valor actual: <code>{standaloneValue.toString()}</code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ejemplos de código */}
        <Card>
          <CardHeader>
            <CardTitle>Ejemplos de Código</CardTitle>
            <CardDescription>
              Ejemplos de implementación para cada variante.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">
                  Formulario con react-hook-form:
                </h4>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  {`<FormProvider {...form}>
  <IsActiveFormField
    name="is_active"
    label="Estado del Usuario"
    description="Determina si el usuario puede acceder"
  />
</FormProvider>`}
                </pre>
              </div>

              <div>
                <h4 className="font-medium mb-2">Visualización en tabla:</h4>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  {`<IsActiveDisplay 
  value={user.is_active}
  activeText="Habilitado"
  inactiveText="Deshabilitado"
/>`}
                </pre>
              </div>

              <div>
                <h4 className="font-medium mb-2">Filtro de lista:</h4>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  {`<IsActiveFilter
  label="Filtrar por Estado"
  filterValue={filterValue}
  onFilterChange={setFilterValue}
/>`}
                </pre>
              </div>

              <div>
                <h4 className="font-medium mb-2">Versión compacta:</h4>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  {`<IsActiveCompact 
  value={isActive}
  onChange={setIsActive}
/>`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
