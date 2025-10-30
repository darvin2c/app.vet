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
  isImporting = false,
  importResult = null,
  onImport,
}: DataImporterProps<T>) {
  const { state, importResult: hookImportResult, actions } = useDataImport({ 
    config, 
    isImporting, 
    importResult 
  })

  // Manejar completación de importación
  useEffect(() => {
    if (hookImportResult && hookImportResult.success && onComplete) {
      onComplete(hookImportResult)
    }
  }, [hookImportResult, onComplete])

  // Obtener información del paso actual
  const getStepInfo = () => {
    switch (state.step) {
      case 'upload':
        return { number: 1, title: 'Subir Archivo', total: 3 }
      case 'verify':
        return { number: 2, title: 'Verificar Datos', total: 3 }
      case 'confirm':
        return { number: 3, title: 'Confirmar Importación', total: 3 }
      default:
        return { number: 1, title: 'Subir Archivo', total: 3 }
    }
  }

  const stepInfo = getStepInfo()

  // Función para manejar la importación
  const handleImport = async () => {
    if (!onImport) return
    
    const preparedData = actions.getPreparedData()
    await onImport(preparedData)
  }

  return (
    <div className={`w-full max-w-6xl mx-auto ${className}`}>
      <div>
        <div className="p-6">
          {/* Header con progreso */}
          <div className="mb-8">
            {/* Indicador de progreso */}
            <div className="flex items-center justify-center w-full max-w-4xl mx-auto px-8">
              {[1, 2, 3].map((step, index) => {
                const isActive = step === stepInfo.number
                const isCompleted = step < stepInfo.number
                const isConnector = index < 2

                const stepTitles = ['Subir Archivo', 'Verificar Datos', 'Confirmar Importación']

                return (
                  <div key={step} className="flex items-center flex-1">
                    {/* Círculo del paso */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`
                          w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold transition-colors
                          ${
                            isActive
                              ? 'bg-blue-600 text-white'
                              : isCompleted
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-200 text-gray-600'
                          }
                        `}
                      >
                        {step}
                      </div>
                      
                      {/* Título del paso */}
                      <div className="mt-3 text-center">
                        {isActive && (
                          <div className="text-sm font-medium text-blue-600">
                            Paso {step} de 3
                          </div>
                        )}
                        <div className={`text-sm ${isActive ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                          {stepTitles[index]}
                        </div>
                      </div>
                    </div>

                    {/* Línea conectora */}
                    {isConnector && (
                      <div className="flex-1 mx-8">
                        <div
                          className={`
                            h-1 w-full transition-colors
                            ${isCompleted ? 'bg-green-600' : 'bg-gray-200'}
                          `}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Contenido del paso actual */}
          <div className="min-h-[400px]">
            {state.step === 'upload' && (
              <FileUploadStep
                onFileSelect={actions.handleFileSelect}
                acceptedTypes={config.allowedFileTypes || ['.csv', '.xlsx', '.xls']}
                maxSize={config.maxFileSize || 10 * 1024 * 1024}
                isLoading={state.isLoading}
                error={state.error || undefined}
                config={config}
              />
            )}

            {state.step === 'verify' && state.parsedData && state.validationResult && (
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

            {state.step === 'confirm' && state.parsedData && state.validationResult && (
              <ImportConfirmationStep
                data={actions.getPreparedData()}
                validationResult={state.validationResult}
                onImport={handleImport}
                onBack={actions.goBack}
                isImporting={isImporting}
                result={hookImportResult || undefined}
              />
            )}
          </div>

          {/* Botones de acción globales */}
          <div className="flex justify-between items-center mt-6 pt-6 border-t">
            <div>
              {state.step !== 'upload' && (
                <button
                  onClick={actions.goBack}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={state.isLoading || isImporting}
                >
                  ← Volver
                </button>
              )}
            </div>

            <div className="flex gap-3">
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={state.isLoading || isImporting}
                >
                  Cancelar
                </button>
              )}

              {state.step === 'upload' && (
                <button
                  onClick={actions.reset}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  disabled={state.isLoading}
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
