import { NextRequest, NextResponse } from 'next/server'
import puppeteerCore from 'puppeteer-core'
import puppeteer from 'puppeteer'
import chromium from '@sparticuz/chromium'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

async function getBrowser() {
  if (
    process.env.NODE_ENV === 'production' ||
    process.env.VERCEL_ENV === 'production'
  ) {
    // Configuración para producción en Vercel
    return await puppeteerCore.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
      defaultViewport: { width: 1280, height: 720 },
    })
  } else {
    // Configuración para desarrollo local - usar puppeteer completo
    return await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { orderId, filename } = await request.json()

    console.log('🚀 Iniciando generación de PDF...')
    console.log('📄 Order ID:', orderId)
    console.log('📄 Filename:', filename)

    if (!orderId) {
      console.error('❌ No se recibió orderId')
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Construir la URL de la página de impresión
    const baseURL =
      process.env.NODE_ENV === 'production'
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3001'

    const printURL = `${baseURL}/orders/${orderId}/print`

    const browser = await getBrowser()

    const page = await browser.newPage()

    // Configurar el viewport para mejor renderizado
    await page.setViewport({ width: 1200, height: 800 })

    // Navegar a la página de impresión
    await page.goto(printURL, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    })

    // Esperar un poco más para asegurar que todo esté renderizado
    console.log('⏱️ Esperando renderizado completo...')
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Verificar que el contenido se haya cargado
    const pageContent = await page.evaluate(() => {
      return {
        hasContent: document.body.innerHTML.trim().length > 0,
        contentLength: document.body.innerHTML.length,
        bodyText: document.body.innerText.substring(0, 200),
        title: document.title,
      }
    })

    console.log('🔍 Verificación de contenido de la página:', pageContent)

    if (!pageContent.hasContent) {
      console.warn('⚠️ El contenido de la página está vacío después de cargar')
    }

    // Generar el PDF con configuraciones optimizadas
    console.log('📄 Generando PDF...')
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
      preferCSSPageSize: true,
      displayHeaderFooter: false,
    })

    await browser.close()

    // Retornar el PDF como respuesta
    return new NextResponse(Buffer.from(pdf), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    console.error('❌ Error generating PDF:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
