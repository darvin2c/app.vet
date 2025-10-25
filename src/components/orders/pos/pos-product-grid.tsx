'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
} from '@/components/ui/item'
import { Plus, Package, Tag } from 'lucide-react'
import useProductList from '@/hooks/products/use-products-list'
import useProductCategoryList from '@/hooks/product-categories/use-product-category-list'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import { Tables } from '@/types/supabase.types'

type Product = Tables<'products'>

export function POSProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const { addToCart } = usePOSStore()

  // Fetch products using existing hook
  const { data: products = [], isLoading: isLoadingProducts } = useProductList({
    search: '',
    filters: selectedCategory
      ? [
          {
            field: 'category_id',
            operator: 'eq',
            value: selectedCategory,
          },
        ]
      : [],
  })

  // Fetch categories using existing hook
  const { data: categories = [], isLoading: isLoadingCategories } =
    useProductCategoryList({})

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1)
  }

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
      <ScrollArea className="h-[calc(100vh-400px)]">
        <div className="space-y-2">
          <ItemGroup className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
            {filteredProducts.map((product) => (
              <ProductListItem
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
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
      </ScrollArea>
    </div>
  )
}

function ProductListItem({
  product,
  onAddToCart,
}: {
  product: Product
  onAddToCart: (product: Product) => void
}) {
  const isLowStock = product.stock <= 5

  return (
    <Item variant="outline" className="hover:bg-accent/50 transition-colors">
      {/* Product Image/Icon */}
      <ItemMedia variant="icon">
        <Package className="h-6 w-6 text-muted-foreground" />
      </ItemMedia>

      {/* Product Information */}
      <ItemContent>
        <ItemTitle className="text-base font-medium">{product.name}</ItemTitle>
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
        <div className="text-right">
          <p className="font-semibold text-lg">
            S/ {product.price?.toFixed(2) || '0.00'}
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => onAddToCart(product)}
          disabled={product.stock <= 0}
        >
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
