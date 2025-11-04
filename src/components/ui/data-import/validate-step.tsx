import { useMemo, useState } from 'react'
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ValidationResult, ParsedRow } from '@/types/data-import.types'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Alert } from '../alert'
import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { ScrollArea } from '../scroll-area'

interface ValidateStepProps {
  validationResult: ValidationResult
  onConfirm: () => void
  onBack: () => void
}

export function ValidateStep({
  validationResult,
  onConfirm,
  onBack,
}: ValidateStepProps) {
  const {
    validRows,
    invalidRows,
    totalRows,
    validCount,
    invalidCount,
    columnErrors,
  } = validationResult

  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleConfirm = () => {
    setShowConfirmation(true)
  }

  const handleConfirmImport = () => {
    setShowConfirmation(false)
    onConfirm()
  }

  const getConfirmationMessage = () => {
    if (invalidCount > 0) {
      return `¿Estás seguro de que deseas importar ${validCount} registros válidos? Se omitirán ${invalidCount} registros con errores.`
    } else {
      return `¿Estás seguro de que deseas importar ${validCount} registros?`
    }
  }

  const allRows = useMemo(() => {
    return [...validRows, ...invalidRows].sort((a, b) => a.index - b.index)
  }, [validRows, invalidRows])

  const getRowStatus = (row: ParsedRow) => {
    if (row.errors.length === 0) {
      return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' }
    }
    return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' }
  }

  const columns = useMemo(() => {
    if (allRows.length === 0) return []
    return Object.keys(allRows[0].data)
  }, [allRows])

  return (
    <div className="space-y-2">
      <div className="text-center py-2">
        <h3 className="text-lg font-semibold">Validar Datos</h3>
        <p className="text-sm text-muted-foreground ">
          Revisa los datos importados y corrige los errores antes de continuar
        </p>
      </div>

      {/* Resumen de validación */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-2 bg-muted/50 rounded-lg">
          <div className="text-2xl font-bold">{totalRows}</div>
          <div className="text-sm text-muted-foreground">Total de filas</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{validCount}</div>
          <div className="text-sm text-muted-foreground">Filas válidas</div>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{invalidCount}</div>
          <div className="text-sm text-muted-foreground">Filas con errores</div>
        </div>
      </div>

      {/* Errores de columnas */}
      {columnErrors.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">Problemas de estructura:</span>
          </div>
          {columnErrors.map((error, index) => (
            <div
              key={index}
              className="text-sm text-amber-700 bg-amber-50 p-2 rounded"
            >
              {error}
            </div>
          ))}
        </div>
      )}

      {/* Tabla de datos */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Estado</TableHead>
            <TableHead className="w-16">#</TableHead>
            {columns.map((column) => (
              <TableHead key={column}>{column}</TableHead>
            ))}
            <TableHead>Errores</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allRows.map((row) => {
            const status = getRowStatus(row)
            const StatusIcon = status.icon

            return (
              <TableRow
                key={row.index}
                className={row.errors.length > 0 ? status.bg : ''}
              >
                <TableCell>
                  <StatusIcon className={`h-4 w-4 ${status.color}`} />
                </TableCell>
                <TableCell className="font-mono text-sm">{row.index}</TableCell>
                {columns.map((column) => (
                  <TableCell key={column} className="max-w-32 truncate">
                    {String(row.data[column] || '')}
                  </TableCell>
                ))}
                <TableCell>
                  {row.errors.length > 0 && (
                    <div className="space-y-1">
                      {row.errors.map((error, errorIndex) => (
                        <Tooltip key={errorIndex}>
                          <TooltipTrigger>
                            <Badge
                              key={errorIndex}
                              variant="destructive"
                              className="text-xs"
                            >
                              {error.field}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            {error.field}: {error.message}
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {invalidCount > 0 && invalidCount < totalRows && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          Hay {invalidCount} filas con errores. Solo se importarán los registros
          válidos. ¿Deseas continuar?
        </Alert>
      )}

      {/* Acciones */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Volver
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={validCount === 0}
          className="flex items-center gap-2"
        >
          <CheckCircle className="h-4 w-4" />
          Confirmar importación ({validCount} filas)
        </Button>
      </div>

      <AlertConfirmation
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmImport}
        title="Confirmar Importación"
        description={getConfirmationMessage()}
        confirmText="IMPORTAR"
      />
    </div>
  )
}
