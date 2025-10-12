'use client'

import { useState } from 'react'
import {
  Plus,
  Download,
  Settings,
  Filter,
  HelpCircle,
  Save,
  Upload,
  Trash2,
  Edit,
  Search,
  RefreshCw,
  Send,
} from 'lucide-react'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default function ResponsiveButtonDemo() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  )

  const toggleLoading = (id: string) => {
    setLoadingStates((prev) => ({ ...prev, [id]: !prev[id] }))
    // Simular operación async
    setTimeout(() => {
      setLoadingStates((prev) => ({ ...prev, [id]: false }))
    }, 2000)
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">ResponsiveButton</h1>
        <p className="text-muted-foreground">
          Componente genérico que se adapta automáticamente al dispositivo. En
          desktop muestra ícono + texto, en mobile solo ícono con tooltip.
        </p>
      </div>

      {/* Props Table */}
      <Card>
        <CardHeader>
          <CardTitle>Props</CardTitle>
          <CardDescription>
            Propiedades disponibles del componente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Prop</th>
                  <th className="text-left p-2">Tipo</th>
                  <th className="text-left p-2">Descripción</th>
                  <th className="text-left p-2">Requerido</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2 font-mono">icon</td>
                  <td className="p-2">LucideIcon</td>
                  <td className="p-2">Ícono a mostrar</td>
                  <td className="p-2">
                    <Badge variant="destructive">Sí</Badge>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-mono">text</td>
                  <td className="p-2">string</td>
                  <td className="p-2">Texto a mostrar en desktop</td>
                  <td className="p-2">
                    <Badge variant="destructive">Sí</Badge>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-mono">tooltip</td>
                  <td className="p-2">string</td>
                  <td className="p-2">Tooltip personalizado (opcional)</td>
                  <td className="p-2">
                    <Badge variant="secondary">No</Badge>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-mono">isLoading</td>
                  <td className="p-2">boolean</td>
                  <td className="p-2">Estado de carga con spinner</td>
                  <td className="p-2">
                    <Badge variant="secondary">No</Badge>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-mono">variant</td>
                  <td className="p-2">ButtonVariant</td>
                  <td className="p-2">Variante del botón</td>
                  <td className="p-2">
                    <Badge variant="secondary">No</Badge>
                  </td>
                </tr>
                <tr>
                  <td className="p-2 font-mono">...ButtonProps</td>
                  <td className="p-2">-</td>
                  <td className="p-2">Todas las props de Button</td>
                  <td className="p-2">
                    <Badge variant="secondary">No</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Ejemplos Básicos */}
      <Card>
        <CardHeader>
          <CardTitle>Ejemplos Básicos</CardTitle>
          <CardDescription>Diferentes variantes y tamaños</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Variantes</h3>
            <div className="flex flex-wrap gap-4">
              <ResponsiveButton
                icon={Plus}
                tooltip="Nuevo"
                onClick={() => console.log('Nuevo clicked')}
              >
                Nuevo
              </ResponsiveButton>
              <ResponsiveButton
                icon={Download}
                tooltip="Descargar"
                variant="secondary"
                onClick={() => console.log('Descargar clicked')}
              >
                Descargar
              </ResponsiveButton>
              <ResponsiveButton
                icon={Settings}
                tooltip="Configurar"
                variant="outline"
                onClick={() => console.log('Configurar clicked')}
              >
                Configurar
              </ResponsiveButton>
              <ResponsiveButton
                icon={HelpCircle}
                tooltip="Ayuda"
                variant="ghost"
                onClick={() => console.log('Ayuda clicked')}
              >
                Ayuda
              </ResponsiveButton>
              <ResponsiveButton
                icon={Trash2}
                tooltip="Eliminar"
                variant="destructive"
                onClick={() => console.log('Eliminar clicked')}
              >
                Eliminar
              </ResponsiveButton>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tamaños</h3>
            <div className="flex flex-wrap items-center gap-4">
              <ResponsiveButton
                icon={Save}
                tooltip="Pequeño"
                size="sm"
                onClick={() => console.log('Pequeño clicked')}
              >
                Pequeño
              </ResponsiveButton>
              <ResponsiveButton
                icon={Save}
                tooltip="Normal"
                onClick={() => console.log('Normal clicked')}
              >
                Normal
              </ResponsiveButton>
              <ResponsiveButton
                icon={Save}
                tooltip="Grande"
                size="lg"
                onClick={() => console.log('Grande clicked')}
              >
                Grande
              </ResponsiveButton>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estados */}
      <Card>
        <CardHeader>
          <CardTitle>Estados</CardTitle>
          <CardDescription>Diferentes estados del componente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Estados de Carga</h3>
            <div className="flex flex-wrap gap-4">
              <ResponsiveButton
                icon={Upload}
                tooltip="Subir Archivo"
                isLoading={loadingStates.upload}
                onClick={() => toggleLoading('upload')}
              >
                Subir Archivo
              </ResponsiveButton>
              <ResponsiveButton
                icon={Send}
                tooltip="Enviar Datos"
                variant="secondary"
                isLoading={loadingStates.send}
                onClick={() => toggleLoading('send')}
              >
                Enviar Datos
              </ResponsiveButton>
              <ResponsiveButton
                icon={RefreshCw}
                tooltip="Actualizar"
                variant="outline"
                isLoading={loadingStates.refresh}
                onClick={() => toggleLoading('refresh')}
              >
                Actualizar
              </ResponsiveButton>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Estados Deshabilitados</h3>
            <div className="flex flex-wrap gap-4">
              <ResponsiveButton
                icon={Edit}
                tooltip="Editar"
                disabled
                onClick={() => console.log('No debería ejecutarse')}
              >
                Editar
              </ResponsiveButton>
              <ResponsiveButton
                icon={Save}
                tooltip="Guardar"
                variant="secondary"
                disabled
                onClick={() => console.log('No debería ejecutarse')}
              >
                Guardar
              </ResponsiveButton>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contextos de Uso */}
      <Card>
        <CardHeader>
          <CardTitle>Contextos de Uso</CardTitle>
          <CardDescription>
            Ejemplos en diferentes contextos de la aplicación
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">En Header/Toolbar</h3>
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Panel de Control</h4>
                <div className="flex gap-2">
                  <ResponsiveButton
                    icon={Plus}
                    tooltip="Nuevo"
                    size="sm"
                    onClick={() => console.log('Nuevo desde header')}
                  >
                    Nuevo
                  </ResponsiveButton>
                  <ResponsiveButton
                    icon={Filter}
                    tooltip="Filtros"
                    variant="outline"
                    size="sm"
                    onClick={() => console.log('Filtros desde header')}
                  >
                    Filtros
                  </ResponsiveButton>
                  <ResponsiveButton
                    icon={Settings}
                    tooltip="Configurar"
                    variant="ghost"
                    size="sm"
                    onClick={() => console.log('Configurar desde header')}
                  >
                    Configurar
                  </ResponsiveButton>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">En Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Documento.pdf</CardTitle>
                  <CardDescription>Subido hace 2 horas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <ResponsiveButton
                      icon={Download}
                      tooltip="Descargar"
                      size="sm"
                      onClick={() => console.log('Descargar documento')}
                    >
                      Descargar
                    </ResponsiveButton>
                    <ResponsiveButton
                      icon={Trash2}
                      tooltip="Eliminar"
                      variant="destructive"
                      size="sm"
                      onClick={() => console.log('Eliminar documento')}
                    >
                      Eliminar
                    </ResponsiveButton>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Proyecto Alpha</CardTitle>
                  <CardDescription>En desarrollo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <ResponsiveButton
                      icon={Edit}
                      tooltip="Editar"
                      size="sm"
                      onClick={() => console.log('Editar proyecto')}
                    >
                      Editar
                    </ResponsiveButton>
                    <ResponsiveButton
                      icon={Settings}
                      tooltip="Configurar"
                      variant="outline"
                      size="sm"
                      onClick={() => console.log('Configurar proyecto')}
                    >
                      Configurar
                    </ResponsiveButton>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Con Tooltip Personalizado</h3>
            <div className="flex flex-wrap gap-4">
              <ResponsiveButton
                icon={Search}
                tooltip="Buscar en toda la base de datos"
                onClick={() => console.log('Buscar con tooltip personalizado')}
              >
                Buscar
              </ResponsiveButton>
              <ResponsiveButton
                icon={Download}
                tooltip="Exportar datos a Excel"
                variant="secondary"
                onClick={() =>
                  console.log('Exportar con tooltip personalizado')
                }
              >
                Exportar
              </ResponsiveButton>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Código de Ejemplo */}
      <Card>
        <CardHeader>
          <CardTitle>Código de Ejemplo</CardTitle>
          <CardDescription>Cómo usar el componente</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`import { ResponsiveButton } from '@/components/ui/responsive-button'
import { Plus, Download, Settings } from 'lucide-react'

// Uso básico
<ResponsiveButton
  icon={Plus}
  tooltip="Nuevo"
  onClick={() => console.log('Clicked')}
>
  Nuevo
</ResponsiveButton>

// Con estado de carga
<ResponsiveButton
  icon={Download}
  tooltip="Descargar"
  isLoading={isDownloading}
  onClick={handleDownload}
>
  Descargar
</ResponsiveButton>

// Con tooltip personalizado
<ResponsiveButton
  icon={Settings}
  tooltip="Abrir configuración avanzada"
  variant="outline"
  onClick={openSettings}
>
  Configurar
</ResponsiveButton>

// Deshabilitado
<ResponsiveButton
  icon={Plus}
  tooltip="Crear"
  disabled
  onClick={handleCreate}
>
  Crear
</ResponsiveButton>`}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
