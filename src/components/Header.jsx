import { useState } from 'react'
import { Menu, X, Lock, LogOut } from 'lucide-react'
import { useAdmin } from '../contexts/AdminContext'
import { APP_VERSION } from '../lib/version'

export function Header({ onMenuClick, isMenuOpen, onAdminClick }) {
  const { isAdmin, logout } = useAdmin()

  return (
    <header className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-gray-900 font-bold text-sm">LBC</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight">
                  LBC Outerwear Catalog
                </h1>
                <p className="text-xs text-gray-400 hidden sm:block">
                  The London Bespoke Club &nbsp;·&nbsp; v{APP_VERSION}
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
