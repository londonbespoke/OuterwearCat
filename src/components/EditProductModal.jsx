import { useState } from 'react'
import { X, Save, Loader2 } from 'lucide-react'
import { updateProduct } from '../lib/productEditor'

export function EditProductModal({ product, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: product.name || '',
    sku: product.sku || '',
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
      const updated = await updateProduct(product.id, {
        ...form,
        tags: form.tagsRaw
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
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {multiline ? (
        <textarea
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      ) : (
        <input
          type="text"
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      )}
    </div>
  )

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Edit Product</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {field('Product Name', 'name')}
          {field('SKU', 'sku')}
          {field('Category', 'category')}
          {field('Subcategory', 'subcategory')}
          {field('Specifications', 'specifications', true)}
          {field('Tags (comma-separated)', 'tagsRaw')}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
