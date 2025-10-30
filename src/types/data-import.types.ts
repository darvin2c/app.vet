export type ImportStep = 'upload' | 'verify' | 'confirm' | 'success' | 'error'

export type ValidationFieldType =
  | 'string'
  | 'number'
  | 'email'
  | 'date'
  | 'boolean'

export interface ValidationRule {
  type: ValidationFieldType
  required?: boolean
  rules?: Array<{
    type:
      | 'minLength'
      | 'maxLength'
      | 'min'
      | 'max'
      | 'email'
      | 'enum'
      | 'custom'
    value?: any
    values?: any[]
    message: string
    validator?: (value: any) => boolean
  }>
  defaultValue?: any
  transform?: (value: any) => any
}

export interface ValidationSchema {
  [fieldName: string]: ValidationRule
}

export interface ColumnMapping {
  [csvColumn: string]: string // campo de la entidad
}

export interface ValidationError {
  row: number
  column: string
  message: string
  value: any
  severity: 'error' | 'warning'
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
  validRows: number
  totalRows: number
}

export interface ParsedData<T = any> {
  headers: string[]
  data: T[]
  fileName: string
  fileSize: number
}

export interface ImportError {
  row: number
  message: string
  data: any
}

export interface ImportResult {
  success: boolean
  imported: number
  failed: number
  errors: ImportError[]
  duration: number
}

export interface ImportConfig<T = any> {
  entityType: string
  validationSchema: ValidationSchema
  columnMapping?: ColumnMapping
  maxRows?: number
  maxFileSize?: number // en bytes
  requiredColumns: string[]
  importFunction: (data: any[]) => Promise<ImportResult>
  allowedFileTypes?: string[]
}

// Props de componentes
export interface DataImporterProps<T = any> {
  config: ImportConfig<T>
  onComplete?: (result: ImportResult) => void
  onCancel?: () => void
  className?: string
}

export interface FileUploadStepProps<T = any> {
  onFileSelect: (file: File) => void
  acceptedTypes: string[]
  maxSize: number
  isLoading?: boolean
  error?: string
  config?: ImportConfig<T>
}

export interface DataVerificationStepProps<T = any> {
  data: ParsedData<T>
  validationResult: ValidationResult
  columnMapping: ColumnMapping
  onColumnMap: (mapping: ColumnMapping) => void
  onNext: () => void
  onBack: () => void
  isLoading?: boolean
}

export interface ImportConfirmationStepProps {
  data: any[]
  validationResult: ValidationResult
  onImport: () => Promise<void>
  onBack: () => void
  isImporting?: boolean
  progress?: number
  result?: ImportResult
}

// Estados del hook principal
export interface ImportState<T = any> {
  step: ImportStep
  file: File | null
  parsedData: ParsedData<T> | null
  validationResult: ValidationResult | null
  columnMapping: ColumnMapping
  isLoading: boolean
  error: string | null
  result: ImportResult | null
  progress: number
}

// Tipos para el parser de archivos
export interface FileParseOptions {
  delimiter?: string
  skipEmptyLines?: boolean
  header?: boolean
}

export interface ExcelParseOptions {
  sheetName?: string
  range?: string
  header?: boolean
}
