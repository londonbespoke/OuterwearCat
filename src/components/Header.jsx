import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Lock, LogOut, ArrowLeft } from 'lucide-react'
import { useAdmin } from '../contexts/AdminContext'
import { supabase } from '../lib/supabase'
import { APP_VERSION } from '../lib/version'

export function Header({ onMenuClick, isMenuOpen, onAdminClick }) {
  const { isAdmin, logout } = useAdmin()
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
    <header className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {!isHome && (
              <>
                <button
                  onClick={() => navigate('/')}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  aria-label="Back to catalogs"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={onMenuClick}
                  className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
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
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center shrink-0">
                <span className="text-gray-900 font-bold text-sm">LBC</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight">
                  {isHome ? 'LBC Product Catalog' : (catalogName || 'Loading...')}
                </h1>
                <p className="text-xs text-gray-400 hidden sm:block">
                  {isHome
                    ? `The London Bespoke Club  \u00b7  v${APP_VERSION}`
                    : `LBC Catalog  \u00b7  v${APP_VERSION}`
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin ? (
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Exit Admin</span>
              </button>
            ) : (
              <button
                onClick={onAdminClick}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
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
