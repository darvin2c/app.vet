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
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import {
  PhoneInput,
  PhoneDisplay,
  PhoneField,
  PhoneCompactField,
  phoneUtils,
} from '@/components/ui/phone-input'

// Schema para el formulario de ejemplo
const demoSchema = z.object({
  primary_phone: z.string().min(1, 'Teléfono principal es requerido'),
  secondary_phone: z.string().optional(),
  emergency_contact: z.string().min(1, 'Contacto de emergencia es requerido'),
  work_phone: z.string().optional(),
})

type DemoFormData = z.infer<typeof demoSchema>

export default function PhoneInputDemo() {
  // Estados para los ejemplos
  const [standaloneValue, setStandaloneValue] = useState('')
  const [compactValue, setCompactValue] = useState('+51993029296')
  const [displayValue] = useState('+51993029296')

  // Formulario de ejemplo
  const form = useForm<DemoFormData>({
    resolver: zodResolver(demoSchema),
    defaultValues: {
      primary_phone: '',
      secondary_phone: '',
      emergency_contact: '',
      work_phone: '',
    },
  })

  const onSubmit: SubmitHandler<DemoFormData> = (data) => {
    console.log('Form data:', data)
    alert(`Datos del formulario:\n${JSON.stringify(data, null, 2)}`)
  }

  // Datos simulados para la tabla
  const contactsData = [
    { id: 1, name: 'Juan Pérez', phone: '+51993029296', country: 'PE' },
    { id: 2, name: 'María García', phone: '+1234567890', country: 'US' },
    { id: 3, name: 'Carlos López', phone: '+525551234567', country: 'MX' },
    { id: 4, name: 'Ana Rodríguez', phone: '+541123456789', country: 'AR' },
  ]

  // Ejemplos de utilidades
  const utilityExamples = [
    {
      input: '+51993029296',
      formatted: phoneUtils.format('+51993029296'),
      valid: phoneUtils.validate('+51993029296'),
    },
    {
      input: '993029296',
      formatted: phoneUtils.format('993029296', 'PE'),
      valid: phoneUtils.validate('993029296', 'PE'),
    },
    {
      input: '+1234567890',
      formatted: phoneUtils.format('+1234567890'),
      valid: phoneUtils.validate('+1234567890'),
    },
    {
      input: 'invalid',
      formatted: phoneUtils.format('invalid'),
      valid: phoneUtils.validate('invalid'),
    },
  ]

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">PhoneInput Component</h1>
        <p className="text-muted-foreground mt-2">
          Componente reutilizable para entrada y validación de números
          telefónicos internacionales
        </p>
      </div>

      <div className="space-y-8">
        {/* Introducción */}
        <Card>
          <CardHeader>
            <CardTitle>Introducción</CardTitle>
            <CardDescription>
              El componente PhoneInput proporciona validación automática,
              formateo en tiempo real, selector de país con banderas y soporte
              para múltiples variantes de uso.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="text-center">
                <Badge variant="outline" className="mb-2">
                  Form
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Para formularios con validación completa
                </p>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="mb-2">
                  Display
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Para mostrar números formateados
                </p>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="mb-2">
                  Compact
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Versión minimalista con ícono
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
              Integración completa con react-hook-form, validación automática y
              selector de país.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="primary_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono Principal *</FormLabel>
                        <FormControl>
                          <PhoneInput
                            {...field}
                            placeholder="Ingrese su número principal"
                            defaultCountry="PE"
                          />
                        </FormControl>
                        <FormDescription>
                          Número principal de contacto con código de país
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="secondary_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono Secundario</FormLabel>
                        <FormControl>
                          <PhoneInput
                            {...field}
                            placeholder="Teléfono alternativo (opcional)"
                            defaultCountry="PE"
                          />
                        </FormControl>
                        <FormDescription>
                          Número alternativo de contacto
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="emergency_contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contacto de Emergencia *</FormLabel>
                        <FormControl>
                          <PhoneInput
                            {...field}
                            placeholder="Número de emergencia"
                            defaultCountry="PE"
                          />
                        </FormControl>
                        <FormDescription>
                          Contacto en caso de emergencias
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="work_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono de Trabajo</FormLabel>
                        <FormControl>
                          <PhoneInput
                            {...field}
                            placeholder="Teléfono laboral"
                            defaultCountry="PE"
                            showCountrySelect={false}
                          />
                        </FormControl>
                        <FormDescription>
                          Sin selector de país (solo Perú)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
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

        {/* Nuevo: PhoneField Component */}
        <Card>
          <CardHeader>
            <CardTitle>PhoneField - Componente Wrapper</CardTitle>
            <CardDescription>
              Nuevo componente PhoneField que incluye automáticamente FormField,
              FormLabel, FormControl y FormMessage.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormProvider {...form}>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PhoneField
                    name="primary_phone"
                    label="Teléfono Principal"
                    description="Usando PhoneField wrapper"
                    placeholder="Ingrese teléfono principal"
                    required
                    defaultCountry="PE"
                  />

                  <PhoneCompactField
                    name="secondary_phone"
                    label="Teléfono Secundario (Compacto)"
                    placeholder="Teléfono opcional"
                    defaultCountry="PE"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PhoneField
                    name="emergency_contact"
                    label="Contacto de Emergencia"
                    description="Número para casos de emergencia"
                    placeholder="Número de emergencia"
                    required
                    defaultCountry="PE"
                  />

                  <PhoneField
                    name="work_phone"
                    label="Teléfono del Trabajo"
                    placeholder="Teléfono laboral"
                    defaultCountry="PE"
                    variant="compact"
                  />
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Ventajas del PhoneField:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>
                      • Incluye automáticamente FormField, FormLabel,
                      FormControl, FormMessage
                    </li>
                    <li>• Manejo automático de errores y validación</li>
                    <li>
                      • Props simplificadas (label, description, required, etc.)
                    </li>
                    <li>• Compatible con useFormContext de react-hook-form</li>
                    <li>• Menos código repetitivo en formularios</li>
                  </ul>
                </div>
              </form>
            </FormProvider>
          </CardContent>
        </Card>

        {/* Variante Standalone */}
        <Card>
          <CardHeader>
            <CardTitle>Uso Independiente</CardTitle>
            <CardDescription>
              PhoneInput como componente independiente con diferentes
              configuraciones.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Teléfono con País por Defecto (Perú)
                </label>
                <PhoneInput
                  value={standaloneValue}
                  onChange={setStandaloneValue}
                  placeholder="Ingrese número telefónico"
                  defaultCountry="PE"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Valor actual: {standaloneValue || 'Vacío'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Teléfono Estados Unidos
                </label>
                <PhoneInput
                  placeholder="Enter US phone number"
                  defaultCountry="US"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Teléfono México
                </label>
                <PhoneInput
                  placeholder="Ingrese número mexicano"
                  defaultCountry="MX"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Sin Selector de País
                </label>
                <PhoneInput
                  placeholder="Solo número local"
                  defaultCountry="PE"
                  showCountrySelect={false}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Variante Compact */}
        <Card>
          <CardHeader>
            <CardTitle>Variante Compact</CardTitle>
            <CardDescription>
              Versión minimalista con ícono de teléfono para espacios reducidos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium min-w-[120px]">
                  Teléfono rápido:
                </span>
                <PhoneInput
                  variant="compact"
                  value={compactValue}
                  onChange={setCompactValue}
                  placeholder="Número"
                  defaultCountry="PE"
                />
              </div>

              <div className="flex items-center gap-4">
                <span className="font-medium min-w-[120px]">Solo entrada:</span>
                <PhoneInput
                  variant="compact"
                  placeholder="Ingrese teléfono"
                  defaultCountry="US"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Variante Display */}
        <Card>
          <CardHeader>
            <CardTitle>Variante Display</CardTitle>
            <CardDescription>
              Para mostrar números telefónicos formateados de solo lectura.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Teléfono formateado:</span>
                <PhoneDisplay value={displayValue} />
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Sin ícono:</span>
                <PhoneDisplay value={displayValue} showIcon={false} />
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Versión compacta:</span>
                <PhoneDisplay value={displayValue} variant="compact" />
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Número inválido:</span>
                <PhoneDisplay value="123invalid" />
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Sin valor:</span>
                <PhoneDisplay value="" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Contactos */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Contactos</CardTitle>
            <CardDescription>
              Ejemplo de uso en tablas y listas de datos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contactsData.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ID: {contact.id}
                    </p>
                  </div>
                  <PhoneDisplay value={contact.phone} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Utilidades */}
        <Card>
          <CardHeader>
            <CardTitle>Utilidades phoneUtils</CardTitle>
            <CardDescription>
              Funciones auxiliares para formateo, validación y parsing de
              números telefónicos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="font-medium">Entrada</div>
                <div className="font-medium">Formateado</div>
                <div className="font-medium">Válido</div>
              </div>

              <Separator />

              {utilityExamples.map((example, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm"
                >
                  <div className="font-mono bg-muted p-2 rounded">
                    {example.input}
                  </div>
                  <div className="font-mono bg-muted p-2 rounded">
                    {example.formatted}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={example.valid ? 'default' : 'destructive'}>
                      {example.valid ? 'Válido' : 'Inválido'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Código de Ejemplo */}
        <Card>
          <CardHeader>
            <CardTitle>Código de Ejemplo</CardTitle>
            <CardDescription>
              Ejemplos de implementación para diferentes casos de uso.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Uso Básico</h4>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  {`import { PhoneInput } from '@/components/ui/phone-input'

<PhoneInput
  value={phone}
  onChange={setPhone}
  placeholder="Ingrese teléfono"
  defaultCountry="PE"
/>`}
                </pre>
              </div>

              <div>
                <h4 className="font-medium mb-2">
                  Con React Hook Form (Tradicional)
                </h4>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  {`<FormField
  control={form.control}
  name="phone"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Teléfono</FormLabel>
      <FormControl>
        <PhoneInput
          {...field}
          placeholder="Número telefónico"
          defaultCountry="PE"
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>`}
                </pre>
              </div>

              <div>
                <h4 className="font-medium mb-2">
                  Con PhoneField (Nuevo - Simplificado)
                </h4>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  {`import { PhoneField } from '@/components/ui/phone-input'

<PhoneField
  name="phone"
  label="Teléfono"
  description="Ingrese su número telefónico"
  placeholder="Número telefónico"
  required
  defaultCountry="PE"
/>

// O usar la variante compacta
<PhoneCompactField
  name="phone"
  label="Teléfono"
  defaultCountry="PE"
/>`}
                </pre>
              </div>

              <div>
                <h4 className="font-medium mb-2">Mostrar Teléfono</h4>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  {`import { PhoneDisplay } from '@/components/ui/phone-input'

<PhoneDisplay value="+51993029296" />
<PhoneDisplay value="+51993029296" variant="compact" />
<PhoneDisplay value="+51993029296" showIcon={false} />`}
                </pre>
              </div>

              <div>
                <h4 className="font-medium mb-2">Utilidades</h4>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  {`import { phoneUtils } from '@/components/ui/phone-input'

// Formatear número
const formatted = phoneUtils.format('+51993029296')

// Validar número
const isValid = phoneUtils.validate('+51993029296')

// Parsear número
const parsed = phoneUtils.parse('+51993029296')`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
