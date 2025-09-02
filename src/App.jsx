import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useStore } from './store'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import UploadGate from './pages/UploadGate'
import Dashboard from './pages/Dashboard'
import AuthModal from './components/AuthModal'
import { listPhotos } from './api/files'

function RequireAuth({ children }) {
  const token = useStore((s) => s.token)
  return token ? children : <Navigate to="/" />
}

export default function App() {
  const token = useStore((s) => s.token)

  // Coerce to array for safety
  const rawPhotos = useStore((s) => s.photos)
  const photos = Array.isArray(rawPhotos) ? rawPhotos : []

  const setPhotos = useStore((s) => s.setPhotos)
  const nav = useNavigate()
  const location = useLocation()
  const isLanding = location.pathname === '/'

  // Load photos when we have a token
  useEffect(() => {
    (async () => {
      if (!token) return
      try {
        const data = await listPhotos(token)
        setPhotos(data.photos || [])
      } catch {}
    })()
  }, [token, setPhotos])

  // Default redirect after login (unchanged)
  useEffect(() => {
    if (!token) return
    if (photos.length > 0) nav('/dashboard', { replace: true })
    else nav('/onboarding/upload', { replace: true })
  }, [token]) // eslint-disable-line

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Navbar variant={isLanding ? 'landing' : 'app'} />

      <div className="mx-auto max-w-7xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/onboarding/upload"
            element={
              <RequireAuth>
                <UploadGate />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      <AuthModal />
    </div>
  )
}
