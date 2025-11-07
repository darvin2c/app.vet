import { cn } from '@/lib/utils'
import { Skeleton } from './skeleton'
import { ViewMode } from './view-mode-toggle'

interface TableSkeletonProps {
  /**
   * Variante del skeleton - tabla, tarjetas o lista
   */
  variant?: ViewMode
  /**
   * Número de filas para tabla o tarjetas para grid
   */
  rows?: number
  /**
   * Número de columnas para vista de tabla
   */
  columns?: number
  /**
   * Mostrar header skeleton para tabla
   */
  showHeader?: boolean
  /**
   * Clases adicionales para el contenedor
   */
  className?: string
  /**
   * Clases para tarjetas individuales
   */
  cardClassName?: string
  /**
   * Clases para la tabla
   */
  tableClassName?: string
}

export function TableSkeleton({
  variant = 'table',
  rows = 5,
  columns = 4,
  showHeader = true,
  className,
  cardClassName,
  tableClassName,
}: TableSkeletonProps) {
  if (variant === 'list') {
    return (
      <div
        className={cn('space-y-3', className)}
        role="status"
        aria-label="Cargando lista"
      >
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 rounded-lg border bg-card p-4 hover:bg-muted/50 transition-colors"
          >
            {/* Avatar/Icono */}
            <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />

            {/* Contenido principal */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-3 w-32" />
            </div>

            {/* Acciones */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'cards') {
    return (
      <div
        className={cn(
          'grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
          className
        )}
        role="status"
        aria-label="Cargando contenido"
      >
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'rounded-lg border bg-card p-4 space-y-3',
              cardClassName
            )}
          >
            {/* Header de la tarjeta */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>

            {/* Contenido principal */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>

            {/* Footer de la tarjeta */}
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-6 w-20 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn('w-full', className)}
      role="status"
      aria-label="Cargando tabla"
    >
      <div className={cn('', tableClassName)}>
        <div className="overflow-hidden">
          <table className="w-full">
            {/* Header de la tabla */}
            {showHeader && (
              <thead className="bg-muted/50">
                <tr>
                  {Array.from({ length: columns }).map((_, index) => (
                    <th
                      key={index}
                      className="h-12 px-4 text-left align-middle font-medium"
                    >
                      <Skeleton className="h-4 w-full max-w-[120px]" />
                    </th>
                  ))}
                </tr>
              </thead>
            )}

            {/* Cuerpo de la tabla */}
            <tbody>
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="transition-colors hover:bg-muted/50"
                >
                  {Array.from({ length: columns }).map((_, colIndex) => (
                    <td key={colIndex} className="p-4 align-middle">
                      {colIndex === 0 ? (
                        // Primera columna - contenido principal
                        <div className="flex items-center space-x-3">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                      ) : colIndex === columns - 1 ? (
                        // Última columna - acciones
                        <div className="flex items-center justify-end space-x-2">
                          <Skeleton className="h-8 w-8 rounded-md" />
                          <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                      ) : (
                        // Columnas intermedias - contenido variable
                        <Skeleton
                          className={cn(
                            'h-4',
                            colIndex % 2 === 0 ? 'w-20' : 'w-16'
                          )}
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Componentes auxiliares para casos específicos
export function TableSkeletonHeader({ columns = 4 }: { columns?: number }) {
  return (
    <thead className="border-b bg-muted/50">
      <tr>
        {Array.from({ length: columns }).map((_, index) => (
          <th
            key={index}
            className="h-12 px-4 text-left align-middle font-medium"
          >
            <Skeleton className="h-4 w-full max-w-[120px]" />
          </th>
        ))}
      </tr>
    </thead>
  )
}

export function TableSkeletonRow({ columns = 4 }: { columns?: number }) {
  return (
    <tr className="border-b transition-colors hover:bg-muted/50">
      {Array.from({ length: columns }).map((_, colIndex) => (
        <td key={colIndex} className="p-4 align-middle">
          {colIndex === 0 ? (
            <div className="flex items-center space-x-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ) : colIndex === columns - 1 ? (
            <div className="flex items-center justify-end space-x-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          ) : (
            <Skeleton
              className={cn('h-4', colIndex % 2 === 0 ? 'w-20' : 'w-16')}
            />
          )}
        </td>
      ))}
    </tr>
  )
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-lg border bg-card p-4 space-y-3', className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-6 w-20 rounded-md" />
      </div>
    </div>
  )
}
