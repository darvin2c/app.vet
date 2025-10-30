import { useCallback } from 'react'
import type {
  ValidationSchema,
  ValidationResult,
  ValidationError,
  ValidationFieldType,
} from '@/types/data-import.types'

export function useDataValidator() {
  const validateField = useCallback(
    (
      value: any,
      fieldName: string,
      rule: ValidationSchema[string],
      rowIndex: number
    ): ValidationError[] => {
      const errors: ValidationError[] = []

      if (!rule) return errors

      // Validar campo requerido
      if (
        rule.required &&
        (value === null || value === undefined || value === '')
      ) {
        errors.push({
          row: rowIndex,
          column: fieldName,
          message: `El campo ${fieldName} es requerido`,
          value,
          severity: 'error',
        })
        return errors
      }

      // Si el campo está vacío y no es requerido, no validar más
      if (value === null || value === undefined || value === '') {
        return errors
      }

      // Validar tipo de dato
      const typeValidation = validateFieldType(
        value,
        rule.type,
        fieldName,
        rowIndex
      )
      if (typeValidation) {
        errors.push(typeValidation)
      }

      // Validar reglas adicionales
      if (rule.rules) {
        rule.rules.forEach((validationRule) => {
          let isValid = true
          let errorMessage = validationRule.message

          switch (validationRule.type) {
            case 'minLength':
              if (
                typeof value === 'string' &&
                value.length < (validationRule.value || 0)
              ) {
                isValid = false
              }
              break
            case 'maxLength':
              if (
                typeof value === 'string' &&
                value.length > (validationRule.value || 0)
              ) {
                isValid = false
              }
              break
            case 'min':
              if (
                typeof value === 'number' &&
                value < (validationRule.value || 0)
              ) {
                isValid = false
              }
              break
            case 'max':
              if (
                typeof value === 'number' &&
                value > (validationRule.value || 0)
              ) {
                isValid = false
              }
              break
            case 'email':
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
              if (typeof value === 'string' && !emailRegex.test(value)) {
                isValid = false
              }
              break
            case 'enum':
              if (
                validationRule.values &&
                !validationRule.values.includes(value)
              ) {
                isValid = false
              }
              break
            case 'custom':
              if (
                validationRule.validator &&
                !validationRule.validator(value)
              ) {
                isValid = false
              }
              break
          }

          if (!isValid) {
            errors.push({
              row: rowIndex,
              column: fieldName,
              message: errorMessage,
              value,
              severity: 'error',
            })
          }
        })
      }

      return errors
    },
    []
  )

  const validateFieldType = useCallback(
    (
      value: any,
      type: ValidationFieldType,
      fieldName: string,
      rowIndex: number
    ): ValidationError | null => {
      switch (type) {
        case 'string':
          if (typeof value !== 'string') {
            return {
              row: rowIndex,
              column: fieldName,
              message: `${fieldName} debe ser texto`,
              value,
              severity: 'error',
            }
          }
          break

        case 'number':
          const numValue = Number(value)
          if (isNaN(numValue)) {
            return {
              row: rowIndex,
              column: fieldName,
              message: `${fieldName} debe ser un número`,
              value,
              severity: 'error',
            }
          }
          break

        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(String(value))) {
            return {
              row: rowIndex,
              column: fieldName,
              message: `${fieldName} debe tener formato de email válido`,
              value,
              severity: 'error',
            }
          }
          break

        case 'date':
          const dateValue = new Date(value)
          if (isNaN(dateValue.getTime())) {
            return {
              row: rowIndex,
              column: fieldName,
              message: `${fieldName} debe ser una fecha válida`,
              value,
              severity: 'error',
            }
          }
          break

        case 'boolean':
          const booleanValue = String(value).toLowerCase()
          if (
            !['true', 'false', '1', '0', 'yes', 'no', 'sí', 'si'].includes(
              booleanValue
            )
          ) {
            return {
              row: rowIndex,
              column: fieldName,
              message: `${fieldName} debe ser verdadero/falso (true/false, 1/0, yes/no, sí/no)`,
              value,
              severity: 'error',
            }
          }
          break
      }

      return null
    },
    []
  )

  const validateData = useCallback(
    <T>(data: T[], schema: ValidationSchema): ValidationResult => {
      const errors: ValidationError[] = []
      const warnings: ValidationError[] = []

      data.forEach((row, index) => {
        Object.entries(schema).forEach(([fieldName, rule]) => {
          const value = (row as any)[fieldName]
          const fieldErrors = validateField(value, fieldName, rule, index + 1)

          fieldErrors.forEach((error) => {
            if (error.severity === 'error') {
              errors.push(error)
            } else {
              warnings.push(error)
            }
          })
        })
      })

      // Calcular filas válidas contando filas únicas con errores
      const rowsWithErrors = new Set(errors.map(error => error.row))
      const validRows = data.length - rowsWithErrors.size

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        validRows,
        totalRows: data.length,
      }
    },
    [validateField]
  )

  const transformData = useCallback(
    <T>(data: T[], schema: ValidationSchema): T[] => {
      return data.map((row) => {
        const transformedRow = { ...row }

        Object.entries(schema).forEach(([fieldName, rule]) => {
          if (rule?.transform) {
            const value = (transformedRow as any)[fieldName]
            try {
              ;(transformedRow as any)[fieldName] = rule.transform(value)
            } catch (error) {
              // Si la transformación falla, mantener el valor original
              console.warn(`Error transforming field ${fieldName}:`, error)
            }
          }
        })

        return transformedRow
      })
    },
    []
  )

  const validateRequiredColumns = useCallback(
    (
      headers: string[],
      requiredColumns: string[]
    ): { isValid: boolean; missingColumns: string[] } => {
      const missingColumns = requiredColumns.filter(
        (col) => !headers.includes(col)
      )

      return {
        isValid: missingColumns.length === 0,
        missingColumns,
      }
    },
    []
  )

  const validateAllowedColumns = useCallback(
    (headers: string[], requiredColumns: string[], optionalColumns: string[]) => {
      const allowedColumns = [...requiredColumns, ...optionalColumns]
      const invalidColumns = headers.filter(
        (header) => !allowedColumns.includes(header)
      )

      return {
        isValid: invalidColumns.length === 0,
        invalidColumns,
      }
    },
    []
  )

  return {
    validateData,
    validateField,
    validateFieldType,
    transformData,
    validateRequiredColumns,
    validateAllowedColumns,
  }
}
