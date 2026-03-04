import { useEffect, useState, useMemo } from 'react'
import { X, Trash2, Pencil } from 'lucide-react'
import { ImageCarousel } from './ImageCarousel'
import { ImageLightbox } from './ImageLightbox'
import { EditProductModal } from './EditProductModal'
import { useAdmin } from '../contexts/AdminContext'

export function DetailModal({ product: initialProduct, onClose, onDelete, onUpdated }) {
  const { isAdmin } = useAdmin()
  const [product, setProduct] = useState(initialProduct)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [editOpen, setEditOpen] = useState(false)

  useEffect(() => { setProduct(initialProduct) }, [initialProduct])

  const allImageUrls = useMemo(() => {
    if (!product) return []
    return [
      product.cover_image_url,
      ...(product.product_images || []).map(img => img.image_url)
    ].filter(Boolean).filter((url, idx, arr) => arr.indexOf(url) === idx)
  }, [product])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !lightboxOpen && !editOpen) onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose, lightboxOpen, editOpen])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!product) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
          {/* Image section */}
          <div className="md:w-1/2 p-4 bg-gray-50">
            <ImageCarousel
              images={product.product_images}
              coverImageUrl={product.cover_image_url}
              onImageClick={(idx) => { setLightboxIndex(idx); setLightboxOpen(true) }}
            />
          </div>

          {/* Details section */}
          <div className="md:w-1/2 p-6 overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
                {product.sku && (
                  <p className="text-sm text-gray-400 mt-0.5">SKU: {product.sku}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {isAdmin && (
                  <>
                    <button
                      onClick={() => setEditOpen(true)}
                      className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDelete(product)}
                      className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                )}
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Category / Subcategory */}
              <div className="flex gap-2 flex-wrap">
                {product.category && (
                  <span className="px-3 py-1 bg-gray-900 text-white rounded-full text-sm">
                    {product.category}
                  </span>
                )}
                {product.subcategory && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {product.subcategory}
                  </span>
                )}
              </div>

              {/* Specifications */}
              {product.specifications && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Specifications
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="space-y-1">
                      {product.specifications.split('|').map((spec, idx) => (
                        <li key={idx} className="text-sm text-gray-700">
                          {spec.trim()}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Tags */}
              {product.tags?.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Features
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <ImageLightbox
          images={allImageUrls}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {editOpen && (
        <EditProductModal
          product={product}
          onClose={() => setEditOpen(false)}
          onSaved={(updated) => {
            setProduct({ ...product, ...updated })
            setEditOpen(false)
            onUpdated?.()
          }}
        />
      )}
    </div>
  )
}
