'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Search, 
  Plus, 
  Package, 
  Tag,
  Grid3X3,
  List,
  Filter
} from 'lucide-react'
import useProductList from '@/hooks/products/use-products-list'
import useProductCategoryList from '@/hooks/product-categories/use-product-category-list'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import { useDebounce } from '@/hooks/use-debounce'
import { Tables } from '@/types/supabase.types'

type Product = Tables<'products'>
type ProductCategory = Tables<'product_categories'>

type ViewMode = 'grid' | 'list'

export function POSProductGrid() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  
  const debouncedSearch = useDebounce(search, 300)
  const { addToCart } = usePOSStore()
  
  // Fetch products using existing hook
  const { data: products = [], isLoading: isLoadingProducts } = useProductList({
    search: debouncedSearch,
    filters: selectedCategory ? [{ field: 'product_category_id', operator: 'eq', value: selectedCategory }] : [],
  })
  
  // Fetch categories using existing hook
  const { data: categories = [], isLoading: isLoadingCategories } = useProductCategoryList({})

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1)
  }

  const filteredProducts = useMemo(() => {
    return products.filter(product => product.stock > 0)
  }, [products])

  if (isLoadingProducts && !products.length) {
    return <ProductCatalogSkeleton />
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar productos por nombre, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === '' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('')}
            className="min-h-[40px] whitespace-nowrap"
          >
            <Package className="h-4 w-4 mr-2" />
            Todos
          </Button>
          
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="min-h-[40px] whitespace-nowrap"
              style={{
                backgroundColor: selectedCategory === category.id
                  ? 'rgb(59 130 246)'
                  : 'transparent',
              }}
            >
              <Tag className="h-4 w-4 mr-2" />
              {category.name}
            </Button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {filteredProducts.length} productos disponibles
          </div>
          
          <div className="flex gap-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="min-h-[40px] min-w-[40px]"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="min-h-[40px] min-w-[40px]"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      <ScrollArea className="h-[calc(100vh-400px)]">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredProducts.map((product) => (
              <ProductListItem
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
        
        {filteredProducts.length === 0 && !isLoadingProducts && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-600">
              {search || selectedCategory 
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'No hay productos disponibles en este momento'
              }
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

function ProductCard({ 
  product, 
  onAddToCart 
}: { 
  product: Product
  onAddToCart: (product: Product) => void 
}) {
  const isLowStock = product.stock <= 5

  return (
    <Card className="group hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-3">
        {/* Product Image Placeholder */}
        <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
          <Package className="h-8 w-8 text-gray-400" />
        </div>
        
        {/* Product Info */}
        <div className="space-y-2">
          <div>
            <h4 className="font-medium text-sm sm:text-base line-clamp-2 min-h-[2.5rem]">
              {product.name}
            </h4>
            {product.sku && (
              <p className="text-xs text-gray-500">SKU: {product.sku}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <p className="font-semibold text-base sm:text-lg">
              S/ {product.price?.toFixed(2) || '0.00'}
            </p>
            <Badge 
              variant={isLowStock ? 'destructive' : 'secondary'}
              className="text-xs w-full justify-center"
            >
              Stock: {product.stock}
            </Badge>
          </div>
          
          <Button
            size="sm"
            onClick={() => onAddToCart(product)}
            disabled={product.stock <= 0}
            className="w-full min-h-[44px] sm:min-h-[48px] text-sm sm:text-base"
          >
            <Plus className="h-4 w-4 mr-1" />
            Agregar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function ProductListItem({ 
  product, 
  onAddToCart 
}: { 
  product: Product
  onAddToCart: (product: Product) => void 
}) {
  const isLowStock = product.stock <= 5

  return (
    <Card className="group hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Product Image Placeholder */}
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Package className="h-6 w-6 text-gray-400" />
          </div>
          
          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-base truncate">
                  {product.name}
                </h4>
                {product.sku && (
                  <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <Badge 
                    variant={isLowStock ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    Stock: {product.stock}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-3 ml-4">
                <div className="text-right">
                  <p className="font-semibold text-lg">
                    S/ {product.price?.toFixed(2) || '0.00'}
                  </p>
                </div>
                
                <Button
                  size="sm"
                  onClick={() => onAddToCart(product)}
                  disabled={product.stock <= 0}
                  className="min-h-[44px] sm:min-h-[48px] min-w-[100px] sm:min-w-[120px] text-sm sm:text-base"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-3">
              <Skeleton className="aspect-square mb-3" />
              <Skeleton className="h-4 mb-2" />
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-6 w-20 mb-2" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}