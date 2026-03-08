import { ProductCard } from './ProductCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PAGE_SIZE_OPTIONS } from '../hooks/useProducts'

function SkeletonCard() {
  return (
    <div className="bg-surface-card rounded-xl border border-border-subtle overflow-hidden">
      <div className="aspect-square animate-shimmer" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-surface-elevated rounded w-3/4" />
        <div className="h-3 bg-surface-elevated rounded w-1/2" />
        <div className="flex gap-1.5 mt-2">
          <div className="h-5 bg-surface-elevated rounded-full w-16" />
          <div className="h-5 bg-surface-elevated rounded-full w-12" />
        </div>
      </div>
    </div>
  )
}

export function Gallery({ products, loading, error, onProductClick, onDeleteClick, page, setPage, totalPages, totalCount, pageSize, changePageSize }) {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-danger bg-danger/10 border border-danger/20 px-6 py-4 rounded-lg">
          <p className="font-medium">Error loading products</p>
          <p className="text-sm mt-1 text-danger/80">{error}</p>
        </div>
      </div>
    )
  }

  if (!loading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-text-muted text-center">
        <p className="text-lg font-serif font-medium">No products found</p>
        <p className="text-sm mt-1">Try adjusting your filters</p>
      </div>
    )
  }

  const effectiveSize = pageSize === 'All' ? totalCount : pageSize
  const startItem = (page - 1) * effectiveSize + 1
  const endItem = Math.min(page * effectiveSize, totalCount)

  return (
    <div>
      {/* Results count + per-page selector */}
      <div className="flex items-center justify-between mb-4 h-8">
        <p className="text-sm text-text-muted">
          {!loading && totalCount > 0 && (
            <>Showing {startItem}--{endItem} of {totalCount} products</>
          )}
        </p>
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <span>Show</span>
          <select
            value={pageSize}
            onChange={e => changePageSize(e.target.value === 'All' ? 'All' : Number(e.target.value))}
            className="border border-border-subtle rounded-lg px-2 py-1 text-sm bg-surface-card text-text-primary hover:border-border-hover"
          >
            {PAGE_SIZE_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <span>per page</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
        {loading
          ? Array.from({ length: 24 }).map((_, i) => <SkeletonCard key={i} />)
          : products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => onProductClick(product)}
                onDelete={onDeleteClick}
              />
            ))
        }
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            disabled={page === 1}
            className="p-2 rounded-lg border border-border-subtle hover:border-gold/40 hover:text-gold disabled:opacity-30 disabled:cursor-not-allowed text-text-secondary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
            .reduce((acc, p, idx, arr) => {
              if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...')
              acc.push(p)
              return acc
            }, [])
            .map((p, idx) =>
              p === '...' ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-text-muted">...</span>
              ) : (
                <button
                  key={p}
                  onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    p === page
                      ? 'bg-gold text-surface-base'
                      : 'border border-border-subtle hover:border-gold/40 text-text-secondary hover:text-gold'
                  }`}
                >
                  {p}
                </button>
              )
            )}

          <button
            onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            disabled={page === totalPages}
            className="p-2 rounded-lg border border-border-subtle hover:border-gold/40 hover:text-gold disabled:opacity-30 disabled:cursor-not-allowed text-text-secondary transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
