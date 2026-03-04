import { useState } from 'react'
import { Header } from './components/Header'
import { FilterSidebar } from './components/FilterSidebar'
import { Gallery } from './components/Gallery'
import { DetailModal } from './components/DetailModal'
import { AdminLoginModal } from './components/AdminLoginModal'
import { DeleteConfirmModal } from './components/DeleteConfirmModal'
import { AdminProvider } from './contexts/AdminContext'
import { useProducts } from './hooks/useProducts'

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)

  const handleDeleteClick = (product) => {
    setSelectedProduct(null)
    setProductToDelete(product)
  }

  const {
    products,
    allProducts,
    filteredProducts,
    loading,
    error,
    filters,
    filterOptions,
    updateFilter,
    toggleArrayFilter,
    clearFilters,
    hasActiveFilters,
    page,
    setPage,
    totalPages,
    totalCount,
    refetch
  } = useProducts()

  return (
    <AdminProvider>
      <div className="min-h-screen bg-gray-50">
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          isMenuOpen={sidebarOpen}
          onAdminClick={() => setShowAdminLogin(true)}
        />

        <div className="flex">
          <FilterSidebar
            filters={filters}
            filterOptions={filterOptions}
            onToggleFilter={toggleArrayFilter}
            onUpdateFilter={updateFilter}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            totalCount={allProducts.length}
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

        <AdminLoginModal
          isOpen={showAdminLogin}
          onClose={() => setShowAdminLogin(false)}
        />

        <DeleteConfirmModal
          product={productToDelete}
          onClose={() => setProductToDelete(null)}
          onDeleted={refetch}
        />
      </div>
    </AdminProvider>
  )
}

export default App
