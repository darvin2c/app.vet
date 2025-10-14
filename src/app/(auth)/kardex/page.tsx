'use client'

import PageBase from '@/components/page-base'
import { ProductMovementList } from '@/components/product-movements/product-movement-list'
import { SearchInput } from '@/components/ui/search-input'
import { Filters } from '@/components/ui/filters'
import { ButtonGroup } from '@/components/ui/button-group'
import { OrderBy } from '@/components/ui/order-by'
import { FilterConfig } from '@/types/filters.types'
import { OrderByConfig } from '@/types/order-by.types'
import { ProductSelect } from '@/components/products/product-select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Package, Activity } from 'lucide-react'
import useProductMovementList from '@/hooks/product-movements/use-product-movement-list'
import { useFilters } from '@/hooks/use-filters'
import { useMemo } from 'react'

export default function KardexPage() {
  // Configuración de filtros específicos para Kardex
  const filters: FilterConfig[] = [
    {
      key: 'product_id',
      field: 'product_id',
      type: 'custom',
      label: 'Producto',
      operator: 'eq',
      component: <ProductSelect placeholder="Seleccionar producto" />,
    },
    {
      key: 'source',
      field: 'source',
      type: 'select',
      label: 'Tipo de Movimiento',
      placeholder: 'Seleccionar tipo',
      operator: 'eq',
      options: [
        { label: 'Entrada', value: 'ENTRADA' },
        { label: 'Salida', value: 'SALIDA' },
        { label: 'Ajuste', value: 'AJUSTE' },
        { label: 'Compra', value: 'COMPRA' },
        { label: 'Venta', value: 'VENTA' },
        { label: 'Devolución', value: 'DEVOLUCION' },
        { label: 'Transferencia', value: 'TRANSFERENCIA' },
      ],
    },
    {
      key: 'date_range',
      field: 'created_at',
      type: 'dateRange',
      label: 'Rango de Fechas',
      placeholder: 'Seleccionar rango de fechas',
      operator: 'gte',
    },
    {
      key: 'quantity_type',
      field: 'quantity',
      type: 'select',
      label: 'Tipo de Movimiento',
      placeholder: 'Seleccionar tipo',
      operator: 'eq',
      options: [
        { label: 'Entradas', value: 'positive' },
        { label: 'Salidas', value: 'negative' },
        { label: 'Todos', value: 'all' },
      ],
    },
  ]

  const orderByConfig: OrderByConfig = {
    columns: [
      { field: 'created_at', label: 'Fecha', sortable: true },
      { field: 'quantity', label: 'Cantidad', sortable: true },
      { field: 'unit_cost', label: 'Costo Unitario', sortable: true },
      { field: 'source', label: 'Tipo', sortable: true },
    ],
  }

  // Obtener filtros aplicados para las métricas
  const { appliedFilters } = useFilters(filters)

  // Convertir filtros aplicados al formato esperado por el hook
  const movementFilters = useMemo(() => {
    const filterObj: any = {}

    appliedFilters.forEach((filter) => {
      if (filter.field === 'product_id' && filter.value) {
        filterObj.product_id = filter.value
      }
      if (filter.field === 'source' && filter.value) {
        filterObj.source = filter.value
      }
      if (filter.field === 'created_at' && filter.value) {
        if (Array.isArray(filter.value) && filter.value.length === 2) {
          filterObj.date_from = filter.value[0]
          filterObj.date_to = filter.value[1]
        }
      }
    })

    return filterObj
  }, [appliedFilters])

  // Obtener datos para métricas
  const { data: movements = [] } = useProductMovementList(movementFilters)

  // Calcular métricas básicas
  const metrics = useMemo(() => {
    const totalMovements = movements.length
    const entries = movements.filter((m) => m.quantity > 0)
    const exits = movements.filter((m) => m.quantity < 0)
    const adjustments = movements.filter((m) => m.quantity === 0)

    const totalEntries = entries.reduce((sum, m) => sum + m.quantity, 0)
    const totalExits = Math.abs(exits.reduce((sum, m) => sum + m.quantity, 0))

    const totalValue = movements.reduce((sum, m) => {
      return sum + (m.unit_cost ? m.unit_cost * Math.abs(m.quantity) : 0)
    }, 0)

    const uniqueProducts = new Set(movements.map((m) => m.product_id)).size

    return {
      totalMovements,
      totalEntries,
      totalExits,
      totalAdjustments: adjustments.length,
      totalValue,
      uniqueProducts,
      entriesCount: entries.length,
      exitsCount: exits.length,
    }
  }, [movements])

  return (
    <PageBase
      title="Kardex"
      subtitle="Control detallado de movimientos de inventario"
      search={
        <SearchInput
          hasSidebarTriggerLeft
          placeholder="Buscar por referencia o nota..."
          size="lg"
          suffix={
            <ButtonGroup>
              <Filters filters={filters} />
              <OrderBy config={orderByConfig} />
            </ButtonGroup>
          }
        />
      }
    >
      <div className="space-y-6">
        {/* Métricas Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Movimientos
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalMovements}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.uniqueProducts} productos únicos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Entradas</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                +{metrics.totalEntries.toFixed(0)}
              </div>
              <p className="text-xs text-muted-foreground">
                {metrics.entriesCount} movimientos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Salidas</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                -{metrics.totalExits.toFixed(0)}
              </div>
              <p className="text-xs text-muted-foreground">
                {metrics.exitsCount} movimientos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${metrics.totalValue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {metrics.totalAdjustments} ajustes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Indicadores adicionales */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-green-600 border-green-200">
            <TrendingUp className="h-3 w-3 mr-1" />
            Entradas: {metrics.entriesCount}
          </Badge>
          <Badge variant="outline" className="text-red-600 border-red-200">
            <TrendingDown className="h-3 w-3 mr-1" />
            Salidas: {metrics.exitsCount}
          </Badge>
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            <Activity className="h-3 w-3 mr-1" />
            Balance: {(metrics.totalEntries - metrics.totalExits).toFixed(0)}
          </Badge>
        </div>

        {/* Lista de movimientos */}
        <ProductMovementList
          filterConfig={filters}
          orderByConfig={orderByConfig}
        />
      </div>
    </PageBase>
  )
}
