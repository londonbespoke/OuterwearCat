import { createContext, useContext, useState } from 'react'

const AdminContext = createContext()

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('lbc_outerwear_admin') === 'true'
  })

  const login = (password) => {
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      setIsAdmin(true)
      sessionStorage.setItem('lbc_outerwear_admin', 'true')
      return true
    }
    return false
  }

  const logout = () => {
    setIsAdmin(false)
    sessionStorage.removeItem('lbc_outerwear_admin')
  }

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => useContext(AdminContext)
