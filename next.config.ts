import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['lvh.me', '*.lvh.me'],
  serverExternalPackages: ['puppeteer-core', '@sparticuz/chromium'],
}

export default nextConfig
