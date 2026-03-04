import { X, ChevronDown, ChevronUp, Search } from 'lucide-react'
import { useState } from 'react'

function FilterSection({ title, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-2 text-left"
      >
        <span className="font-medium text-gray-900">{title}</span>
        {isOpen
          ? <ChevronUp className="w-4 h-4 text-gray-500" />
          : <ChevronDown className="w-4 h-4 text-gray-500" />}
      </button>
      {isOpen && <div className="mt-2">{children}</div>}
    </div>
  )
}

function CheckboxGroup({ options, selected, onToggle, maxVisible = 8 }) {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? options : options.slice(0, maxVisible)
  const hasMore = options.length > maxVisible

  return (
    <div className="space-y-2">
      {visible.map(option => (
        <label key={option} className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={() => onToggle(option)}
            className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
          />
          <span className="text-sm text-gray-700 group-hover:text-gray-900">
            {option}
          </span>
        </label>
      ))}
      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-gray-500 hover:text-gray-900 mt-1"
        >
          {showAll ? 'Show less' : `Show ${options.length - maxVisible} more`}
        </button>
      )}
    </div>
  )
}

export function FilterSidebar({
  filters,
  filterOptions,
  onToggleFilter,
  onUpdateFilter,
  onClearFilters,
  hasActiveFilters,
  isOpen,
  onClose,
  totalCount,
  filteredCount
}) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-80 bg-white border-r border-gray-200
        transform transition-transform duration-300 z-40 overflow-y-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-gray-900">Filters</h2>
              <p className="text-sm text-gray-500">
                Showing {filteredCount} of {totalCount} products
              </p>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or SKU…"
                value={filters.search}
                onChange={e => onUpdateFilter('search', e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="w-full mb-6 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Clear all filters
            </button>
          )}

          {filterOptions.categories.length > 0 && (
            <FilterSection title="Category">
              <CheckboxGroup
                options={filterOptions.categories}
                selected={filters.categories}
                onToggle={v => onToggleFilter('categories', v)}
              />
            </FilterSection>
          )}

          {filterOptions.subcategories.length > 0 && (
            <FilterSection title="Type">
              <CheckboxGroup
                options={filterOptions.subcategories}
                selected={filters.subcategories}
                onToggle={v => onToggleFilter('subcategories', v)}
              />
            </FilterSection>
          )}

          {filterOptions.tags.length > 0 && (
            <FilterSection title="Features" defaultOpen={false}>
              <CheckboxGroup
                options={filterOptions.tags}
                selected={filters.tags}
                onToggle={v => onToggleFilter('tags', v)}
                maxVisible={6}
              />
            </FilterSection>
          )}
        </div>
      </aside>
    </>
  )
}
