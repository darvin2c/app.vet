import { useCallback } from 'react'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import type {
  ParsedData,
  FileParseOptions,
  ExcelParseOptions,
} from '@/types/data-import.types'

export function useFileParser() {
  const parseCSV = useCallback(
    async (file: File, options: FileParseOptions = {}): Promise<ParsedData> => {
      return new Promise((resolve, reject) => {
        Papa.parse(file, {
          header: options.header ?? true,
          skipEmptyLines: options.skipEmptyLines ?? true,
          delimiter: options.delimiter ?? '',
          complete: (results) => {
            if (results.errors.length > 0) {
              reject(
                new Error(`Error parsing CSV: ${results.errors[0].message}`)
              )
              return
            }

            const headers = results.meta.fields || []
            const data = results.data as any[]

            resolve({
              headers,
              data,
              fileName: file.name,
              fileSize: file.size,
            })
          },
          error: (error) => {
            reject(new Error(`Error parsing CSV: ${error.message}`))
          },
        })
      })
    },
    []
  )

  const parseExcel = useCallback(
    async (
      file: File,
      options: ExcelParseOptions = {}
    ): Promise<ParsedData> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer)
            const workbook = XLSX.read(data, { type: 'array' })

            if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
              reject(new Error('No sheets found in Excel file'))
              return
            }

            const sheetName = options.sheetName || workbook.SheetNames[0]
            const worksheet = workbook.Sheets[sheetName]

            if (!worksheet) {
              reject(new Error(`Sheet "${sheetName}" not found`))
              return
            }

            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
              header: options.header !== false ? 1 : undefined,
              range: options.range,
              defval: '',
            })

            if (jsonData.length === 0) {
              reject(new Error('No data found in Excel file'))
              return
            }

            const headers = Object.keys(jsonData[0] as object)

            resolve({
              headers,
              data: jsonData,
              fileName: file.name,
              fileSize: file.size,
            })
          } catch (error) {
            reject(
              new Error(
                `Error parsing Excel: ${error instanceof Error ? error.message : 'Unknown error'}`
              )
            )
          }
        }

        reader.onerror = () => {
          reject(new Error('Error reading file'))
        }

        reader.readAsArrayBuffer(file)
      })
    },
    []
  )

  const parseFile = useCallback(
    async (file: File): Promise<ParsedData> => {
      const fileExtension = file.name.split('.').pop()?.toLowerCase()

      switch (fileExtension) {
        case 'csv':
          return parseCSV(file)
        case 'xlsx':
        case 'xls':
          return parseExcel(file)
        default:
          throw new Error(`Unsupported file type: ${fileExtension}`)
      }
    },
    [parseCSV, parseExcel]
  )

  const validateFile = useCallback(
    (
      file: File,
      allowedTypes: string[] = ['.csv', '.xlsx', '.xls'],
      maxSize: number = 10 * 1024 * 1024 // 10MB por defecto
    ): { isValid: boolean; error?: string } => {
      // Validar tipo de archivo
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
      if (!allowedTypes.includes(fileExtension)) {
        return {
          isValid: false,
          error: `Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(', ')}`,
        }
      }

      // Validar tamaño
      if (file.size > maxSize) {
        const maxSizeMB = Math.round(maxSize / (1024 * 1024))
        return {
          isValid: false,
          error: `El archivo es demasiado grande. Tamaño máximo: ${maxSizeMB}MB`,
        }
      }

      return { isValid: true }
    },
    []
  )

  return {
    parseFile,
    parseCSV,
    parseExcel,
    validateFile,
  }
}
