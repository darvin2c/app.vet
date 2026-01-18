'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isIndex = pathname === '/demo'

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center gap-4">
          {isIndex ? (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Ir al Inicio
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/demo">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Volver a Demos
              </Link>
            </Button>
          )}
          <div className="h-4 w-px bg-border" />
          <div className="font-semibold">App Vet Demos</div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
