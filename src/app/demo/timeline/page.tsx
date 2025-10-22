'use client'

import { Timeline, type TimelineItemData } from '@/components/ui/timeline'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  User,
  Calendar,
  FileText,
  Heart,
  Stethoscope,
  Pill,
  Edit,
  Trash2,
  MoreHorizontal,
  Copy,
  Share,
  Download,
} from 'lucide-react'

export default function TimelineDemoPage() {
  // Demo data for medical records timeline with actions
  const medicalTimelineItems: TimelineItemData[] = [
    {
      id: '1',
      timestamp: new Date('2024-12-19T09:00:00'),
      title: 'Consulta General',
      description: 'Revisión médica de rutina',
      variant: 'success',
      icon: <Stethoscope className="h-4 w-4" />,
      actions: (
        <div className="flex gap-1">
          <Button size="sm" variant="outline">
            <Edit className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ),
      content: (
        <Card className="mt-2">
          <CardContent className="pt-4">
            <p className="text-sm">Paciente: Max (Golden Retriever)</p>
            <p className="text-sm text-muted-foreground">
              Peso: 28kg, Temperatura: 38.5°C
            </p>
          </CardContent>
        </Card>
      ),
    },
    {
      id: '2',
      timestamp: new Date('2024-12-19T10:30:00'),
      title: 'Vacunación',
      description: 'Aplicación de vacuna antirrábica',
      variant: 'primary',
      icon: <Heart className="h-4 w-4" />,
      actions: (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="h-4 w-4 mr-2" />
              Duplicar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share className="h-4 w-4 mr-2" />
              Compartir
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      content: (
        <div className="mt-2">
          <Badge variant="outline">Vacuna Antirrábica</Badge>
          <p className="text-sm text-muted-foreground mt-1">
            Próxima dosis: 19/12/2025
          </p>
        </div>
      ),
    },
    {
      id: '3',
      timestamp: new Date('2024-12-19T11:15:00'),
      title: 'Medicación',
      description: 'Prescripción de antibióticos',
      variant: 'warning',
      icon: <Pill className="h-4 w-4" />,
      actions: (
        <div className="flex gap-1">
          <Button size="sm" variant="outline">
            <Download className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline">
            <Edit className="h-3 w-3" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                Duplicar receta
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share className="h-4 w-4 mr-2" />
                Enviar por email
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Cancelar receta
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      content: (
        <div className="mt-2 space-y-1">
          <p className="text-sm font-medium">Amoxicilina 500mg</p>
          <p className="text-sm text-muted-foreground">
            Cada 8 horas por 7 días
          </p>
        </div>
      ),
    },
    {
      id: '4',
      timestamp: new Date('2024-12-19T14:00:00'),
      title: 'Seguimiento',
      description: 'Cita de control programada',
      variant: 'default',
      icon: <Calendar className="h-4 w-4" />,
      actions: (
        <Button size="sm" variant="default">
          <Calendar className="h-3 w-3 mr-1" />
          Reagendar
        </Button>
      ),
    },
  ]

  // Simple timeline items with different action types
  const simpleTimelineItems: TimelineItemData[] = [
    {
      id: '1',
      timestamp: new Date('2024-12-19T08:00:00'),
      title: 'Proyecto Iniciado',
      description: 'Se creó el repositorio y configuración inicial',
      variant: 'success',
      icon: <CheckCircle className="h-4 w-4" />,
      actions: (
        <Button size="sm" variant="secondary">
          Ver detalles
        </Button>
      ),
    },
    {
      id: '2',
      timestamp: new Date('2024-12-19T10:00:00'),
      title: 'Desarrollo en Progreso',
      description: 'Implementando componentes principales',
      variant: 'primary',
      icon: <Clock className="h-4 w-4" />,
      actions: (
        <div className="flex gap-1">
          <Button size="sm" variant="outline">
            Pausar
          </Button>
          <Button size="sm" variant="default">
            Continuar
          </Button>
        </div>
      ),
    },
    {
      id: '3',
      timestamp: new Date('2024-12-19T12:00:00'),
      title: 'Revisión Pendiente',
      description: 'Esperando aprobación del código',
      variant: 'warning',
      icon: <AlertTriangle className="h-4 w-4" />,
      actions: (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline">
              Acciones
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Aprobar</DropdownMenuItem>
            <DropdownMenuItem>Rechazar</DropdownMenuItem>
            <DropdownMenuItem>Solicitar cambios</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
    {
      id: '4',
      timestamp: new Date('2024-12-19T16:00:00'),
      title: 'Despliegue Fallido',
      description: 'Error en el proceso de deployment',
      variant: 'error',
      icon: <XCircle className="h-4 w-4" />,
      actions: (
        <Button size="sm" variant="destructive">
          Reintentar
        </Button>
      ),
    },
  ]

  // Process timeline items
  const processTimelineItems: TimelineItemData[] = [
    {
      id: '1',
      timestamp: new Date('2024-12-18T09:00:00'),
      title: 'Solicitud Recibida',
      description: 'Nueva solicitud de servicio',
      variant: 'default',
      icon: <FileText className="h-4 w-4" />,
    },
    {
      id: '2',
      timestamp: new Date('2024-12-18T11:00:00'),
      title: 'En Revisión',
      description: 'Evaluando requisitos',
      variant: 'primary',
      icon: <User className="h-4 w-4" />,
    },
    {
      id: '3',
      timestamp: new Date('2024-12-19T14:00:00'),
      title: 'Aprobado',
      description: 'Solicitud aprobada para procesamiento',
      variant: 'success',
      icon: <CheckCircle className="h-4 w-4" />,
    },
  ]

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Timeline Component Demo</h1>
        <p className="text-muted-foreground">
          Componente reutilizable para mostrar eventos cronológicos con
          diferentes variantes y personalizaciones.
        </p>
      </div>

      <Separator />

      {/* Timeline with Actions */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Timeline con Acciones</h2>
          <p className="text-muted-foreground">
            Timeline con botones de acción y dropdowns para interactuar con cada
            elemento. Incluye ejemplos de botones simples, dropdowns y acciones
            múltiples.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Historial Médico con Acciones - Max</CardTitle>
            <CardDescription>
              Eventos del día 19 de Diciembre, 2024 con opciones de acción
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Timeline
              items={medicalTimelineItems}
              orientation="vertical"
              size="md"
            />
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Horizontal Timeline with Actions */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">
            Timeline Horizontal con Acciones
          </h2>
          <p className="text-muted-foreground">
            Timeline horizontal con diferentes tipos de acciones: botones
            simples, múltiples botones y dropdowns.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Proceso de Desarrollo con Acciones</CardTitle>
            <CardDescription>
              Estados del proyecto durante el día con opciones de interacción
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Timeline
              items={simpleTimelineItems}
              orientation="horizontal"
              size="md"
            />
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Different Sizes */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Diferentes Tamaños</h2>
          <p className="text-muted-foreground">
            El componente soporta diferentes tamaños: small, medium y large.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Small Size */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tamaño Small</CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline
                items={processTimelineItems}
                orientation="vertical"
                size="sm"
              />
            </CardContent>
          </Card>

          {/* Large Size */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tamaño Large</CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline
                items={processTimelineItems}
                orientation="vertical"
                size="lg"
              />
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Without Connector */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Sin Línea Conectora</h2>
          <p className="text-muted-foreground">
            Timeline sin líneas conectoras para un diseño más limpio.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Estados Independientes</CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline
              items={simpleTimelineItems}
              orientation="vertical"
              size="md"
              showConnector={false}
            />
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Examples of Action Types */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Tipos de Acciones</h2>
          <p className="text-muted-foreground">
            Ejemplos de diferentes tipos de acciones que se pueden implementar
            en el timeline.
          </p>
        </div>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Botones Simples</CardTitle>
              <CardDescription>
                Un solo botón de acción por elemento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Timeline
                items={[
                  {
                    id: '1',
                    timestamp: new Date('2024-12-19T09:00:00'),
                    title: 'Tarea Completada',
                    description: 'Revisión finalizada',
                    variant: 'success',
                    icon: <CheckCircle className="h-4 w-4" />,
                    actions: (
                      <Button size="sm" variant="outline">
                        Ver reporte
                      </Button>
                    ),
                  },
                ]}
                orientation="vertical"
                size="md"
                showConnector={false}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Múltiples Botones</CardTitle>
              <CardDescription>
                Varios botones de acción agrupados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Timeline
                items={[
                  {
                    id: '1',
                    timestamp: new Date('2024-12-19T10:00:00'),
                    title: 'Documento Pendiente',
                    description: 'Requiere aprobación',
                    variant: 'warning',
                    icon: <FileText className="h-4 w-4" />,
                    actions: (
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="default">
                          Aprobar
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ),
                  },
                ]}
                orientation="vertical"
                size="md"
                showConnector={false}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dropdown Menu</CardTitle>
              <CardDescription>
                Menú desplegable con múltiples opciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Timeline
                items={[
                  {
                    id: '1',
                    timestamp: new Date('2024-12-19T11:00:00'),
                    title: 'Evento Programado',
                    description: 'Múltiples opciones disponibles',
                    variant: 'primary',
                    icon: <Calendar className="h-4 w-4" />,
                    actions: (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar evento
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share className="h-4 w-4 mr-2" />
                            Compartir
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Exportar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ),
                  },
                ]}
                orientation="vertical"
                size="md"
                showConnector={false}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Custom Date Format */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">
            Formato de Fecha Personalizado
          </h2>
          <p className="text-muted-foreground">
            Personalización del formato de fecha y hora mostrado.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Formato Personalizado</CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline
              items={medicalTimelineItems}
              orientation="vertical"
              size="md"
              dateFormat="EEEE, dd 'de' MMMM 'a las' HH:mm"
            />
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Responsive Demo */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Diseño Responsivo</h2>
          <p className="text-muted-foreground">
            El componente se adapta automáticamente a diferentes tamaños de
            pantalla.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Móvil/Tablet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-sm mx-auto">
                <Timeline
                  items={processTimelineItems}
                  orientation="vertical"
                  size="sm"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Desktop</CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline
                items={processTimelineItems}
                orientation="horizontal"
                size="md"
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
