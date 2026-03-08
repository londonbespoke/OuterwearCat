import { useState } from 'react'
import { X, Trash2, Loader2 } from 'lucide-react'
import { deleteProduct } from '../lib/productDeleter'

export function DeleteConfirmModal({ product, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  if (!product) return null

  const handleDelete = async () => {
    setLoading(true)
    setError(null)
    try {
      await deleteProduct(product.id)
      onDeleted()
      onClose()
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={onClose}>
      <div className="bg-surface-card rounded-2xl w-full max-w-sm border border-border-subtle animate-modal-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-border-subtle">
          <h2 className="font-serif font-semibold text-text-primary">Delete Product</h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-elevated rounded-lg text-text-muted hover:text-text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-text-secondary">
            Are you sure you want to delete <strong className="text-text-primary">{product.name}</strong>? This cannot be undone.
          </p>
          {error && <p className="text-sm text-danger bg-danger/10 border border-danger/20 px-4 py-2 rounded-lg">{error}</p>}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border-subtle text-text-secondary rounded-lg hover:bg-surface-elevated text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/80 text-sm disabled:opacity-50 transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
