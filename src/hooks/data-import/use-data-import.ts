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

export function useDataImport<T = any>(config: ImportConfig<T>) {
  const { parseFile, validateFile } = useFileParser()
  const { validateData, transformData, validateRequiredColumns } =
    useDataValidator()

  const [state, setState] = useState<ImportState<T>>({
    step: 'upload',
    file: null,
    parsedData: null,
    validationResult: null,
    columnMapping: config.columnMapping || {},
    isLoading: false,
    error: null,
    result: null,
    progress: 0,
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

        // Validar límite de filas
        if (config.maxRows && parsedData.data.length > config.maxRows) {
          setError(
            `El archivo contiene demasiadas filas. Máximo permitido: ${config.maxRows}`
          )
          return
        }

        setState((prev) => ({
          ...prev,
          file,
          parsedData,
          step: 'verify',
          isLoading: false,
          error: null,
        }))

        // Ejecutar validación inicial
        await handleDataValidation(parsedData.data)
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Error procesando archivo'
        )
      }
    },
    [config, parseFile, validateFile, validateRequiredColumns]
  )

  const handleDataValidation = useCallback(
    async (data: T[]) => {
      setLoading(true)

      try {
        // Aplicar mapeo de columnas si existe
        let mappedData = data
        if (Object.keys(state.columnMapping).length > 0) {
          mappedData = data.map((row) => {
            const mappedRow: any = {}
            Object.entries(state.columnMapping).forEach(
              ([csvColumn, entityField]) => {
                mappedRow[entityField] = (row as any)[csvColumn]
              }
            )
            return mappedRow
          })
        }

        // Validar datos
        const validationResult = validateData(
          mappedData,
          config.validationSchema
        )

        setState((prev) => ({
          ...prev,
          validationResult,
          isLoading: false,
        }))
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Error validando datos'
        )
      }
    },
    [state.columnMapping, validateData, config.validationSchema]
  )

  const handleColumnMapping = useCallback(
    (mapping: ColumnMapping) => {
      setState((prev) => ({ ...prev, columnMapping: mapping }))

      // Re-validar datos con el nuevo mapeo
      if (state.parsedData) {
        handleDataValidation(state.parsedData.data)
      }
    },
    [state.parsedData, handleDataValidation]
  )

  const proceedToConfirmation = useCallback(() => {
    if (!state.validationResult?.isValid) {
      setError(
        'Hay errores de validación que deben corregirse antes de continuar'
      )
      return
    }

    setStep('confirm')
  }, [state.validationResult, setStep])

  const handleImport = useCallback(async () => {
    if (!state.parsedData || !state.validationResult) {
      setError('No hay datos para importar')
      return
    }

    setLoading(true)
    setState((prev) => ({ ...prev, progress: 0 }))

    try {
      // Aplicar mapeo y transformaciones
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
      const transformedData = transformData(
        dataToImport,
        config.validationSchema
      )

      // Filtrar solo filas válidas
      const validData = transformedData.filter((_, index) => {
        const rowErrors = state.validationResult!.errors.filter(
          (error) => error.row === index + 1
        )
        return rowErrors.length === 0
      })

      // Simular progreso
      setState((prev) => ({ ...prev, progress: 25 }))

      // Ejecutar importación
      const result = await config.importFunction(validData)

      setState((prev) => ({
        ...prev,
        result,
        step: result.success ? 'success' : 'error',
        isLoading: false,
        progress: 100,
      }))
    } catch (error) {
      const errorResult: ImportResult = {
        success: false,
        imported: 0,
        failed: state.parsedData.data.length,
        errors: [
          {
            row: 0,
            message:
              error instanceof Error ? error.message : 'Error desconocido',
            data: null,
          },
        ],
        duration: 0,
      }

      setState((prev) => ({
        ...prev,
        result: errorResult,
        step: 'error',
        isLoading: false,
      }))
    }
  }, [
    state.parsedData,
    state.validationResult,
    state.columnMapping,
    config,
    transformData,
  ])

  const reset = useCallback(() => {
    setState({
      step: 'upload',
      file: null,
      parsedData: null,
      validationResult: null,
      columnMapping: config.columnMapping || {},
      isLoading: false,
      error: null,
      result: null,
      progress: 0,
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
      case 'success':
      case 'error':
        reset()
        break
    }
  }, [state.step, setStep, reset])

  return {
    state,
    actions: {
      handleFileSelect,
      handleColumnMapping,
      proceedToConfirmation,
      handleImport,
      goBack,
      reset,
      setStep,
      setError,
    },
  }
}
