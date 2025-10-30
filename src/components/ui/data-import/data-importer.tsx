import { useEffect } from 'react'
import { useDataImport } from '@/hooks/data-import/use-data-import'
import { FileUploadStep } from './file-upload-step'
import { DataVerificationStep } from './data-verification-step'
import { ImportConfirmationStep } from './import-confirmation-step'
import type { DataImporterProps } from '@/types/data-import.types'
import { Separator } from '@radix-ui/react-separator'

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
      <div>
        <div className="p-6">
          {/* Header con progreso */}
          <div className="mb-8">
            {/* Indicador de progreso */}
            <div className="flex items-center justify-center w-full max-w-4xl mx-auto px-8">
              {[1, 2, 3].map((step) => {
                const getStepTitle = (stepNumber: number) => {
                  switch (stepNumber) {
                    case 1:
                      return 'Subir Archivo'
                    case 2:
                      return 'Verificar Datos'
                    case 3:
                      return 'Confirmar Importación'
                    default:
                      return ''
                  }
                }

                const isActive = step === stepInfo.number
                const stepTitle = getStepTitle(step)

                return (
                  <div key={step} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div
                        className={`
                          w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold
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
                      <div className="mt-3 text-center">
                        {isActive ? (
                          <div className="space-y-1">
                            <div className="text-sm font-medium text-blue-600">
                              Paso {step} de 3
                            </div>
                            <div className="text-sm text-gray-700 font-medium">
                              {stepTitle}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-600">
                            {stepTitle}
                          </div>
                        )}
                      </div>
                    </div>
                    {step < 3 && (
                      <div className="flex-1 mx-8">
                        <div
                          className={`
                            h-1 w-full
                            ${step < stepInfo.number ? 'bg-green-600' : 'bg-gray-200'}
                          `}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
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
          <Separator className="my-8 w-full" />
          {/* Footer con información adicional */}
          <div className="mt-8 pt-6">
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
        </div>
      </div>
    </div>
  )
}
