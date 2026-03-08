import { useCatalogs } from '../hooks/useCatalogs'
import { CatalogCard } from '../components/CatalogCard'
import { Loader2 } from 'lucide-react'

export function HomePage() {
  const { catalogs, loading, error } = useCatalogs()

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      {/* Hero section */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-6">
            <span className="text-gray-900 font-bold text-2xl">LBC</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Product Catalog
          </h2>
          <p className="mt-3 text-gray-400 text-lg max-w-xl mx-auto">
            Select a collection to browse
          </p>
        </div>
      </div>

      {/* Catalog grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            <p className="mt-4 text-gray-500">Loading catalogs...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-red-500 bg-red-50 px-6 py-4 rounded-lg">
              <p className="font-medium">Error loading catalogs</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && catalogs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <p className="text-lg font-medium">No catalogs available yet</p>
          </div>
        )}

        {!loading && !error && catalogs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {catalogs.map(catalog => (
              <CatalogCard key={catalog.id} catalog={catalog} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
