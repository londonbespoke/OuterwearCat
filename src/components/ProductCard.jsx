import { Trash2 } from 'lucide-react'
import { useAdmin } from '../contexts/AdminContext'

export function ProductCard({ product, onClick, onDelete }) {
  const { isAdmin } = useAdmin()
  const imageUrl = product.cover_image_url

  return (
    <div
      onClick={onClick}
      className="group bg-surface-card rounded-xl cursor-pointer overflow-hidden border border-border-subtle hover:border-gold/40 transition-all duration-500 hover:-translate-y-1"
    >
      <div className="aspect-square relative overflow-hidden bg-surface-elevated">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted text-sm">
            No image
          </div>
        )}

        {product.product_images?.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-surface-base/70 backdrop-blur-sm text-gold-light text-xs px-2 py-1 rounded-full border border-gold/20">
            +{product.product_images.length - 1}
          </div>
        )}

        {isAdmin && (
          <button
            onClick={e => { e.stopPropagation(); onDelete(product) }}
            className="absolute top-2 right-2 p-2 bg-danger text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-danger/80 shadow-lg"
            title="Delete product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium text-text-primary text-sm mb-1 line-clamp-2">
          {product.name}
        </h3>
        {product.sku && (
          <p className="text-xs text-text-muted mb-2">{product.sku}</p>
        )}
        <div className="flex flex-wrap gap-1.5">
          {product.subcategory && (
            <span className="text-xs px-2 py-0.5 bg-gold/15 text-gold rounded-full">
              {product.subcategory}
            </span>
          )}
          {product.tags?.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="text-xs px-2 py-0.5 bg-surface-elevated text-text-secondary rounded-full border border-border-subtle">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
