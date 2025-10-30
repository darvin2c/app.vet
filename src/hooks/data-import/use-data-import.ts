import { useState, useCallback } from 'react'
import { useFileParser } from './use-file-parser'
import { useDataValidator } from './use-data-validator'
import type {
  ImportConfig,
  ImportState,
  ImportStep,
  ColumnMapping,
  ImportResult,
} from '@/types/data-import.types'

interface UseDataImportProps<T = any> {
  config: ImportConfig<T>
  isImporting?: boolean
  importResult?: ImportResult | null
}

export function useDataImport<T = any>({ 
  config, 
  isImporting = false, 
  importResult = null 
}: UseDataImportProps<T>) {
  const { parseFile, validateFile } = useFileParser()
  const { validateData, transformData, validateRequiredColumns, validateAllowedColumns } =
    useDataValidator()

  const [state, setState] = useState<ImportState<T>>({
    step: 'upload',
    file: null,
    parsedData: null,
    validationResult: null,
    columnMapping: config.columnMapping || {},
    isLoading: false,
    error: null,
  })

  const setStep = useCallback((step: ImportStep) => {
    setState((prev) => ({ ...prev, step, error: null }))
  }, [])

  const setError = useCallback((error: string) => {
    setState((prev) => ({ ...prev, error, isLoading: false }))
  }, [])

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }))
  }, [])

  const handleFileSelect = useCallback(
    async (file: File) => {
      setLoading(true)
      setError('')

      try {
        // Validar archivo
        const fileValidation = validateFile(
          file,
          config.allowedFileTypes || ['.csv', '.xlsx', '.xls'],
          config.maxFileSize || 10 * 1024 * 1024
        )

        if (!fileValidation.isValid) {
          setError(fileValidation.error || 'Archivo inválido')
          return
        }

        // Parsear archivo
        const parsedData = await parseFile(file)

        // Validar que tenga datos
        if (parsedData.data.length === 0) {
          setError('El archivo no contiene datos')
          return
        }

        // Validar columnas requeridas
        const columnValidation = validateRequiredColumns(
          parsedData.headers,
          config.requiredColumns || []
        )

        if (!columnValidation.isValid) {
          setError(
            `Faltan columnas requeridas: ${columnValidation.missingColumns.join(', ')}`
          )
          return
        }

        // Validar columnas permitidas
        const allowedColumnValidation = validateAllowedColumns(
          parsedData.headers,
          config.requiredColumns || [],
          config.optionalColumns || []
        )

        if (!allowedColumnValidation.isValid) {
          setError(
            `Columnas no permitidas: ${allowedColumnValidation.invalidColumns.join(', ')}`
          )
          return
        }

        // Validar datos
        const validationResult = validateData(parsedData.data, config.schema || {})

        setState((prev) => ({
          ...prev,
          file,
          parsedData,
          validationResult,
          step: 'verify',
          isLoading: false,
          error: null,
        }))
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Error procesando archivo'
        )
      }
    },
    [config, parseFile, validateFile, validateData, validateRequiredColumns, setLoading, setError]
  )

  const handleColumnMapping = useCallback((mapping: ColumnMapping) => {
    setState((prev) => ({ ...prev, columnMapping: mapping }))
  }, [])

  const proceedToConfirmation = useCallback(() => {
    setStep('confirm')
  }, [setStep])

  // Función para preparar datos listos para importar
  const getPreparedData = useCallback((): T[] => {
    if (!state.parsedData || !state.validationResult) {
      return []
    }

    // Mapear columnas si es necesario
    let dataToImport = state.parsedData.data
    if (Object.keys(state.columnMapping).length > 0) {
      dataToImport = state.parsedData.data.map((row) => {
        const mappedRow: any = {}
        Object.entries(state.columnMapping).forEach(
          ([csvColumn, entityField]) => {
            mappedRow[entityField] = (row as any)[csvColumn]
          }
        )
        return mappedRow
      })
    }

    // Aplicar transformaciones del schema
    const transformedData = transformData(dataToImport, config.schema || {})

    // Filtrar solo filas válidas
    const validData = transformedData.filter((_, index) => {
      const rowErrors = state.validationResult!.errors.filter(
        (error) => error.row === index + 1
      )
      return rowErrors.length === 0
    })

    return validData
  }, [state.parsedData, state.validationResult, state.columnMapping, config.schema, transformData])

  const reset = useCallback(() => {
    setState({
      step: 'upload',
      file: null,
      parsedData: null,
      validationResult: null,
      columnMapping: config.columnMapping || {},
      isLoading: false,
      error: null,
    })
  }, [config.columnMapping])

  const goBack = useCallback(() => {
    switch (state.step) {
      case 'verify':
        setStep('upload')
        break
      case 'confirm':
        setStep('verify')
        break
      default:
        reset()
        break
    }
  }, [state.step, setStep, reset])

  // Combinar estado interno con estado externo
  const combinedState = {
    ...state,
    // Usar estado externo para importación si está disponible
    isLoading: state.isLoading || isImporting,
  }

  return {
    state: combinedState,
    importResult,
    actions: {
      handleFileSelect,
      handleColumnMapping,
      proceedToConfirmation,
      getPreparedData,
      goBack,
      reset,
      setStep,
      setError,
    },
  }
}
