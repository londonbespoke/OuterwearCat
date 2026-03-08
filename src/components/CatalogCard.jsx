import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export function CatalogCard({ catalog }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/${catalog.slug}`)}
      className="group cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      {/* Cover image */}
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
        {catalog.cover_image_url ? (
          <img
            src={catalog.cover_image_url}
            alt={catalog.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <span className="text-white/80 text-5xl font-bold tracking-tight">
              {catalog.name.charAt(0)}
            </span>
          </div>
        )}

        {/* Product count badge */}
        {catalog.productCount > 0 && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
            {catalog.productCount} products
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
            {catalog.name}
          </h3>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
        </div>
        {catalog.description && (
          <p className="mt-2 text-sm text-gray-500 line-clamp-2">
            {catalog.description}
          </p>
        )}
      </div>
    </div>
  )
}
