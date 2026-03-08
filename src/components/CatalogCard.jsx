import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export function CatalogCard({ catalog }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/${catalog.slug}`)}
      className="group cursor-pointer bg-surface-card rounded-2xl overflow-hidden border border-border-subtle hover:border-gold/40 transition-all duration-500 hover:-translate-y-1"
    >
      {/* Cover image */}
      <div className="aspect-[4/3] relative overflow-hidden bg-surface-elevated">
        {catalog.cover_image_url ? (
          <img
            src={catalog.cover_image_url}
            alt={catalog.name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-elevated to-surface-base">
            <span className="text-gold/60 text-5xl font-serif font-bold tracking-tight">
              {catalog.name.charAt(0)}
            </span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Product count badge */}
        {catalog.productCount > 0 && (
          <div className="absolute top-4 right-4 bg-surface-base/80 backdrop-blur-sm text-gold text-xs font-medium px-3 py-1.5 rounded-full border border-gold/20">
            {catalog.productCount} products
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-serif font-semibold text-text-primary group-hover:text-gold transition-colors duration-300">
            {catalog.name}
          </h3>
          <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-gold group-hover:translate-x-1 transition-all duration-300" />
        </div>
        {catalog.description && (
          <p className="mt-2 text-sm text-text-secondary line-clamp-2">
            {catalog.description}
          </p>
        )}
      </div>
    </div>
  )
}
