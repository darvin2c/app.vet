'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { Trash2, UserX, Building2, FileX, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

interface DemoState {
  isOpen: boolean
  title: string
  description: string
  confirmText: string
  isLoading: boolean
}

export default function AlertConfirmationDemo() {
  const [demoState, setDemoState] = React.useState<DemoState>({
    isOpen: false,
    title: '',
    description: '',
    confirmText: '',
    isLoading: false,
  })

  const openDemo = (config: Omit<DemoState, 'isOpen' | 'isLoading'>) => {
    setDemoState({
      ...config,
      isOpen: true,
      isLoading: false,
    })
  }

  const closeDemo = () => {
    setDemoState((prev) => ({ ...prev, isOpen: false }))
  }

  const handleConfirm = async () => {
    // Simular una operación asíncrona
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast.success('Acción confirmada exitosamente')
    console.log('Confirmación ejecutada:', demoState.title)
  }

  const demoVariants = [
    {
      id: 'delete-user',
      title: 'Eliminar Usuario',
      icon: <UserX className="h-5 w-5" />,
      config: {
        title: 'Eliminar Usuario',
        description:
          'Esta acción eliminará permanentemente el usuario y todos sus datos asociados. Esta acción no se puede deshacer.',
        confirmText: 'eliminar usuario',
      },
    },
    {
      id: 'delete-tenant',
      title: 'Eliminar Tenant',
      icon: <Building2 className="h-5 w-5" />,
      config: {
        title: 'Eliminar Organización',
        description:
          'Se eliminará permanentemente la organización y todos los datos, usuarios y configuraciones asociadas. Esta acción es irreversible.',
        confirmText: 'eliminar organización',
      },
    },
    {
      id: 'delete-file',
      title: 'Eliminar Archivo',
      icon: <FileX className="h-5 w-5" />,
      config: {
        title: 'Eliminar Archivo',
        description:
          'El archivo será eliminado permanentemente del sistema. No podrás recuperarlo después.',
        confirmText: 'confirmar',
      },
    },
    {
      id: 'dangerous-action',
      title: 'Acción Peligrosa',
      icon: <AlertTriangle className="h-5 w-5" />,
      config: {
        title: 'Ejecutar Acción Crítica',
        description:
          'Esta acción realizará cambios críticos en el sistema que pueden afectar a múltiples usuarios. Procede con extrema precaución.',
        confirmText: 'PELIGRO',
      },
    },
  ]

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Alert Confirmation</h1>
          <p className="text-muted-foreground">
            Componente reutilizable para confirmaciones de eliminación con
            validación de texto
          </p>
        </div>

        {/* Demo Variants */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Variantes de Demo</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {demoVariants.map((variant) => (
              <Card
                key={variant.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {variant.icon}
                    {variant.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => openDemo(variant.config)}
                    variant="destructive"
                    className="w-full"
                  >
                    Abrir Demo
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Documentation */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Uso del Componente</CardTitle>
              <CardDescription>
                Cómo implementar el AlertConfirmation en tu código
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto">
                  {`import { AlertConfirmation } from '@/components/ui/alert-confirmation'

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)
  
  const handleConfirm = async () => {
    // Tu lógica de confirmación aquí
    await deleteUser()
  }

  return (
    <AlertConfirmation
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onConfirm={handleConfirm}
      title="Eliminar Usuario"
      description="Esta acción no se puede deshacer."
      confirmText="eliminar usuario"
    />
  )
}`}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Props del Componente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Prop</th>
                      <th className="text-left p-2 font-medium">Tipo</th>
                      <th className="text-left p-2 font-medium">Requerido</th>
                      <th className="text-left p-2 font-medium">Descripción</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b">
                      <td className="p-2 font-mono">isOpen</td>
                      <td className="p-2">boolean</td>
                      <td className="p-2">✅</td>
                      <td className="p-2">Controla si el modal está abierto</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono">onClose</td>
                      <td className="p-2">() =&gt; void</td>
                      <td className="p-2">✅</td>
                      <td className="p-2">
                        Función llamada al cerrar el modal
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono">onConfirm</td>
                      <td className="p-2">
                        () =&gt; void | Promise&lt;void&gt;
                      </td>
                      <td className="p-2">✅</td>
                      <td className="p-2">
                        Función llamada al confirmar la acción
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono">title</td>
                      <td className="p-2">string</td>
                      <td className="p-2">✅</td>
                      <td className="p-2">Título del modal de confirmación</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono">description</td>
                      <td className="p-2">string</td>
                      <td className="p-2">✅</td>
                      <td className="p-2">
                        Descripción detallada de la acción
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono">confirmText</td>
                      <td className="p-2">string</td>
                      <td className="p-2">✅</td>
                      <td className="p-2">
                        Texto que el usuario debe escribir para confirmar
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono">isLoading</td>
                      <td className="p-2">boolean</td>
                      <td className="p-2">❌</td>
                      <td className="p-2">
                        Estado de carga externo (opcional)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Características</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Validación de texto de confirmación en tiempo real
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Estados de carga automáticos durante la confirmación
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Soporte para acciones síncronas y asíncronas
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Accesibilidad completa con navegación por teclado
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Diseño responsive y consistente con shadcn/ui
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Prevención de acciones accidentales
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Alert Confirmation Component */}
        <AlertConfirmation
          isOpen={demoState.isOpen}
          onClose={closeDemo}
          onConfirm={handleConfirm}
          title={demoState.title}
          description={demoState.description}
          confirmText={demoState.confirmText}
          isLoading={demoState.isLoading}
        />
      </div>
    </div>
  )
}
