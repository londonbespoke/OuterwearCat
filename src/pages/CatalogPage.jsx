import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { FilterSidebar } from '../components/FilterSidebar'
import { Gallery } from '../components/Gallery'
import { DetailModal } from '../components/DetailModal'
import { DeleteConfirmModal } from '../components/DeleteConfirmModal'
import { useProducts } from '../hooks/useProducts'

export function CatalogPage() {
  const { catalogSlug } = useParams()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)

  const handleDeleteClick = (product) => {
    setSelectedProduct(null)
    setProductToDelete(product)
  }

  const {
    products,
    loading,
    error,
    filters,
    filterOptions,
    updateFilter,
    toggleArrayFilter,
    clearFilters,
    hasActiveFilters,
    totalCount,
    allProductCount,
    page,
    setPage,
    pageSize,
    changePageSize,
    totalPages,
    refetch
  } = useProducts(catalogSlug)

  return (
    <>
      <div className="flex min-h-[calc(100vh-4rem)] bg-surface-base">
        <FilterSidebar
          filters={filters}
          filterOptions={filterOptions}
          onToggleFilter={toggleArrayFilter}
          onUpdateFilter={updateFilter}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          totalCount={allProductCount}
          filteredCount={totalCount}
        />

        <main className="flex-1 p-6 lg:ml-0">
          <div className="max-w-7xl mx-auto">
            <Gallery
              products={products}
              loading={loading}
              error={error}
              onProductClick={setSelectedProduct}
              onDeleteClick={handleDeleteClick}
              page={page}
              setPage={setPage}
              pageSize={pageSize}
              changePageSize={changePageSize}
              totalPages={totalPages}
              totalCount={totalCount}
            />
          </div>
        </main>
      </div>

      {selectedProduct && (
        <DetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onDelete={handleDeleteClick}
          onUpdated={refetch}
        />
      )}

      <DeleteConfirmModal
        product={productToDelete}
        onClose={() => setProductToDelete(null)}
        onDeleted={refetch}
      />
    </>
  )
}
