import * as XLSX from 'xlsx'
import type { ImportConfig, ValidationSchema } from '@/types/data-import.types'

export interface TemplateOptions {
  includeExampleRows?: boolean
  exampleRowsCount?: number
  format?: 'csv' | 'xlsx'
}

/**
 * Genera una plantilla de importación basada en la configuración
 */
export function generateTemplate<T = any>(
  config: ImportConfig<T>,
  options: TemplateOptions = {}
) {
  const {
    includeExampleRows = true,
    exampleRowsCount = 2,
    format = 'csv',
  } = options

  // Obtener columnas requeridas y opcionales
  const columns = getColumnsFromSchema(
    config.validationSchema,
    config.requiredColumns
  )

  // Crear datos de ejemplo si se solicita
  const data: any[] = []

  if (includeExampleRows) {
    for (let i = 0; i < exampleRowsCount; i++) {
      const exampleRow: any = {}
      columns.forEach((column) => {
        exampleRow[column.name] = generateExampleValue(column, i + 1)
      })
      data.push(exampleRow)
    }
  }

  // Generar archivo según el formato
  if (format === 'xlsx') {
    return generateExcelTemplate(columns, data, config.entityType)
  } else {
    return generateCSVTemplate(columns, data)
  }
}

/**
 * Descarga una plantilla generada
 */
export function downloadTemplate<T = any>(
  config: ImportConfig<T>,
  options: TemplateOptions = {}
) {
  const { format = 'csv' } = options
  const template = generateTemplate(config, options)

  const fileName = `plantilla_${config.entityType.toLowerCase().replace(/\s+/g, '_')}.${format}`

  if (format === 'xlsx') {
    // Para Excel, template es un Blob
    const url = URL.createObjectURL(template as Blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } else {
    // Para CSV, template es un string
    const blob = new Blob([template as string], {
      type: 'text/csv;charset=utf-8;',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

interface ColumnInfo {
  name: string
  type: string
  required: boolean
  description?: string
}

/**
 * Extrae información de columnas del schema de validación
 */
function getColumnsFromSchema(
  validationSchema: ValidationSchema,
  requiredColumns: string[]
): ColumnInfo[] {
  return Object.entries(validationSchema).map(([fieldName, rule]) => ({
    name: fieldName,
    type: rule.type,
    required: requiredColumns.includes(fieldName) || rule.required === true,
    description: getColumnDescription(
      fieldName,
      rule.type,
      rule.required === true
    ),
  }))
}

/**
 * Genera una descripción para la columna
 */
function getColumnDescription(
  name: string,
  type: string,
  required: boolean
): string {
  const typeDescriptions: Record<string, string> = {
    string: 'Texto',
    number: 'Número',
    email: 'Correo electrónico',
    date: 'Fecha (YYYY-MM-DD)',
    boolean: 'Verdadero/Falso (true/false)',
  }

  const typeDesc = typeDescriptions[type] || 'Texto'
  const requiredDesc = required ? ' (Requerido)' : ' (Opcional)'

  return `${typeDesc}${requiredDesc}`
}

/**
 * Genera un valor de ejemplo para una columna
 */
function generateExampleValue(column: ColumnInfo, rowIndex: number): string {
  const { name, type, required } = column

  // Si el campo no es requerido y es par, a veces devolver vacío para mostrar que es opcional
  if (!required && rowIndex % 4 === 0) {
    return ''
  }

  switch (type) {
    case 'string':
      if (
        name.toLowerCase().includes('name') ||
        name.toLowerCase().includes('nombre')
      ) {
        return `Producto Ejemplo ${rowIndex}`
      }
      if (
        name.toLowerCase().includes('description') ||
        name.toLowerCase().includes('descripcion')
      ) {
        return `Descripción detallada del producto ejemplo ${rowIndex}`
      }
      if (
        name.toLowerCase().includes('category') ||
        name.toLowerCase().includes('categoria')
      ) {
        const categories = ['Electrónicos', 'Ropa', 'Hogar', 'Deportes', 'Libros']
        return categories[rowIndex % categories.length]
      }
      if (
        name.toLowerCase().includes('sku') ||
        name.toLowerCase().includes('codigo')
      ) {
        return `SKU${rowIndex.toString().padStart(3, '0')}`
      }
      // Asegurar que los strings tengan al menos 1 carácter para cumplir minLength
      return `Valor ${rowIndex}`

    case 'number':
      if (
        name.toLowerCase().includes('price') ||
        name.toLowerCase().includes('precio')
      ) {
        // Asegurar que el precio sea mayor a 0
        return Math.max(0.01, 10.99 + (rowIndex * 5.50)).toFixed(2)
      }
      if (
        name.toLowerCase().includes('stock') ||
        name.toLowerCase().includes('cantidad')
      ) {
        // Asegurar que el stock sea >= 0
        return Math.max(0, rowIndex * 10).toString()
      }
      // Para otros números, asegurar que sean positivos
      return Math.max(1, rowIndex).toString()

    case 'email':
      return `usuario${rowIndex}@ejemplo.com`

    case 'date':
      const date = new Date()
      date.setDate(date.getDate() + rowIndex)
      return date.toISOString().split('T')[0]

    case 'boolean':
      return rowIndex % 2 === 0 ? 'true' : 'false'

    default:
      return `Ejemplo ${rowIndex}`
  }
}

/**
 * Genera plantilla CSV
 */
function generateCSVTemplate(columns: ColumnInfo[], data: any[]): string {
  const headers = columns.map((col) => col.name)
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header] || ''
          // Escapar valores que contengan comas o comillas
          if (
            typeof value === 'string' &&
            (value.includes(',') || value.includes('"'))
          ) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        })
        .join(',')
    ),
  ].join('\n')

  return csvContent
}

/**
 * Genera plantilla Excel
 */
function generateExcelTemplate(
  columns: ColumnInfo[],
  data: any[],
  entityType: string
): Blob {
  // Crear workbook
  const wb = XLSX.utils.book_new()

  // Crear hoja de datos
  const headers = columns.map((col) => col.name)
  const wsData = [
    headers,
    ...data.map((row) => headers.map((header) => row[header] || '')),
  ]
  const ws = XLSX.utils.aoa_to_sheet(wsData)

  // Agregar hoja al workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Datos')

  // Crear hoja de instrucciones
  const instructionsData = [
    ['Instrucciones para importar datos'],
    [''],
    ['1. Complete los datos en la hoja "Datos"'],
    ['2. La primera fila contiene los nombres de las columnas (no modificar)'],
    ['3. Complete las filas siguientes con sus datos'],
    ['4. Guarde el archivo y súbalo al sistema'],
    [''],
    ['Descripción de columnas:'],
    ['Columna', 'Tipo', 'Descripción'],
    ...columns.map((col) => [col.name, col.type, col.description || '']),
  ]

  const wsInstructions = XLSX.utils.aoa_to_sheet(instructionsData)
  XLSX.utils.book_append_sheet(wb, wsInstructions, 'Instrucciones')

  // Generar archivo Excel
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  return new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
}