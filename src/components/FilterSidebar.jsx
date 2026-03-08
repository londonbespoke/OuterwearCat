import { X, ChevronDown, ChevronUp, Search } from 'lucide-react'
import { useState } from 'react'

function FilterSection({ title, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-border-subtle pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-2 text-left"
      >
        <span className="text-xs font-medium uppercase tracking-[0.15em] text-text-secondary">{title}</span>
        {isOpen
          ? <ChevronUp className="w-4 h-4 text-text-muted" />
          : <ChevronDown className="w-4 h-4 text-text-muted" />}
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
            className="w-4 h-4 rounded border-border-hover text-gold focus:ring-gold"
          />
          <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
            {option}
          </span>
        </label>
      ))}
      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-text-muted hover:text-gold mt-1 transition-colors"
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-80 bg-surface-elevated border-r border-border-subtle
        transform transition-transform duration-300 z-40 overflow-y-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif font-semibold text-text-primary">Filters</h2>
              <p className="text-sm text-text-muted">
                Showing {filteredCount} of {totalCount} products
              </p>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-surface-card rounded-lg text-text-muted hover:text-text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={filters.search}
                onChange={e => onUpdateFilter('search', e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-surface-card border border-border-subtle rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:border-gold/50"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="w-full mb-6 px-4 py-2 text-sm font-medium text-gold border border-gold/30 hover:bg-gold/10 rounded-lg transition-colors"
            >
              Clear all filters
            </button>
          )}

          {filterOptions.collections.length > 0 && (
            <FilterSection title="Collection">
              <CheckboxGroup
                options={filterOptions.collections}
                selected={filters.collections}
                onToggle={v => onToggleFilter('collections', v)}
              />
            </FilterSection>
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
