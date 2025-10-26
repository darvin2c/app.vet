export interface PrintOptions {
  filename?: string
  format?: 'a4' | 'letter'
  orientation?: 'portrait' | 'landscape'
}

/**
 * Descarga un PDF usando la API simplificada
 */
export const downloadPDF = async (
  orderId: string,
  options: PrintOptions = {}
): Promise<void> => {
  try {
    const filename = options.filename || `orden-${orderId}.pdf`

    console.log('📥 Iniciando descarga de PDF para orden:', orderId)

    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
        filename,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Error al generar PDF')
    }

    // Crear blob y descargar
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    console.log('✅ PDF descargado exitosamente:', filename)
  } catch (error) {
    console.error('❌ Error al descargar PDF:', error)
    throw error
  }
}

/**
 * Genera e imprime un documento directamente (funcionalidad simple mantenida)
 */
export const printDocument = (): void => {
  window.print()
}

/**
 * Abre una vista previa del documento en una nueva ventana usando la página de impresión
 */
export const previewDocument = (orderId: string): void => {
  const previewURL = `/orders/${orderId}/print`
  window.open(previewURL, '_blank')
}
