'use client'

import PageBase from '@/components/page-base'
import { Pagination } from '@/components/ui/pagination'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useState } from 'react'
import { usePagination } from '@/components/ui/pagination/use-pagination'

// Mock data generator
const generateMockData = (page: number, pageSize: number) => {
  const start = (page - 1) * pageSize
  return Array.from({ length: pageSize }, (_, i) => ({
    id: start + i + 1,
    name: `Elemento ${start + i + 1}`,
    description: `Descripción del elemento ${start + i + 1}`,
    status: Math.random() > 0.5 ? 'Activo' : 'Inactivo',
  }))
}

// Function to get status badge classes to avoid hydration errors
const getStatusBadgeClasses = (status: string) => {
  return status === 'Activo'
    ? 'px-2 py-1 text-xs rounded-full bg-green-100 text-green-800'
    : 'px-2 py-1 text-xs rounded-full bg-red-100 text-red-800'
}

export default function PaginationDemoPage() {
  const {
    appliedPagination: { page, pageSize },
    paginationProps,
  } = usePagination()

  const [currentData, setCurrentData] = useState(() => generateMockData(page, pageSize))
  const totalItems = 125 // Total de elementos de ejemplo

  const handlePageChange = (nextPage: number, nextPageSize: number) => {
    setCurrentData(generateMockData(nextPage, nextPageSize))
    console.log('Página cambiada:', { page: nextPage, pageSize: nextPageSize })
  }

  return (
    <PageBase
      title="Demo de Paginación"
      subtitle="Componente de paginación reutilizable con estado en URL"
    >
      <div className="space-y-6">
        {/* Descripción */}
        <Card>
          <CardHeader>
            <CardTitle>Componente de Paginación</CardTitle>
            <CardDescription>
              Este componente utiliza nuqs para gestionar el estado de la
              paginación en la URL. Prueba a cambiar de página y observa cómo
              los parámetros de la URL se actualizan automáticamente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                ✓ Estado sincronizado con URL (params: page, pageSize)
              </p>
              <p className="text-sm text-muted-foreground">
                ✓ Diseño responsive (móvil/desktop)
              </p>
              <p className="text-sm text-muted-foreground">
                ✓ Botones de navegación intuitivos
              </p>
              <p className="text-sm text-muted-foreground">
                ✓ Información de página actual/total
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Lista de datos */}
        <Card>
          <CardHeader>
            <CardTitle>Datos Paginados</CardTitle>
            <CardDescription>
              Mostrando página actual con datos de ejemplo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentData.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <div className={getStatusBadgeClasses(item.status)}>
                    {item.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Componente de paginación */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Paginación</h3>
          <Pagination
            totalItems={totalItems}
            page={paginationProps.page}
            pageSize={paginationProps.pageSize}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Ejemplo con configuración personalizada */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">
            Paginación con Configuración Personalizada
          </h3>
          <CustomPaginationExample />
        </div>
      </div>
    </PageBase>
  )
}

function CustomPaginationExample() {
  const {
    appliedPagination: { page, pageSize },
    paginationProps,
  } = usePagination('customPage', 'customSize')

  const [currentData, setCurrentData] = useState(() => generateMockData(page, pageSize))

  const handlePageChange = (nextPage: number, nextPageSize: number) => {
    setCurrentData(generateMockData(nextPage, nextPageSize))
    console.log('Paginación personalizada:', { page: nextPage, pageSize: nextPageSize })
  }

  return (
    <Pagination
      totalItems={85}
      page={paginationProps.page}
      pageSize={paginationProps.pageSize}
      onPageChange={handlePageChange}
    />
  )
}
