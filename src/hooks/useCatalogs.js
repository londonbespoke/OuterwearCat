import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useCatalogs() {
  const [catalogs, setCatalogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        // Fetch active catalogs
        const { data: catalogData, error: catErr } = await supabase
          .from('catalogs')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })

        if (catErr) throw catErr

        // Fetch product counts per catalog_slug
        const { data: countData, error: countErr } = await supabase
          .rpc('get_catalog_product_counts')
          .select('*')

        // If the RPC doesn't exist, fall back to a manual count
        let counts = {}
        if (countErr || !countData) {
          const { data: products } = await supabase
            .from('products')
            .select('catalog_slug')
          if (products) {
            products.forEach(p => {
              if (p.catalog_slug) {
                counts[p.catalog_slug] = (counts[p.catalog_slug] || 0) + 1
              }
            })
          }
        } else {
          countData.forEach(r => { counts[r.catalog_slug] = r.count })
        }

        const enriched = (catalogData || []).map(cat => ({
          ...cat,
          productCount: counts[cat.slug] || 0
        }))

        setCatalogs(enriched)
      } catch (err) {
        console.error('Error fetching catalogs:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCatalogs()
  }, [])

  return { catalogs, loading, error }
}
