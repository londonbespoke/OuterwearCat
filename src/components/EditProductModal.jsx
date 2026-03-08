import { useState } from 'react'
import { X, Save, Loader2 } from 'lucide-react'
import { updateProduct } from '../lib/productEditor'

export function EditProductModal({ product, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: product.name || '',
    sku: product.sku || '',
    catalog_slug: product.catalog_slug || '',
    collection: product.collection || '',
    category: product.category || '',
    subcategory: product.subcategory || '',
    specifications: product.specifications || '',
    tagsRaw: (product.tags || []).join(', ')
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const { tagsRaw, ...fields } = form
      const updated = await updateProduct(product.id, {
        ...fields,
        tags: tagsRaw
          .split(',')
          .map(t => t.trim())
          .filter(Boolean)
      })
      onSaved(updated)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const field = (label, key, multiline = false) => (
    <div>
      <label className="block text-xs font-medium text-text-muted uppercase tracking-[0.15em] mb-1">{label}</label>
      {multiline ? (
        <textarea
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          rows={4}
          className="w-full px-3 py-2 bg-surface-base border border-border-subtle rounded-lg text-sm text-text-primary focus:border-gold/50"
        />
      ) : (
        <input
          type="text"
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          className="w-full px-3 py-2 bg-surface-base border border-border-subtle rounded-lg text-sm text-text-primary focus:border-gold/50"
        />
      )}
    </div>
  )

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80"
      onClick={onClose}
    >
      <div
        className="bg-surface-card rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-border-subtle animate-modal-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border-subtle">
          <h2 className="text-lg font-serif font-semibold text-text-primary">Edit Product</h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-elevated rounded-lg text-text-muted hover:text-text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {field('Product Name', 'name')}
          {field('SKU', 'sku')}
          {field('Catalog Slug', 'catalog_slug')}
          {field('Collection', 'collection')}
          {field('Category', 'category')}
          {field('Subcategory', 'subcategory')}
          {field('Specifications', 'specifications', true)}
          {field('Tags (comma-separated)', 'tagsRaw')}

          {error && (
            <p className="text-sm text-danger bg-danger/10 border border-danger/20 px-4 py-2 rounded-lg">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border-subtle text-text-secondary rounded-lg hover:bg-surface-elevated text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gold text-surface-base rounded-lg hover:bg-gold-light text-sm font-medium disabled:opacity-50 transition-colors"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
