import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { AdminLoginModal } from './components/AdminLoginModal'
import { AdminProvider } from './contexts/AdminContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { HomePage } from './pages/HomePage'
import { CatalogPage } from './pages/CatalogPage'

function App() {
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ThemeProvider>
    <AdminProvider>
      <div className="min-h-screen bg-surface-base transition-colors duration-300">
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          isMenuOpen={sidebarOpen}
          onAdminClick={() => setShowAdminLogin(true)}
        />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:catalogSlug" element={<CatalogPage />} />
        </Routes>

        <AdminLoginModal
          isOpen={showAdminLogin}
          onClose={() => setShowAdminLogin(false)}
        />
      </div>
    </AdminProvider>
    </ThemeProvider>
  )
}

export default App
