'use client'

import useProductCategoryList from '@/hooks/product-categories/use-product-category-list'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useState, useMemo } from 'react'
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
} from '@/components/ui/item'
import { Plus, Package, Tag, Stethoscope } from 'lucide-react'
import useProductList from '@/hooks/products/use-products-list'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import { Tables } from '@/types/supabase.types'
import { usePagination } from '@/components/ui/pagination'
import { CurrencyDisplay } from '@/components/ui/current-input'

type Product = Tables<'products'>

export function POSProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const { appliedPagination } = usePagination()
  const { searchQuery } = usePOSStore()

  // Fetch products using existing hook
  const { data, isLoading: isLoadingProducts } = useProductList({
    search: searchQuery,
    filters: selectedCategory
      ? [
          {
            field: 'category_id',
            operator: 'eq',
            value: selectedCategory,
          },
        ]
      : [],
    pagination: appliedPagination,
  })
  const products = data?.data || []

  // Fetch categories using existing hook
  const { data: categoryData, isLoading: isLoadingCategories } =
    useProductCategoryList({})
  const categories = categoryData?.data || []

  const filteredProducts = useMemo(() => {
    return products
  }, [products])

  if (isLoadingProducts && !products.length) {
    return <ProductCatalogSkeleton />
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="space-y-3">
        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === '' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('')}
          >
            <Package className="h-4 w-4" />
            Todos
          </Button>

          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
            >
              <Tag className="h-4 w-4" />
              {category.name}
            </Button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {filteredProducts.length} productos disponibles
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      {/*<ScrollArea className="h-[calc(100vh-300px)]">*/}
      <div className="space-y-2">
        <ItemGroup className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
          {filteredProducts.map((product) => (
            <ProductListItem key={product.id} product={product} />
          ))}
        </ItemGroup>
      </div>

      {filteredProducts.length === 0 && !isLoadingProducts && (
        <div>
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron productos
          </h3>
          <p className="text-gray-600">
            {selectedCategory
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'No hay productos disponibles en este momento'}
          </p>
        </div>
      )}
      {/*</ScrollArea>*/}
    </div>
  )
}

function ProductListItem({ product }: { product: Product }) {
  const isLowStock = product.stock <= 5
  const { addProductToOrder } = usePOSStore()

  return (
    <Item
      size="sm"
      variant="outline"
      className="hover:bg-accent/50 transition-colors"
    >
      {/* Product Image/Icon */}
      <ItemMedia variant="icon">
        {product.is_service ? (
          <Package className="h-6 w-6 text-muted-foreground" />
        ) : (
          <Stethoscope className="h-6 w-6 text-muted-foreground" />
        )}
      </ItemMedia>

      {/* Product Information */}
      <ItemContent>
        <ItemTitle className="w-full flex justify-between items-center">
          <div className="text-base font-medium">{product.name}</div>
          <div>
            <CurrencyDisplay value={product.price} />
          </div>
        </ItemTitle>
        <ItemDescription>
          {product.sku && (
            <span className="text-muted-foreground">SKU: {product.sku}</span>
          )}
          {product.sku && <span className="mx-2">•</span>}
          <Badge
            variant={isLowStock ? 'secondary' : 'secondary'}
            className="text-xs"
          >
            Stock: {product.stock}
          </Badge>
        </ItemDescription>
      </ItemContent>

      {/* Price and Add Button */}
      <ItemActions className="flex-col sm:flex-row gap-2">
        <Button onClick={() => addProductToOrder(product)}>
          <Plus className="h-4 w-4 mr-1" />
        </Button>
      </ItemActions>
    </Item>
  )
}

function ProductCatalogSkeleton() {
  return (
    <div className="space-y-4">
      {/* Search Skeleton */}
      <Skeleton className="h-12 w-full" />

      {/* Category Filters Skeleton */}
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-20" />
        ))}
      </div>

      {/* Products Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <Item key={i}>
            <Skeleton className="aspect-square mb-3" />
            <Skeleton className="h-4 mb-2" />
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-6 w-20 mb-2" />
            <Skeleton className="h-10 w-full" />
          </Item>
        ))}
      </div>
    </div>
  )
}
