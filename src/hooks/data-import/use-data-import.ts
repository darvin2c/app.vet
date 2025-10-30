import { useState, useCallback } from 'react'
import { z } from 'zod'
import * as XLSX from 'xlsx'
import Papa from 'papaparse'
import {
  DataImportState,
  DataImportStep,
  ParsedRow,
  ValidationResult,
  ValidationError,
  UseDataImportReturn,
} from '@/types/data-import.types'

const initialState: DataImportState = {
  step: 'upload',
  file: null,
  parsedData: [],
  validationResult: null,
}

export function useDataImport<T = any>(
  schema: z.ZodSchema<T>,
  onImport: (data: T[]) => void
): UseDataImportReturn {
  const [state, setState] = useState<DataImportState>(initialState)
  const [fileError, setFileError] = useState<string | null>(null)

  const parseFile = useCallback(async (file: File): Promise<ParsedRow[]> => {
    return new Promise((resolve, reject) => {
      const fileExtension = file.name.split('.').pop()?.toLowerCase()

      if (fileExtension === 'csv') {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsedRows: ParsedRow[] = results.data.map((row, index) => ({
              data: row as Record<string, any>,
              index: index + 1,
              errors: [],
            }))
            resolve(parsedRows)
          },
          error: (error) =>
            reject(new Error(`Error parsing CSV: ${error.message}`)),
        })
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer)
            const workbook = XLSX.read(data, { type: 'array' })
            const sheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[sheetName]
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

            if (jsonData.length === 0) {
              reject(new Error('El archivo está vacío'))
              return
            }

            const headers = jsonData[0] as string[]
            const rows = jsonData.slice(1) as any[][]

            const parsedRows: ParsedRow[] = rows.map((row, index) => {
              const rowData: Record<string, any> = {}
              headers.forEach((header, colIndex) => {
                rowData[header] = row[colIndex] || ''
              })
              return {
                data: rowData,
                index: index + 1,
                errors: [],
              }
            })

            resolve(parsedRows)
          } catch (error) {
            reject(
              new Error(`Error parsing Excel: ${(error as Error).message}`)
            )
          }
        }
        reader.readAsArrayBuffer(file)
      } else {
        reject(
          new Error(
            'Formato de archivo no soportado. Use CSV o Excel (.xlsx, .xls)'
          )
        )
      }
    })
  }, [])

  const validateData = useCallback((parsedData: ParsedRow[]): ValidationResult | null => {
    if (!parsedData.length) return null

    // Obtener las claves del esquema de manera más segura
    let schemaKeys: string[] = []
    try {
      // Intentar obtener las claves del esquema usando safeParse con un objeto vacío
      const result = schema.safeParse({})
      if (!result.success && result.error) {
        schemaKeys = result.error.issues
          .map((issue) => issue.path[0] as string)
          .filter(Boolean)
      }
      // Si no hay errores o no podemos obtener las claves, usar las del primer registro
      if (schemaKeys.length === 0 && parsedData[0]) {
        schemaKeys = Object.keys(parsedData[0].data)
      }
    } catch {
      // Fallback: usar las claves del primer registro
      if (parsedData[0]) {
        schemaKeys = Object.keys(parsedData[0].data)
      }
    }

    const validRows: ParsedRow[] = []
    const invalidRows: ParsedRow[] = []
    const columnErrors: string[] = []

    // Verificar columnas del archivo
    const fileColumns = Object.keys(parsedData[0]?.data || {})
    const missingColumns = schemaKeys.filter(
      (key) => !fileColumns.includes(key)
    )
    const extraColumns = fileColumns.filter((col) => !schemaKeys.includes(col))

    if (missingColumns.length > 0) {
      columnErrors.push(`Columnas faltantes: ${missingColumns.join(', ')}`)
    }
    if (extraColumns.length > 0) {
      columnErrors.push(`Columnas no reconocidas: ${extraColumns.join(', ')}`)
    }

    // Validar cada fila
    parsedData.forEach((row) => {
      const errors: ValidationError[] = []

      try {
        schema.parse(row.data)
        validRows.push({ ...row, errors })
      } catch (error) {
        if (error instanceof z.ZodError) {
          error.issues.forEach((err) => {
            errors.push({
              field: err.path.join('.'),
              message: err.message,
              type: 'invalid',
            })
          })
        }
        invalidRows.push({ ...row, errors })
      }
    })

    const validationResult: ValidationResult = {
      validRows,
      invalidRows,
      totalRows: parsedData.length,
      validCount: validRows.length,
      invalidCount: invalidRows.length,
      columnErrors,
    }

    return validationResult
  }, [schema])

  const handleFileSelect = useCallback(
    async (file: File) => {
      setFileError(null)

      try {
        const parsedData = await parseFile(file)
        const validationResult = validateData(parsedData)
        
        setState((prev) => ({
          ...prev,
          file,
          parsedData,
          validationResult,
          step: 'validate',
        }))
      } catch (error) {
        setFileError((error as Error).message)
      }
    },
    [parseFile, validateData]
  )

  const confirmImport = useCallback(() => {
    if (!state.validationResult?.validRows.length) return

    const validData = state.validationResult.validRows.map(
      (row) => row.data as T
    )
    onImport(validData)

    setState((prev) => ({
      ...prev,
      step: 'confirm',
    }))
  }, [state.validationResult, onImport])

  const goToStep = useCallback((step: DataImportStep) => {
    setState((prev) => ({ ...prev, step }))
  }, [])

  const reset = useCallback(() => {
    setState(initialState)
    setFileError(null)
  }, [])

  const downloadTemplate = useCallback(() => {
    // Obtener las claves del esquema de manera más segura
    let schemaKeys: string[] = []
    try {
      // Intentar obtener las claves del esquema usando safeParse con un objeto vacío
      const result = schema.safeParse({})
      if (!result.success && result.error) {
        schemaKeys = result.error.issues
          .map((issue) => issue.path[0] as string)
          .filter(Boolean)
      }
    } catch {
      // Fallback: usar claves genéricas si no se pueden obtener
      schemaKeys = ['column1', 'column2', 'column3']
    }

    const csvContent = schemaKeys.join(',') + '\n'

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', 'template.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [schema])

  const validateCurrentData = useCallback(() => {
    if (!state.parsedData.length) return
    
    const validationResult = validateData(state.parsedData)
    setState((prev) => ({
      ...prev,
      validationResult,
    }))
  }, [state.parsedData, validateData])

  return {
    state,
    actions: {
      handleFileSelect,
      validateData: validateCurrentData,
      confirmImport,
      goToStep,
      reset,
      downloadTemplate,
    },
    errors: {
      fileError,
      validationErrors:
        state.validationResult?.invalidRows.flatMap((row) => row.errors) || [],
    },
  }
}
