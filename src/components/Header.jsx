import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Lock, LogOut, ArrowLeft, Sun, Moon } from 'lucide-react'
import { useAdmin } from '../contexts/AdminContext'
import { useTheme } from '../contexts/ThemeContext'
import { supabase } from '../lib/supabase'
import { APP_VERSION } from '../lib/version'

const LBC_LOGO = 'https://images.squarespace-cdn.com/content/v1/6399f2e7e0cdcb3da2ac54b5/8b75dbdc-381a-462b-a743-c2f0ff407eed/TLBC+2018+Logo+%281%29.png?format=500w'

export function Header({ onMenuClick, isMenuOpen, onAdminClick }) {
  const { isAdmin, logout } = useAdmin()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'
  // Parse catalog slug from URL since Header is outside <Routes>
  const segments = location.pathname.split('/').filter(Boolean)
  const catalogSlug = segments.length === 1 ? segments[0] : null
  const [catalogName, setCatalogName] = useState('')

  // Fetch catalog name when on a catalog page
  useEffect(() => {
    if (!catalogSlug) { setCatalogName(''); return }
    supabase
      .from('catalogs')
      .select('name')
      .eq('slug', catalogSlug)
      .single()
      .then(({ data }) => setCatalogName(data?.name || ''))
  }, [catalogSlug])

  return (
    <header className="bg-surface-base/80 backdrop-blur-xl text-text-primary border-b border-border-subtle sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {!isHome && (
              <>
                <button
                  onClick={() => navigate('/')}
                  className="p-2 hover:bg-surface-elevated rounded-lg transition-colors duration-200 text-text-secondary hover:text-gold"
                  aria-label="Back to catalogs"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={onMenuClick}
                  className="lg:hidden p-2 hover:bg-surface-elevated rounded-lg transition-colors duration-200 text-text-secondary hover:text-gold"
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </>
            )}

            <div
              className={`flex items-center gap-3 ${!isHome ? 'cursor-pointer' : ''}`}
              onClick={!isHome ? () => navigate('/') : undefined}
            >
              <img
                src={LBC_LOGO}
                alt="The London Bespoke Club"
                className="h-10 w-auto shrink-0"
                style={theme === 'light' ? { filter: 'invert(1) brightness(0.25)' } : undefined}
              />
              <div>
                <h1 className="text-sm font-serif font-semibold tracking-tight">
                  {isHome ? 'Product Catalog' : (catalogName || 'Loading...')}
                </h1>
                <p className="text-xs text-text-muted hidden sm:block tracking-wide">
                  {`v${APP_VERSION}`}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 border border-border-subtle hover:border-gold/50 hover:text-gold rounded-lg transition-colors duration-200 text-text-muted"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {isAdmin ? (
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 bg-danger/10 text-danger border border-danger/30 rounded-lg hover:bg-danger/20 transition-colors duration-200 text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Exit Admin</span>
              </button>
            ) : (
              <button
                onClick={onAdminClick}
                className="p-2 border border-border-subtle hover:border-gold/50 hover:text-gold rounded-lg transition-colors duration-200 text-text-muted"
                title="Admin Login"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
