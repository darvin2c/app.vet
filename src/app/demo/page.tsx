import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const demos = [
  {
    title: 'Avatar Uploader',
    description: 'Componente para subir y recortar imágenes de avatar.',
    href: '/demo/avatar-uploader',
  },
  {
    title: 'Data Import',
    description: 'Flujo de importación de datos desde archivos Excel/CSV.',
    href: '/demo/data-import',
  },
  {
    title: 'Form Sheet',
    description: 'Componente reutilizable para formularios en sheets laterales.',
    href: '/demo/form-sheet',
  },
  {
    title: 'Pagination',
    description: 'Componente de paginación para tablas y listas.',
    href: '/demo/pagination',
  },
  {
    title: 'Product Import',
    description: 'Ejemplo específico de importación de productos.',
    href: '/demo/product-import',
  },
]

export default function DemoPage() {
  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Demos de Componentes</h1>
        <p className="text-muted-foreground">
          Catálogo de componentes reutilizables y ejemplos de implementación.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {demos.map((demo) => (
          <Card key={demo.href} className="flex flex-col">
            <CardHeader>
              <CardTitle>{demo.title}</CardTitle>
              <CardDescription>{demo.description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto pt-4">
              <Button asChild className="w-full">
                <Link href={demo.href}>Ver Demo</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
