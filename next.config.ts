import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['lvh.me', '*.lvh.me'],
  
  // Configuración para Puppeteer en Vercel
  experimental: {
    serverComponentsExternalPackages: ['puppeteer-core', '@sparticuz/chromium'],
  },
}

export default nextConfig
