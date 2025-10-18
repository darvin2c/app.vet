'use client'

import { useState } from 'react'
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
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
import { ArrowLeft, Eye, Code2, FileText } from 'lucide-react'
import { RichMinimalEditor } from '@/components/ui/rich-minimal-editor'
import { Field, FieldContent, FieldLabel, FieldError } from '@/components/ui/field'

// Schema para el formulario de ejemplo
const demoSchema = z.object({
  content: z.string().min(1, 'El contenido es requerido'),
  description: z.string().optional(),
})

type DemoFormData = z.infer<typeof demoSchema>

export default function RichMinimalEditorDemo() {
  const [basicValue, setBasicValue] = useState('')
  const [disabledValue, setDisabledValue] = useState('<p>Este contenido está deshabilitado</p>')
  const [formResult, setFormResult] = useState<DemoFormData | null>(null)

  // Configuración del formulario
  const form = useForm<DemoFormData>({
    resolver: zodResolver(demoSchema),
    defaultValues: {
      content: '',
      description: '',
    },
  })

  const onSubmit: SubmitHandler<DemoFormData> = (data) => {
    setFormResult(data)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/demo">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Demos
            </Link>
          </Button>
          <h1 className="text-3xl font-bold mb-2">Rich Minimal Editor</h1>
          <p className="text-muted-foreground">
            Editor de texto enriquecido minimalista con toolbar flotante que aparece solo al seleccionar texto
          </p>
        </div>

        {/* Demo Básico */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              <CardTitle>Demo Básico</CardTitle>
            </div>
            <CardDescription>
              Editor básico con todas las funcionalidades disponibles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Editor Básico:</label>
              <RichMinimalEditor
                value={basicValue}
                onChange={setBasicValue}
                placeholder="Escribe algo y selecciona texto para ver la toolbar..."
              />
            </div>
            
            {basicValue && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Contenido HTML:</label>
                <div className="p-3 bg-muted rounded-md">
                  <code className="text-sm">{basicValue}</code>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Demo con Estado Deshabilitado */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <CardTitle>Estado Deshabilitado</CardTitle>
            </div>
            <CardDescription>
              Editor en modo solo lectura
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Editor Deshabilitado:</label>
              <RichMinimalEditor
                value={disabledValue}
                onChange={setDisabledValue}
                disabled={true}
                placeholder="Este editor está deshabilitado"
              />
            </div>
          </CardContent>
        </Card>

        {/* Demo con React Hook Form */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              <CardTitle>Integración con React Hook Form</CardTitle>
            </div>
            <CardDescription>
              Uso del editor dentro de un formulario con validación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="content">Contenido Principal *</FieldLabel>
                  <FieldContent>
                    <RichMinimalEditor
                      value={form.watch('content')}
                      onChange={(value) => form.setValue('content', value)}
                      placeholder="Escribe el contenido principal..."
                    />
                    <FieldError errors={[form.formState.errors.content]} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel htmlFor="description">Descripción Adicional</FieldLabel>
                  <FieldContent>
                    <RichMinimalEditor
                      value={form.watch('description') || ''}
                      onChange={(value) => form.setValue('description', value)}
                      placeholder="Descripción opcional..."
                    />
                    <FieldError errors={[form.formState.errors.description]} />
                  </FieldContent>
                </Field>

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
            </FormProvider>

            {formResult && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Resultado del Formulario:</label>
                <div className="p-4 bg-muted rounded-md">
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(formResult, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Documentación */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>📋 Documentación</CardTitle>
            <CardDescription>
              Propiedades y características del componente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Props */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Props</h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                  <div>
                    <Badge variant="outline" className="mb-2">value</Badge>
                    <p className="text-sm text-muted-foreground">
                      Contenido HTML del editor
                    </p>
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-2">onChange</Badge>
                    <p className="text-sm text-muted-foreground">
                      Función que se ejecuta al cambiar el contenido
                    </p>
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-2">placeholder</Badge>
                    <p className="text-sm text-muted-foreground">
                      Texto de placeholder cuando está vacío
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                  <div>
                    <Badge variant="outline" className="mb-2">disabled</Badge>
                    <p className="text-sm text-muted-foreground">
                      Deshabilita la edición (modo solo lectura)
                    </p>
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-2">className</Badge>
                    <p className="text-sm text-muted-foreground">
                      Clases CSS adicionales para el contenedor
                    </p>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Características */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Características</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">🎯 Funcionalidades</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Toolbar flotante que aparece al seleccionar texto</li>
                    <li>• Formato de texto: negrita, cursiva, tachado</li>
                    <li>• Listas con viñetas y numeradas</li>
                    <li>• Enlaces con prompt para URL</li>
                    <li>• Deshacer y rehacer cambios</li>
                    <li>• Altura adaptativa del contenido</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">⚙️ Técnico</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Basado en Tiptap y ProseMirror</li>
                    <li>• Manejo completo de SSR sin errores</li>
                    <li>• Integración con react-hook-form</li>
                    <li>• Skeleton loading durante inicialización</li>
                    <li>• Estilos CSS optimizados para párrafos</li>
                    <li>• Posicionamiento inteligente de toolbar</li>
                  </ul>
                </div>
              </div>
            </div>

            <Separator />

            {/* Ejemplo de código */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Ejemplo de Uso</h3>
              <div className="p-4 bg-muted rounded-lg">
                <pre className="text-sm overflow-auto">
{`import { RichMinimalEditor } from '@/components/ui/rich-minimal-editor'

function MyComponent() {
  const [content, setContent] = useState('')

  return (
    <RichMinimalEditor
      value={content}
      onChange={setContent}
      placeholder="Escribe algo..."
      disabled={false}
    />
  )
}`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}