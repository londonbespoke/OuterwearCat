import { useState } from 'react'
import { X, Lock, Loader2 } from 'lucide-react'
import { useAdmin } from '../contexts/AdminContext'

export function AdminLoginModal({ isOpen, onClose }) {
  const { login } = useAdmin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await login(email, password)
    setLoading(false)
    if (result.success) {
      setEmail('')
      setPassword('')
      onClose()
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={onClose}>
      <div className="bg-surface-card rounded-2xl w-full max-w-sm border border-border-subtle animate-modal-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-gold" />
            <h2 className="font-serif font-semibold text-text-primary">Admin Login</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-elevated rounded-lg text-text-muted hover:text-text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-muted uppercase tracking-[0.15em] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
              className="w-full px-3 py-2 bg-surface-base border border-border-subtle rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:border-gold/50"
              placeholder="admin@londonbespokeclub.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted uppercase tracking-[0.15em] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-surface-base border border-border-subtle rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:border-gold/50"
              placeholder="Enter password"
            />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gold text-surface-base rounded-lg hover:bg-gold-light text-sm font-medium disabled:opacity-50 transition-colors"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
