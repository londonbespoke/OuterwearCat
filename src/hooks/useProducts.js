import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase'

export function useProducts() {
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    categories: [],
    subcategories: [],
    tags: [],
    search: ''
  })

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select(`
          *,
          product_images (
            id,
            image_url,
            position
          )
        `)
        .order('name', { ascending: true })

      if (fetchError) throw fetchError

      const sorted = data?.map(product => ({
        ...product,
        product_images: product.product_images?.sort((a, b) => a.position - b.position) || []
      }))

      setAllProducts(sorted || [])
    } catch (err) {
      console.error('Error fetching products:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Derive filter options from data
  const filterOptions = useMemo(() => {
    const categories = new Set()
    const subcategories = new Set()
    const tags = new Set()

    allProducts.forEach(p => {
      if (p.category) categories.add(p.category)
      if (p.subcategory) subcategories.add(p.subcategory)
      p.tags?.forEach(t => tags.add(t))
    })

    return {
      categories: Array.from(categories).sort(),
      subcategories: Array.from(subcategories).sort(),
      tags: Array.from(tags).sort()
    }
  }, [allProducts])

  // Apply filters
  const products = useMemo(() => {
    return allProducts.filter(p => {
      if (filters.categories.length > 0 && !filters.categories.includes(p.category)) return false
      if (filters.subcategories.length > 0 && !filters.subcategories.includes(p.subcategory)) return false
      if (filters.tags.length > 0) {
        const hasTag = p.tags?.some(t => filters.tags.includes(t))
        if (!hasTag) return false
      }
      if (filters.search) {
        const q = filters.search.toLowerCase()
        const inName = p.name?.toLowerCase().includes(q)
        const inSku = p.sku?.toLowerCase().includes(q)
        const inSpecs = p.specifications?.toLowerCase().includes(q)
        if (!inName && !inSku && !inSpecs) return false
      }
      return true
    })
  }, [allProducts, filters])

  const toggleArrayFilter = (key, value) => {
    setFilters(prev => {
      const current = prev[key]
      return {
        ...prev,
        [key]: current.includes(value)
          ? current.filter(v => v !== value)
          : [...current, value]
      }
    })
  }

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({ categories: [], subcategories: [], tags: [], search: '' })
  }

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.subcategories.length > 0 ||
    filters.tags.length > 0 ||
    filters.search !== ''

  return {
    products,
    allProducts,
    loading,
    error,
    filters,
    filterOptions,
    toggleArrayFilter,
    updateFilter,
    clearFilters,
    hasActiveFilters,
    refetch: fetchProducts
  }
}
