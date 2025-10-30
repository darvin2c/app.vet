import { useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useDataImport } from '@/hooks/data-import/use-data-import'
import { FileUploadStep } from './file-upload-step'
import { DataVerificationStep } from './data-verification-step'
import { ImportConfirmationStep } from './import-confirmation-step'
import type { DataImporterProps } from '@/types/data-import.types'

export function DataImporter<T = any>({
  config,
  onComplete,
  onCancel,
  className = '',
}: DataImporterProps<T>) {
  const { state, actions } = useDataImport(config)

  // Manejar completación de importación
  useEffect(() => {
    if (state.result && state.step === 'success' && onComplete) {
      onComplete(state.result)
    }
  }, [state.result, state.step, onComplete])

  // Obtener información del paso actual
  const getStepInfo = () => {
    switch (state.step) {
      case 'upload':
        return { number: 1, title: 'Subir Archivo', total: 3 }
      case 'verify':
        return { number: 2, title: 'Verificar Datos', total: 3 }
      case 'confirm':
        return { number: 3, title: 'Confirmar Importación', total: 3 }
      case 'success':
      case 'error':
        return { number: 3, title: 'Resultado', total: 3 }
      default:
        return { number: 1, title: 'Subir Archivo', total: 3 }
    }
  }

  const stepInfo = getStepInfo()

  return (
    <div className={`w-full max-w-6xl mx-auto ${className}`}>
      <Card>
        <CardContent className="p-6">
          {/* Header con progreso */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Importar {config.entityType}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Sigue los pasos para importar tus datos
                </p>
              </div>

              {onCancel && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCancel}
                  disabled={state.isLoading}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Indicador de progreso */}
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                      ${
                        step < stepInfo.number
                          ? 'bg-green-600 text-white'
                          : step === stepInfo.number
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-600'
                      }
                    `}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`
                        w-16 h-0.5 mx-2
                        ${step < stepInfo.number ? 'bg-green-600' : 'bg-gray-200'}
                      `}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-2 flex items-center gap-2">
              <Badge variant={stepInfo.number === 3 ? 'default' : 'secondary'}>
                Paso {stepInfo.number} de {stepInfo.total}
              </Badge>
              <span className="text-sm text-gray-600">{stepInfo.title}</span>
            </div>
          </div>

          {/* Contenido del paso actual */}
          <div className="min-h-96">
            {state.step === 'upload' && (
              <FileUploadStep
                onFileSelect={actions.handleFileSelect}
                acceptedTypes={
                  config.allowedFileTypes || ['.csv', '.xlsx', '.xls']
                }
                maxSize={config.maxFileSize || 10 * 1024 * 1024}
                isLoading={state.isLoading}
                error={state.error || undefined}
                config={config}
              />
            )}

            {state.step === 'verify' &&
              state.parsedData &&
              state.validationResult && (
                <DataVerificationStep
                  data={state.parsedData}
                  validationResult={state.validationResult}
                  columnMapping={state.columnMapping}
                  onColumnMap={actions.handleColumnMapping}
                  onNext={actions.proceedToConfirmation}
                  onBack={actions.goBack}
                  isLoading={state.isLoading}
                />
              )}

            {(state.step === 'confirm' ||
              state.step === 'success' ||
              state.step === 'error') &&
              state.parsedData &&
              state.validationResult && (
                <ImportConfirmationStep
                  data={state.parsedData.data}
                  validationResult={state.validationResult}
                  onImport={actions.handleImport}
                  onBack={actions.goBack}
                  isImporting={state.isLoading}
                  progress={state.progress}
                  result={state.result || undefined}
                />
              )}
          </div>

          {/* Footer con información adicional */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <span>
                  Entidad: <strong>{config.entityType}</strong>
                </span>
                {state.file && (
                  <span>
                    Archivo: <strong>{state.file.name}</strong>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4">
                {state.parsedData && (
                  <span>{state.parsedData.data.length} registros</span>
                )}
                {state.validationResult && (
                  <>
                    <span className="text-green-600">
                      {state.validationResult.validRows} válidos
                    </span>
                    {state.validationResult.errors.length > 0 && (
                      <span className="text-red-600">
                        {state.validationResult.errors.length} errores
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
