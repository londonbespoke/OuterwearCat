import { useEffect, useState, useMemo } from 'react'
import { X, Trash2, Pencil, Loader2 } from 'lucide-react'
import { ImageCarousel } from './ImageCarousel'
import { ImageLightbox } from './ImageLightbox'
import { EditProductModal } from './EditProductModal'
import { useAdmin } from '../contexts/AdminContext'
import { supabase } from '../lib/supabase'

export function DetailModal({ product: initialProduct, onClose, onDelete, onUpdated }) {
  const { isAdmin } = useAdmin()
  const [product, setProduct] = useState(initialProduct)
  const [productImages, setProductImages] = useState([])
  const [imagesLoading, setImagesLoading] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [editOpen, setEditOpen] = useState(false)

  useEffect(() => { setProduct(initialProduct) }, [initialProduct])

  // Fetch images lazily when modal opens
  useEffect(() => {
    if (!initialProduct?.id) return
    setImagesLoading(true)
    supabase
      .from('product_images')
      .select('id, image_url, position')
      .eq('product_id', initialProduct.id)
      .order('position', { ascending: true })
      .then(({ data }) => {
        setProductImages(data || [])
        setImagesLoading(false)
      })
  }, [initialProduct?.id])

  const allImageUrls = useMemo(() => {
    const urls = [
      product.cover_image_url,
      ...productImages.map(img => img.image_url)
    ].filter(Boolean)
    // Deduplicate
    return [...new Set(urls)]
  }, [product, productImages])

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      onClick={onClose}
    >
      <div
        className="bg-surface-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-border-subtle animate-modal-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
          {/* Image section */}
          <div className="md:w-1/2 p-4 bg-surface-base flex items-center justify-center">
            {imagesLoading ? (
              <div className="flex flex-col items-center gap-2 text-text-muted">
                <Loader2 className="w-6 h-6 animate-spin text-gold" />
                <span className="text-sm">Loading images...</span>
              </div>
            ) : (
              <ImageCarousel
                images={productImages}
                coverImageUrl={product.cover_image_url}
                onImageClick={(idx) => { setLightboxIndex(idx); setLightboxOpen(true) }}
              />
            )}
          </div>

          {/* Details section */}
          <div className="md:w-1/2 p-6 overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-serif font-semibold text-text-primary">{product.name}</h2>
                {product.sku && (
                  <p className="text-sm text-text-muted mt-0.5">SKU: {product.sku}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {isAdmin && (
                  <>
                    <button
                      onClick={() => setEditOpen(true)}
                      className="p-2 bg-gold/10 text-gold hover:bg-gold/20 rounded-lg transition-colors"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDelete(product)}
                      className="p-2 bg-danger/10 text-danger hover:bg-danger/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                )}
                <button onClick={onClose} className="p-2 hover:bg-surface-elevated rounded-lg text-text-muted hover:text-text-primary transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Category / Subcategory */}
              <div className="flex gap-2 flex-wrap">
                {product.category && (
                  <span className="px-3 py-1 bg-gold/15 text-gold rounded-full text-sm">
                    {product.category}
                  </span>
                )}
                {product.subcategory && (
                  <span className="px-3 py-1 bg-surface-elevated text-text-secondary rounded-full text-sm border border-border-subtle">
                    {product.subcategory}
                  </span>
                )}
              </div>

              {/* Specifications */}
              {product.specifications && (
                <div>
                  <h3 className="text-xs font-medium text-text-muted uppercase tracking-[0.15em] mb-2">
                    Specifications
                  </h3>
                  <div className="bg-surface-base rounded-lg p-4 border border-border-subtle">
                    <ul className="space-y-1">
                      {product.specifications.split('|').map((spec, idx) => (
                        <li key={idx} className="text-sm text-text-secondary">
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
                  <h3 className="text-xs font-medium text-text-muted uppercase tracking-[0.15em] mb-2">
                    Features
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-surface-elevated text-text-secondary rounded-full text-sm border border-border-subtle">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Image count */}
              {!imagesLoading && allImageUrls.length > 1 && (
                <p className="text-xs text-text-muted">{allImageUrls.length} photos available</p>
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
