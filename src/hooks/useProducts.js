import { useState, useEffect, useMemo, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export const PAGE_SIZE_OPTIONS = [24, 48, 96, 'All']

export function useProducts() {
  // Lightweight metadata for sidebar filter options (fetched once, no images)
  const [filterMeta, setFilterMeta] = useState([])

  // Current page of products (server-paginated)
  const [products, setProducts] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(24)

  const [filters, setFilters] = useState({
    categories: [],
    subcategories: [],
    tags: [],
    search: ''
  })

  // Fetch lightweight filter metadata once on mount
  useEffect(() => {
    supabase
      .from('products')
      .select('category, subcategory, tags')
      .then(({ data }) => setFilterMeta(data || []))
  }, [])

  // Fetch current page whenever page or filters change
  const fetchPage = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const effectiveSize = pageSize === 'All' ? 10000 : pageSize
      const start = (page - 1) * effectiveSize
      const end = start + effectiveSize - 1

      let query = supabase
        .from('products')
        .select(
          'id, name, sku, category, subcategory, specifications, tags, cover_image_url',
          { count: 'exact' }
        )
        .order('name', { ascending: true })
        .range(start, end)

      if (filters.categories.length > 0) {
        query = query.in('category', filters.categories)
      }
      if (filters.subcategories.length > 0) {
        query = query.in('subcategory', filters.subcategories)
      }
      if (filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags)
      }
      if (filters.search.trim()) {
        const q = filters.search.trim()
        query = query.or(
          `name.ilike.%${q}%,sku.ilike.%${q}%,specifications.ilike.%${q}%`
        )
      }

      const { data, error: fetchError, count } = await query
      if (fetchError) throw fetchError

      setProducts(data || [])
      setTotalCount(count ?? 0)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, filters])

  useEffect(() => {
    fetchPage()
  }, [fetchPage])

  // Derive filter options from the lightweight metadata
  const filterOptions = useMemo(() => {
    const categories = new Set()
    const subcategories = new Set()
    const tags = new Set()

    filterMeta.forEach(p => {
      if (p.category) categories.add(p.category)
      if (p.subcategory) subcategories.add(p.subcategory)
      p.tags?.forEach(t => tags.add(t))
    })

    return {
      categories: Array.from(categories).sort(),
      subcategories: Array.from(subcategories).sort(),
      tags: Array.from(tags).sort()
    }
  }, [filterMeta])

  const effectiveSize = pageSize === 'All' ? 10000 : pageSize
  const totalPages = Math.max(1, Math.ceil(totalCount / effectiveSize))

  const toggleArrayFilter = (key, value) => {
    setPage(1)
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
    setPage(1)
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const changePageSize = (size) => {
    setPage(1)
    setPageSize(size)
  }

  const clearFilters = () => {
    setPage(1)
    setFilters({ categories: [], subcategories: [], tags: [], search: '' })
  }

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.subcategories.length > 0 ||
    filters.tags.length > 0 ||
    filters.search !== ''

  return {
    products,
    loading,
    error,
    filters,
    filterOptions,
    totalCount,
    allProductCount: filterMeta.length,
    toggleArrayFilter,
    updateFilter,
    clearFilters,
    hasActiveFilters,
    page,
    setPage,
    pageSize,
    changePageSize,
    totalPages,
    refetch: fetchPage
  }
}
