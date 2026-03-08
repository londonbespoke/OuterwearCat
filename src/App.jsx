import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { AdminLoginModal } from './components/AdminLoginModal'
import { AdminProvider } from './contexts/AdminContext'
import { HomePage } from './pages/HomePage'
import { CatalogPage } from './pages/CatalogPage'

function App() {
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AdminProvider>
      <div className="min-h-screen bg-gray-50">
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
  )
}

export default App
