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
  duration?: number
  message?: string
}

// Nuevo tipo para mapeo de columnas con metadatos
export interface ColumnMappingConfig {
  label: string
  description: string
  example: string
  required: boolean
  type?: 'string' | 'number' | 'email' | 'date' | 'boolean' | 'select'
  options?: string[]
}

export interface ImportConfig<T = any> {
  entityType: string
  schema?: any // Esquema de validación (Zod schema)
  validationSchema?: ValidationSchema // Esquema de validación legacy
  columnMapping?: ColumnMapping
  columnMappings?: Record<string, ColumnMappingConfig> // Nuevo mapeo con metadatos
  requiredColumns?: string[]
  optionalColumns?: string[]
  maxRows?: number
  maxFileSize?: number // en bytes
  allowedFileTypes?: string[]
  sampleData?: T[] // Datos de ejemplo
}

export interface DataImporterProps<T = any> {
  config: ImportConfig<T>
  onCancel?: () => void
  className?: string
  isImporting?: boolean
  importResult?: ImportResult | null
  onComplete?: (result: ImportResult) => void
  onImport?: (data: T[]) => Promise<void>
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

// Estado del hook useDataImport
export interface ImportState<T = any> {
  step: ImportStep
  file: File | null
  parsedData: ParsedData<T> | null
  validationResult: ValidationResult | null
  columnMapping: ColumnMapping
  isLoading: boolean
  error: string | null
}

// Opciones para parsear archivos
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
