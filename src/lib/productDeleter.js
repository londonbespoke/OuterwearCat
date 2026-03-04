import { supabase } from './supabase'

export async function deleteProduct(productId) {
  // Delete product_images rows (cascade will handle it but be explicit)
  await supabase
    .from('product_images')
    .delete()
    .eq('product_id', productId)

  // Delete product
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)

  if (error) throw error
  return true
}
