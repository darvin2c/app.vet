'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { CurrencyInput } from '@/components/ui/currency-input'
import { TimezoneInput } from '@/components/ui/timezone-input'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

// Schema para el formulario de ejemplo
const FormSchema = z.object({
  currency: z.string().min(1, 'Selecciona una moneda'),
  timezone: z.string().min(1, 'Selecciona una zona horaria'),
})

type FormData = z.infer<typeof FormSchema>

export default function CurrencyTimezoneDemoPage() {
  // Estados para ejemplos básicos
  const [currency, setCurrency] = useState<string>('PEN')
  const [timezone, setTimezone] = useState<string>('America/Lima')

  // Estados para ejemplos sin símbolo
  const [currencyNoSymbol, setCurrencyNoSymbol] = useState<string>('')

  // Estados para ejemplos deshabilitados
  const [disabledCurrency] = useState<string>('USD')
  const [disabledTimezone] = useState<string>('America/New_York')

  // Formulario con react-hook-form
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      currency: '',
      timezone: '',
    },
  })

  const onSubmit = (data: FormData) => {
    console.log('Datos del formulario:', data)
    alert(
      `Formulario enviado:\nMoneda: ${data.currency}\nZona horaria: ${data.timezone}`
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Currency & Timezone Inputs</h1>
        <p className="text-muted-foreground">
          Componentes reutilizables para seleccionar moneda y zona horaria
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Ejemplo básico - Currency Input */}
        <Card>
          <CardHeader>
            <CardTitle>Currency Input - Básico</CardTitle>
            <CardDescription>
              Selector de moneda con símbolo y agrupación por región
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CurrencyInput
              value={currency}
              onChange={setCurrency}
              placeholder="Seleccionar moneda..."
            />
            <div className="text-sm text-muted-foreground">
              Valor seleccionado:{' '}
              <Badge variant="secondary">{currency || 'Ninguno'}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Ejemplo básico - Timezone Input */}
        <Card>
          <CardHeader>
            <CardTitle>Timezone Input - Básico</CardTitle>
            <CardDescription>
              Selector de zona horaria agrupado por región
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <TimezoneInput
              value={timezone}
              onChange={setTimezone}
              placeholder="Seleccionar zona horaria..."
            />
            <div className="text-sm text-muted-foreground">
              Valor seleccionado:{' '}
              <Badge variant="secondary">{timezone || 'Ninguno'}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Currency sin símbolo */}
        <Card>
          <CardHeader>
            <CardTitle>Currency Input - Sin Símbolo</CardTitle>
            <CardDescription>
              Selector de moneda sin mostrar símbolos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CurrencyInput
              value={currencyNoSymbol}
              onChange={setCurrencyNoSymbol}
              placeholder="Seleccionar moneda..."
              showSymbol={false}
            />
            <div className="text-sm text-muted-foreground">
              Valor seleccionado:{' '}
              <Badge variant="secondary">{currencyNoSymbol || 'Ninguno'}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Estados deshabilitados */}
        <Card>
          <CardHeader>
            <CardTitle>Estados Deshabilitados</CardTitle>
            <CardDescription>
              Componentes en estado deshabilitado con valores predefinidos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Moneda (deshabilitado)
              </label>
              <CurrencyInput
                value={disabledCurrency}
                disabled
                placeholder="Moneda deshabilitada"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Zona horaria (deshabilitado)
              </label>
              <TimezoneInput
                value={disabledTimezone}
                disabled
                placeholder="Zona horaria deshabilitada"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Ejemplo con formulario */}
      <Card>
        <CardHeader>
          <CardTitle>Integración con React Hook Form</CardTitle>
          <CardDescription>
            Ejemplo de uso con validación y manejo de formularios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Moneda *</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Seleccionar moneda..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zona Horaria *</FormLabel>
                      <FormControl>
                        <TimezoneInput
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Seleccionar zona horaria..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Enviar Formulario</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  Limpiar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Información técnica */}
      <Card>
        <CardHeader>
          <CardTitle>Información Técnica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2">CurrencyInput Props</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>
                  <code>value</code>: string - Código ISO de la moneda
                </li>
                <li>
                  <code>onChange</code>: (value: string) =&gt; void
                </li>
                <li>
                  <code>placeholder</code>: string - Texto placeholder
                </li>
                <li>
                  <code>disabled</code>: boolean - Estado deshabilitado
                </li>
                <li>
                  <code>showSymbol</code>: boolean - Mostrar símbolo
                </li>
                <li>
                  <code>className</code>: string - Clases CSS adicionales
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">TimezoneInput Props</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>
                  <code>value</code>: string - Zona horaria IANA
                </li>
                <li>
                  <code>onChange</code>: (value: string) =&gt; void
                </li>
                <li>
                  <code>placeholder</code>: string - Texto placeholder
                </li>
                <li>
                  <code>disabled</code>: boolean - Estado deshabilitado
                </li>
                <li>
                  <code>className</code>: string - Clases CSS adicionales
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
