import { NextRequest, NextResponse } from 'next/server'
import puppeteerCore from 'puppeteer-core'
import puppeteer from 'puppeteer'
import chromium from '@sparticuz/chromium'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

async function getBrowser() {
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production') {
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
    const { html, filename = 'document.pdf' } = await request.json()

    if (!html) {
      return NextResponse.json(
        { error: 'HTML content is required' },
        { status: 400 }
      )
    }

    const browser = await getBrowser()
    const page = await browser.newPage()

    // Configurar el viewport para mejor renderizado
    await page.setViewport({ width: 1200, height: 800 })

    // Cargar el HTML content
    await page.setContent(html, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    })

    // Generar el PDF con configuraciones optimizadas
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
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}