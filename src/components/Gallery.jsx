import { ProductCard } from './ProductCard'
import { Loader2 } from 'lucide-react'

export function Gallery({ products, loading, error, onProductClick, onDeleteClick }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        <p className="mt-4 text-gray-500">Loading products…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-red-500 bg-red-50 px-6 py-4 rounded-lg">
          <p className="font-medium">Error loading products</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400 text-center">
        <p className="text-lg font-medium">No products found</p>
        <p className="text-sm mt-1">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => onProductClick(product)}
          onDelete={onDeleteClick}
        />
      ))}
    </div>
  )
}
