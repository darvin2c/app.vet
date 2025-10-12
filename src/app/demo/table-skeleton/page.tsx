'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  TableSkeleton,
  CardSkeleton,
  TableSkeletonHeader,
  TableSkeletonRow,
} from '@/components/ui/table-skeleton'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default function TableSkeletonDemo() {
  const [variant, setVariant] = useState<'table' | 'cards' | 'list'>('table')
  const [rows, setRows] = useState(5)
  const [columns, setColumns] = useState(4)
  const [showHeader, setShowHeader] = useState(true)

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">TableSkeleton Demo</h1>
        <p className="text-muted-foreground">
          Componente skeleton reutilizable para tablas con soporte para vistas
          de lista y tarjetas.
        </p>
      </div>

      {/* Controles */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración</CardTitle>
          <CardDescription>
            Personaliza las propiedades del componente TableSkeleton
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Variante:</label>
              <div className="flex gap-2">
                <Button
                  variant={variant === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setVariant('table')}
                >
                  Tabla
                </Button>
                <Button
                  variant={variant === 'cards' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setVariant('cards')}
                >
                  Tarjetas
                </Button>
                <Button
                  variant={variant === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setVariant('list')}
                >
                  Lista
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {variant === 'table'
                  ? 'Filas:'
                  : variant === 'cards'
                    ? 'Tarjetas:'
                    : 'Elementos:'}
              </label>
              <div className="flex gap-2">
                {[3, 5, 8, 10].map((num) => (
                  <Button
                    key={num}
                    variant={rows === num ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setRows(num)}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>

            {variant === 'table' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Columnas:</label>
                  <div className="flex gap-2">
                    {[3, 4, 6, 8].map((num) => (
                      <Button
                        key={num}
                        variant={columns === num ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setColumns(num)}
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Header:</label>
                  <Button
                    variant={showHeader ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowHeader(!showHeader)}
                  >
                    {showHeader ? 'Mostrar' : 'Ocultar'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Ejemplo Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            TableSkeleton Principal
            <Badge variant="secondary">
              {variant} - {rows}{' '}
              {variant === 'table'
                ? 'filas'
                : variant === 'cards'
                  ? 'tarjetas'
                  : 'elementos'}
              {variant === 'table' && ` - ${columns} columnas`}
            </Badge>
          </CardTitle>
          <CardDescription>
            Componente principal con configuración personalizable
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TableSkeleton
            variant={variant}
            rows={rows}
            columns={columns}
            showHeader={showHeader}
          />
        </CardContent>
      </Card>

      <Separator />

      {/* Ejemplos de Componentes Auxiliares */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>CardSkeleton Individual</CardTitle>
            <CardDescription>
              Componente auxiliar para tarjetas individuales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CardSkeleton />
              <CardSkeleton className="bg-muted/30" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Componentes de Tabla</CardTitle>
            <CardDescription>
              Componentes auxiliares para construcción manual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full">
                <TableSkeletonHeader columns={4} />
                <tbody>
                  <TableSkeletonRow columns={4} />
                  <TableSkeletonRow columns={4} />
                  <TableSkeletonRow columns={4} />
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Casos de Uso */}
      <Card>
        <CardHeader>
          <CardTitle>Casos de Uso Comunes</CardTitle>
          <CardDescription>
            Ejemplos de implementación en diferentes escenarios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h4 className="font-medium">Lista de Pacientes (7 columnas)</h4>
            <TableSkeleton
              variant="table"
              rows={5}
              columns={7}
              showHeader={true}
            />
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">
              Lista de Procedimientos (9 columnas)
            </h4>
            <TableSkeleton
              variant="table"
              rows={3}
              columns={9}
              showHeader={true}
            />
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Vista de Tarjetas Responsiva</h4>
            <TableSkeleton variant="cards" rows={6} />
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Vista de Lista Vertical</h4>
            <TableSkeleton variant="list" rows={4} />
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Tabla Simple sin Header</h4>
            <TableSkeleton
              variant="table"
              rows={4}
              columns={3}
              showHeader={false}
            />
          </div>
        </CardContent>
      </Card>

      {/* Información Técnica */}
      <Card>
        <CardHeader>
          <CardTitle>Información Técnica</CardTitle>
          <CardDescription>
            Detalles de implementación y características
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h5 className="font-medium">Características:</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Soporte para vistas de tabla, tarjetas y lista</li>
                <li>• Completamente responsive</li>
                <li>• Atributos de accesibilidad incluidos</li>
                <li>• Animaciones fluidas con animate-pulse</li>
                <li>• Personalizable mediante props</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium">Props Principales:</h5>
              <ul className="space-y-1 text-muted-foreground font-mono text-xs">
                <li>• variant: 'table' | 'cards' | 'list'</li>
                <li>• rows: number (default: 5)</li>
                <li>• columns: number (default: 4)</li>
                <li>• showHeader: boolean (default: true)</li>
                <li>• className, cardClassName, tableClassName</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
