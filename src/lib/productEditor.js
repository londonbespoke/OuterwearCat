import { supabase } from './supabase'

export async function updateProduct(productId, updates) {
  const { data, error } = await supabase
    .from('products')
    .update({
      name: updates.name || null,
      sku: updates.sku || null,
      category: updates.category || null,
      subcategory: updates.subcategory || null,
      collection: updates.collection || null,
      catalog_slug: updates.catalog_slug || null,
      specifications: updates.specifications || null,
      tags: updates.tags || []
    })
    .eq('id', productId)
    .select()
    .single()

  if (error) throw error
  return data
}
