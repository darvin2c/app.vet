import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  Download,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import type { ImportConfirmationStepProps } from '@/types/data-import.types'

export function ImportConfirmationStep({
  data,
  validationResult,
  onImport,
  onBack,
  isImporting = false,
  progress = 0,
  result,
}: ImportConfirmationStepProps) {
  const validRowsCount = data.length - validationResult.errors.length
  const hasErrors = validationResult.errors.length > 0
  const hasWarnings = validationResult.warnings.length > 0

  // Si ya hay resultado, mostrar pantalla de resultado
  if (result) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 mb-4">
            {result.success ? (
              <CheckCircle className="w-16 h-16 text-green-600" />
            ) : (
              <XCircle className="w-16 h-16 text-red-600" />
            )}
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">
            {result.success ? 'Importación Completada' : 'Importación Fallida'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {result.success
              ? 'Los datos se han importado correctamente'
              : 'Ocurrieron errores durante la importación'}
          </p>
        </div>

        <div className="border rounded-lg bg-white shadow-sm">
          <div className="p-6 pb-0">
            <h3 className="text-lg font-semibold">Resumen de Importación</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {result.imported}
                </div>
                <div className="text-sm text-gray-600">
                  Registros importados
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {result.failed}
                </div>
                <div className="text-sm text-gray-600">Registros fallidos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {Math.round(result.duration / 1000)}s
                </div>
                <div className="text-sm text-gray-600">Duración</div>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Errores de Importación:
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {result.errors.slice(0, 10).map((error, index) => (
                    <div
                      key={index}
                      className="text-sm text-red-600 bg-red-50 p-2 rounded"
                    >
                      <span className="font-medium">Fila {error.row}:</span>{' '}
                      {error.message}
                    </div>
                  ))}
                  {result.errors.length > 10 && (
                    <div className="text-sm text-gray-600 text-center">
                      ... y {result.errors.length - 10} errores más
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Nueva Importación
          </Button>
        </div>
      </div>
    )
  }

  // Pantalla de confirmación/progreso
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          {isImporting ? 'Importando Datos' : 'Confirmar Importación'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {isImporting
            ? 'Por favor espera mientras se procesan los datos'
            : 'Revisa el resumen antes de proceder con la importación'}
        </p>
      </div>

      {/* Progreso de importación */}
      {isImporting && (
        <div className="border rounded-lg bg-white shadow-sm">
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Progreso de importación
                </span>
                <span className="text-sm text-gray-600">{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              <div className="text-center text-sm text-gray-600">
                Procesando registros...
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resumen de datos a importar */}
      <div className="border rounded-lg bg-white shadow-sm">
        <div className="p-6 pb-0">
          <h3 className="text-lg font-semibold">Resumen de Importación</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {data.length}
              </div>
              <div className="text-sm text-gray-600">Total de registros</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {validRowsCount}
              </div>
              <div className="text-sm text-gray-600">Registros válidos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {validationResult.errors.length}
              </div>
              <div className="text-sm text-gray-600">Errores</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {validationResult.warnings.length}
              </div>
              <div className="text-sm text-gray-600">Advertencias</div>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas de validación */}
      {hasErrors && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p>
                Se encontraron {validationResult.errors.length} errores. Solo se
                importarán los registros válidos ({validRowsCount} registros).
              </p>
              <div className="space-y-1">
                {validationResult.errors.slice(0, 3).map((error, index) => (
                  <div key={index} className="text-xs">
                    • Fila {error.row}, columna {error.column}: {error.message}
                  </div>
                ))}
                {validationResult.errors.length > 3 && (
                  <div className="text-xs">
                    ... y {validationResult.errors.length - 3} errores más
                  </div>
                )}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {hasWarnings && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p>
                Se encontraron {validationResult.warnings.length} advertencias.
                Los datos se importarán pero revisa estos elementos:
              </p>
              <div className="space-y-1">
                {validationResult.warnings.slice(0, 3).map((warning, index) => (
                  <div key={index} className="text-xs">
                    • Fila {warning.row}, columna {warning.column}:{' '}
                    {warning.message}
                  </div>
                ))}
                {validationResult.warnings.length > 3 && (
                  <div className="text-xs">
                    ... y {validationResult.warnings.length - 3} advertencias
                    más
                  </div>
                )}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Información adicional */}
      <div className="border rounded-lg bg-white shadow-sm">
        <div className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              ¿Qué sucederá durante la importación?
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Se procesarán {validRowsCount} registros válidos
              </li>
              {hasErrors && (
                <li className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  Se omitirán {validationResult.errors.length} registros con
                  errores
                </li>
              )}
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Los datos se validarán nuevamente antes de guardar
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Recibirás un reporte detallado del proceso
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isImporting}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <Button
          onClick={onImport}
          disabled={isImporting || validRowsCount === 0}
          className="min-w-32"
        >
          {isImporting ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Importando...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Importar {validRowsCount} Registros
            </>
          )}
        </Button>
      </div>

      {/* Nota sobre el proceso */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          La importación puede tomar varios minutos dependiendo del tamaño de
          los datos. No cierres esta ventana durante el proceso.
        </p>
      </div>
    </div>
  )
}
