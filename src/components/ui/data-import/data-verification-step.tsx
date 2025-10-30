import { useState, useMemo } from 'react'
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Settings,
  Eye,
  EyeOff,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import type {
  DataVerificationStepProps,
  ValidationError,
} from '@/types/data-import.types'

export function DataVerificationStep<T = any>({
  data,
  validationResult,
  columnMapping,
  onColumnMap,
  onNext,
  onBack,
  isLoading = false,
}: DataVerificationStepProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)
  const [showOnlyErrors, setShowOnlyErrors] = useState(false)
  const [showColumnMapping, setShowColumnMapping] = useState(false)

  const itemsPerPage = 10

  // Filtrar datos según si mostrar solo errores
  const filteredData = useMemo(() => {
    if (!showOnlyErrors) return data.data

    const errorRows = new Set(
      validationResult.errors.map((error) => error.row - 1)
    )
    return data.data.filter((_, index) => errorRows.has(index))
  }, [data.data, validationResult.errors, showOnlyErrors])

  // Paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = filteredData.slice(startIndex, endIndex)

  // Obtener errores para una fila específica
  const getRowErrors = (rowIndex: number): ValidationError[] => {
    // Los errores se generan con índices basados en 1 (index + 1 en el validador)
    // Necesitamos encontrar el índice real de la fila en los datos originales
    const currentRow = currentData[rowIndex]
    const originalRowIndex = data.data.findIndex((row) => row === currentRow)
    const actualRowIndex = originalRowIndex + 1 // +1 porque los errores usan índices basados en 1

    return validationResult.errors.filter(
      (error) => error.row === actualRowIndex
    )
  }

  // Obtener error para una celda específica
  const getCellError = (
    rowIndex: number,
    columnName: string
  ): ValidationError | undefined => {
    const rowErrors = getRowErrors(rowIndex)
    return rowErrors.find((error) => error.column === columnName)
  }

  // Manejar cambio de mapeo de columna
  const handleColumnMappingChange = (
    csvColumn: string,
    entityField: string
  ) => {
    const newMapping = { ...columnMapping }
    if (entityField === '') {
      delete newMapping[csvColumn]
    } else {
      newMapping[csvColumn] = entityField
    }
    onColumnMap(newMapping)
  }

  // Obtener opciones de campos de entidad (simulado - en implementación real vendría del schema)
  const getEntityFields = () => {
    // En una implementación real, esto vendría del schema de validación
    return [
      'nombre',
      'email',
      'telefono',
      'direccion',
      'fecha_nacimiento',
      'activo',
    ]
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          Verificar Datos
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Revisa y corrige los datos antes de importar
        </p>
      </div>

      {/* Resumen de validación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {validationResult.isValid ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            Resumen de Validación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {validationResult.totalRows}
              </div>
              <div className="text-sm text-gray-600">Total de filas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {validationResult.validRows}
              </div>
              <div className="text-sm text-gray-600">Filas válidas</div>
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
        </CardContent>
      </Card>

      {/* Controles */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-errors"
              checked={showOnlyErrors}
              onCheckedChange={setShowOnlyErrors}
            />
            <Label htmlFor="show-errors" className="text-sm">
              Mostrar solo errores
            </Label>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowColumnMapping(!showColumnMapping)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Mapear Columnas
          </Button>
        </div>

        <div className="text-sm text-gray-600">
          Mostrando {startIndex + 1}-{Math.min(endIndex, filteredData.length)}{' '}
          de {filteredData.length} filas
        </div>
      </div>

      {/* Mapeo de columnas */}
      {showColumnMapping && (
        <Card>
          <CardHeader>
            <CardTitle>Mapeo de Columnas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.headers.map((header) => (
                <div key={header} className="flex items-center space-x-2">
                  <Label className="min-w-0 flex-1 text-sm font-medium">
                    {header}
                  </Label>
                  <Select
                    value={columnMapping[header] || '__unmapped__'}
                    onValueChange={(value) =>
                      handleColumnMappingChange(header, value === '__unmapped__' ? '' : value)
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Seleccionar campo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__unmapped__">Sin mapear</SelectItem>
                      {getEntityFields().map((field) => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabla de datos */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">#</TableHead>
                  {data.headers.map((header) => (
                    <TableHead key={header} className="min-w-32">
                      <div className="space-y-1">
                        <div>{header}</div>
                        {columnMapping[header] && (
                          <Badge variant="secondary" className="text-xs">
                            → {columnMapping[header]}
                          </Badge>
                        )}
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="w-16">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((row, index) => {
                  const rowErrors = getRowErrors(index)
                  const hasErrors = rowErrors.length > 0

                  return (
                    <TableRow
                      key={index}
                      className={hasErrors ? 'bg-red-50' : ''}
                    >
                      <TableCell className="font-medium">
                        {showOnlyErrors
                          ? data.data.findIndex((r) => r === row) + 1
                          : startIndex + index + 1}
                      </TableCell>
                      {data.headers.map((header) => {
                        const cellError = getCellError(index, header)
                        const value = (row as any)[header]

                        return (
                          <TableCell key={header} className={cellError ? 'bg-red-50 border-red-200' : ''}>
                            <div className="space-y-1">
                              <div className={cellError ? 'text-red-700 font-medium' : ''}>
                                {value?.toString() || '-'}
                              </div>
                              {cellError && (
                                <div className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                                  {cellError.message}
                                </div>
                              )}
                            </div>
                          </TableCell>
                        )
                      })}
                      <TableCell>
                        {hasErrors ? (
                          <XCircle className="w-4 h-4 text-red-600" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          <span className="text-sm text-gray-600">
            Página {currentPage} de {totalPages}
          </span>

          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
          >
            Siguiente
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Errores críticos */}
      {!validationResult.isValid && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Hay {validationResult.errors.length} errores que deben corregirse
            antes de continuar. Revisa los datos marcados en rojo y corrige los
            errores en tu archivo.
          </AlertDescription>
        </Alert>
      )}

      {/* Botones de navegación */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isLoading}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <Button
          onClick={onNext}
          disabled={!validationResult.isValid || isLoading}
        >
          Continuar
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
