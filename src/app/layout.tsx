import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import 'react-image-crop/dist/ReactCrop.css'
import ReactQueryProvider from '@/providers/react-query'
import { Toaster } from '@/components/ui/sonner'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
// Configurar dayjs globalmente
import '@/lib/dayjs'
import { ThemeProvider } from '@/providers/theme-provider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'VetManager 360 - Sistema de Gestión Veterinaria',
    template: '%s | VetManager 360',
  },
  description:
    'Sistema integral de gestión veterinaria para clínicas y hospitales veterinarios. Gestiona citas, historiales médicos, inventario, facturación y más en una plataforma unificada.',
  keywords: [
    'veterinaria',
    'gestión veterinaria',
    'clínica veterinaria',
    'hospital veterinario',
    'sistema veterinario',
    'mascotas',
    'citas veterinarias',
    'historial médico',
    'inventario veterinario',
    'facturación veterinaria',
    'SaaS veterinario',
  ],
  authors: [{ name: 'VetManager 360' }],
  creator: 'VetManager 360',
  applicationName: 'VetManager 360',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    title: 'VetManager 360 - Sistema de Gestión Veterinaria',
    description:
      'Sistema integral de gestión veterinaria para clínicas y hospitales veterinarios.',
    siteName: 'VetManager 360',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VetManager 360 - Sistema de Gestión Veterinaria',
    description:
      'Sistema integral de gestión veterinaria para clínicas y hospitales veterinarios.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NuqsAdapter>
            <ReactQueryProvider>{children}</ReactQueryProvider>
          </NuqsAdapter>
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
