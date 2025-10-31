import { z } from 'zod'

export type DataImportStep = 'upload' | 'validate' | 'confirm'

export interface ParsedRow {
  data: Record<string, any>
  index: number
  errors: ValidationError[]
}

export interface ValidationError {
  field: string
  message: string
  type: 'required' | 'invalid' | 'format' | 'unknown_column'
}

export interface ValidationResult {
  validRows: ParsedRow[]
  invalidRows: ParsedRow[]
  totalRows: number
  validCount: number
  invalidCount: number
  columnErrors: string[]
}

export interface DataImportState {
  step: DataImportStep
  file: File | null
  parsedData: ParsedRow[]
  validationResult: ValidationResult | null
}

export interface DataImportProps<T> {
  schema: z.ZodSchema<T>
  onImport: (data: T[]) => void | Promise<void>
  isLoading?: boolean
  templateName?: string
  title?: string
  description?: string
  error?: string | null
  acceptedFileTypes?: string[]
  maxFileSize?: number
}

export interface UseDataImportReturn {
  state: DataImportState
  actions: {
    handleFileSelect: (file: File) => Promise<void>
    validateData: () => void
    confirmImport: () => void
    goToStep: (step: DataImportStep) => void
    reset: () => void
    downloadTemplate: () => void
  }
  errors: {
    fileError: string | null
    validationErrors: ValidationError[]
    importError: string | null
  }
}
