import { z } from 'zod'
import { useDataImport } from '@/hooks/data-import/use-data-import'
import { DataImportProps } from '@/types/data-import.types'
import { StepIndicator } from './step-indicator'
import { UploadStep } from './upload-step'
import { ValidateStep } from './validate-step'
import { ConfirmStep } from './confirm-step'

const steps = [
  { key: 'upload' as const, label: 'Subir Archivo', number: 1 },
  { key: 'validate' as const, label: 'Verificar Datos', number: 2 },
  { key: 'confirm' as const, label: 'Confirmar Importación', number: 3 },
]

export function DataImport<T = any>({
  schema,
  onImport,
  isLoading = false,
  templateName = 'template.csv',
  title = 'Importar Datos',
  description = 'Importa datos desde un archivo CSV o Excel',
  acceptedFileTypes = ['.csv', '.xlsx', '.xls'],
  maxFileSize = 10 * 1024 * 1024, // 10MB
}: DataImportProps<T>) {
  const { state, actions, errors } = useDataImport(schema, onImport)

  const renderCurrentStep = () => {
    switch (state.step) {
      case 'upload':
        return (
          <UploadStep
            onFileSelect={actions.handleFileSelect}
            onDownloadTemplate={actions.downloadTemplate}
            fileError={errors.fileError}
            acceptedFileTypes={acceptedFileTypes}
            maxFileSize={maxFileSize}
            templateName={templateName}
          />
        )

      case 'validate':
        if (!state.validationResult) {
          return (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">
                Validando datos...
              </p>
            </div>
          )
        }

        return (
          <ValidateStep
            validationResult={state.validationResult}
            onConfirm={actions.confirmImport}
            onBack={() => actions.goToStep('upload')}
          />
        )

      case 'confirm':
        return (
          <ConfirmStep
            validCount={state.validationResult?.validCount || 0}
            isLoading={isLoading}
            onReset={actions.reset}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>

      <StepIndicator currentStep={state.step} steps={steps} />

      <div className="bg-background border rounded-lg p-6">
        {renderCurrentStep()}
      </div>
    </div>
  )
}

// Export individual components for advanced usage
export { UploadStep, ValidateStep, ConfirmStep, StepIndicator }
