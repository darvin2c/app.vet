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

export function useDataImport<T extends Record<string, unknown>>(
  schema: z.ZodSchema<T>,
  onImport: (data: T[]) => void,
  templateName: string = 'template.csv',
  error?: string | null
): UseDataImportReturn {
  const [state, setState] = useState<DataImportState>(initialState)

  // Helper function para obtener las claves del schema usando schema.shape
  const getSchemaKeys = useCallback(() => {
    try {
      // Verificar si el schema tiene la propiedad shape (z.ZodObject)
      if ('shape' in schema && schema.shape) {
        const shape = schema.shape as Record<string, z.ZodTypeAny>
        const allKeys = Object.keys(shape)

        // Distinguir entre campos requeridos y opcionales
        const requiredKeys = allKeys.filter(
          (key) => !(shape[key] instanceof z.ZodOptional)
        )
        const optionalKeys = allKeys.filter(
          (key) => shape[key] instanceof z.ZodOptional
        )

        return {
          allKeys,
          requiredKeys,
          optionalKeys,
        }
      }

      // Fallback si no es un ZodObject
      return {
        allKeys: [],
        requiredKeys: [],
        optionalKeys: [],
      }
    } catch {
      return {
        allKeys: [],
        requiredKeys: [],
        optionalKeys: [],
      }
    }
  }, [schema])
  const [fileError, setFileError] = useState<string | null>(null)

  const parseFile = useCallback(async (file: File): Promise<ParsedRow[]> => {
    // Función helper para normalizar valores vacíos a undefined
    const normalizeValue = (value: unknown): unknown => {
      if (
        value === null ||
        value === undefined ||
        value === '' ||
        (typeof value === 'string' && value.trim() === '')
      ) {
        return undefined
      }
      return value
    }

    return new Promise((resolve, reject) => {
      const fileExtension = file.name.split('.').pop()?.toLowerCase()

      if (fileExtension === 'csv') {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            // Verificar si hay datos además de los headers
            if (results.data.length === 0) {
              reject(
                new Error(
                  'El archivo solo contiene encabezados, no hay datos para importar'
                )
              )
              return
            }

            const parsedRows: ParsedRow[] = (
              results.data as Record<string, unknown>[]
            ).map((row, index) => {
              // Normalizar todos los valores del row
              const normalizedData: Record<string, unknown> = {}
              Object.keys(row as Record<string, unknown>).forEach((key) => {
                normalizedData[key] = normalizeValue(
                  (row as Record<string, unknown>)[key]
                )
              })

              return {
                data: normalizedData,
                index: index + 1,
                errors: [],
              }
            })
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
            const rows = jsonData.slice(1) as unknown[][]

            // Verificar si hay datos además de los headers
            if (rows.length === 0) {
              reject(
                new Error(
                  'El archivo solo contiene encabezados, no hay datos para importar'
                )
              )
              return
            }

            const parsedRows: ParsedRow[] = rows.map((row, index) => {
              const rowData: Record<string, unknown> = {}
              headers.forEach((header, colIndex) => {
                // Usar normalizeValue en lugar de || ''
                rowData[header] = normalizeValue(row[colIndex])
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

  const validateData = useCallback(
    (parsedData: ParsedRow[]): ValidationResult | null => {
      if (!parsedData.length) return null

      // Obtener las claves del esquema usando schema.shape
      const { allKeys: schemaKeys } = getSchemaKeys()

      // Si no se pueden obtener las claves del schema, usar las del primer registro como fallback
      const finalSchemaKeys =
        schemaKeys.length > 0
          ? schemaKeys
          : parsedData[0]
            ? Object.keys(parsedData[0].data)
            : []

      const validRows: ParsedRow[] = []
      const invalidRows: ParsedRow[] = []
      const columnErrors: string[] = []

      // Verificar columnas del archivo
      const fileColumns = Object.keys(parsedData[0]?.data || {})
      const missingColumns = finalSchemaKeys.filter(
        (key) => !fileColumns.includes(key)
      )
      const extraColumns = fileColumns.filter(
        (col) => !finalSchemaKeys.includes(col)
      )

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
    },
    [schema]
  )

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
    const parsedData = validData.map((item) => schema.parse(item))
    onImport(parsedData)

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
    // Obtener las claves del esquema usando schema.shape
    const { allKeys: schemaKeys } = getSchemaKeys()

    // Si no se pueden obtener las claves del schema, usar claves genéricas como fallback
    const finalSchemaKeys =
      schemaKeys.length > 0 ? schemaKeys : ['column1', 'column2', 'column3']

    // Generar 3 filas de ejemplo usando zod-mock
    let csvContent = finalSchemaKeys.join(',') + '\n'

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', templateName)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [getSchemaKeys, schema, templateName])

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
      importError: error || null,
    },
  }
}
