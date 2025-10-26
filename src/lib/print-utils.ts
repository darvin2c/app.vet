export interface PrintOptions {
  filename?: string
  format?: 'a4' | 'letter'
  orientation?: 'portrait' | 'landscape'
  margin?: number | [number, number, number, number]
}

/**
 * Genera e imprime un documento directamente
 */
export const printDocument = (elementId: string): void => {
  const element = document.getElementById(elementId)
  if (!element) {
    console.error(`Elemento con ID '${elementId}' no encontrado`)
    return
  }

  // Crear una nueva ventana para la impresión
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    console.error('No se pudo abrir la ventana de impresión')
    return
  }

  // Escribir el contenido HTML completo con estilos de impresión
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Documento de Impresión</title>
        <meta charset="utf-8">
        <style>
          @media print {
            @page {
              margin: 0.5in;
              size: A4;
            }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #000;
          }
          .print-container {
            max-width: 210mm;
            margin: 0 auto;
            padding: 20px;
            background: white;
          }
          .no-print {
            display: none !important;
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          ${element.innerHTML}
        </div>
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
    </html>
  `)
  printWindow.document.close()
}

/**
 * Genera y descarga un PDF del elemento especificado usando la API de Puppeteer
 */
export const downloadPDF = async (
  elementId: string,
  options: PrintOptions = {}
): Promise<void> => {
  const element = document.getElementById(elementId)
  if (!element) {
    console.error(`Elemento con ID '${elementId}' no encontrado`)
    return
  }

  const {
    filename = 'documento.pdf',
  } = options

  try {
    // Obtener el HTML completo del elemento con estilos
    const htmlContent = getElementHTML(element)

    // Enviar el HTML a la API para generar el PDF
    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        html: htmlContent,
        filename: filename,
      }),
    })

    if (!response.ok) {
      throw new Error(`Error al generar PDF: ${response.statusText}`)
    }

    // Descargar el PDF
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    console.error('Error al generar PDF:', error)
    throw error
  }
}

/**
 * Obtiene el HTML completo del elemento con todos los estilos aplicados
 */
const getElementHTML = (element: HTMLElement): string => {
  // Crear un contenedor temporal
  const container = document.createElement('div')
  
  // Clonar el elemento
  const clonedElement = element.cloneNode(true) as HTMLElement
  
  // Obtener todos los estilos CSS de la página
  const styles = Array.from(document.styleSheets)
    .map(styleSheet => {
      try {
        return Array.from(styleSheet.cssRules)
          .map(rule => rule.cssText)
          .join('\n')
      } catch (e) {
        // Ignorar hojas de estilo de dominios externos
        return ''
      }
    })
    .join('\n')

  // Crear el HTML completo con estilos
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Documento PDF</title>
        <style>
          ${styles}
          
          /* Estilos específicos para PDF */
          @page {
            margin: 20px;
            size: A4;
          }
          
          body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .pdf-container {
            max-width: 100%;
            margin: 0 auto;
          }
          
          /* Ocultar elementos que no deben aparecer en PDF */
          .no-print,
          button,
          .btn,
          [data-no-print="true"] {
            display: none !important;
          }
        </style>
      </head>
      <body>
        <div class="pdf-container">
          ${clonedElement.outerHTML}
        </div>
      </body>
    </html>
  `
  
  return htmlContent
}

/**
 * Abre una vista previa del documento en una nueva ventana
 */
export const previewDocument = (elementId: string, title: string = 'Vista Previa'): void => {
  const element = document.getElementById(elementId)
  if (!element) {
    console.error(`Elemento con ID '${elementId}' no encontrado`)
    return
  }

  const previewWindow = window.open('', '_blank')
  if (!previewWindow) {
    console.error('No se pudo abrir la ventana de vista previa')
    return
  }

  previewWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <meta charset="utf-8">
        <style>
          body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background: #f5f5f5;
          }
          .preview-container {
            max-width: 210mm;
            margin: 0 auto;
            padding: 20px;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            border-radius: 8px;
          }
          .preview-header {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px 8px 0 0;
            border-bottom: 1px solid #dee2e6;
            margin: -20px -20px 20px -20px;
          }
          .preview-title {
            margin: 0;
            font-size: 18px;
            color: #495057;
          }
        </style>
      </head>
      <body>
        <div class="preview-container">
          <div class="preview-header">
            <h1 class="preview-title">${title}</h1>
          </div>
          ${element.innerHTML}
        </div>
      </body>
    </html>
  `)
  previewWindow.document.close()
}