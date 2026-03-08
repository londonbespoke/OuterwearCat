import { useCatalogs } from '../hooks/useCatalogs'
import { CatalogCard } from '../components/CatalogCard'
import { Loader2 } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

const LBC_LOGO = 'https://images.squarespace-cdn.com/content/v1/6399f2e7e0cdcb3da2ac54b5/8b75dbdc-381a-462b-a743-c2f0ff407eed/TLBC+2018+Logo+%281%29.png?format=750w'

export function HomePage() {
  const { catalogs, loading, error } = useCatalogs()
  const { theme } = useTheme()

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-surface-base">
      {/* Hero section */}
      <div className="border-b border-border-subtle">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center animate-fade-in">
          <img
            src={LBC_LOGO}
            alt="The London Bespoke Club"
            className="h-20 w-auto mx-auto mb-8"
            style={theme === 'light' ? { filter: 'invert(1) brightness(0.25)' } : undefined}
          />
          <h2 className="text-4xl sm:text-5xl font-serif font-semibold tracking-tight text-text-primary">
            Product Catalog
          </h2>
          <div className="w-12 h-px bg-gold mx-auto mt-6 mb-4" />
          <p className="text-text-secondary text-sm uppercase tracking-[0.2em] max-w-xl mx-auto">
            Select a collection to browse
          </p>
        </div>
      </div>

      {/* Catalog grid */}
      <div className="max-w-6xl mx-auto px-6 py-14">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
            <p className="mt-4 text-text-muted">Loading catalogs...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-danger bg-danger/10 border border-danger/20 px-6 py-4 rounded-lg">
              <p className="font-medium">Error loading catalogs</p>
              <p className="text-sm mt-1 text-danger/80">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && catalogs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-text-muted">
            <p className="text-lg font-medium">No catalogs available yet</p>
          </div>
        )}

        {!loading && !error && catalogs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: '0.15s' }}>
            {catalogs.map(catalog => (
              <CatalogCard key={catalog.id} catalog={catalog} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
