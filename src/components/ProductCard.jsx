import { Trash2 } from 'lucide-react'
import { useAdmin } from '../contexts/AdminContext'

export function ProductCard({ product, onClick, onDelete }) {
  const { isAdmin } = useAdmin()
  const imageUrl = product.cover_image_url

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100"
    >
      <div className="aspect-square relative overflow-hidden bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}

        {product.product_images?.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            +{product.product_images.length - 1}
          </div>
        )}

        {isAdmin && (
          <button
            onClick={e => { e.stopPropagation(); onDelete(product) }}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
            title="Delete product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
          {product.name}
        </h3>
        {product.sku && (
          <p className="text-xs text-gray-400 mb-2">{product.sku}</p>
        )}
        <div className="flex flex-wrap gap-1.5">
          {product.subcategory && (
            <span className="text-xs px-2 py-0.5 bg-gray-900 text-white rounded-full">
              {product.subcategory}
            </span>
          )}
          {product.tags?.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
