// File: src/pages/Dashboard.jsx
import { useEffect, useMemo } from 'react'
import { useStore } from '../store'
import ChatWindow from '../components/ChatWindow'
import TryOnPanel from '../components/TryOnPanel'
import Moodboard from '../components/Moodboard'
import { useSearchParams } from 'react-router-dom'
import Starfield from '../components/Starfield'
import { listPhotos } from '../api/files'

export default function Dashboard() {
  const [params] = useSearchParams()
  const tab = params.get('tab') || 'chat'

  const token = useStore(s => s.token)
  const setPhotos = useStore(s => s.setPhotos)

  const rawPhotos = useStore(s => s.photos)
  const photos = Array.isArray(rawPhotos) ? rawPhotos : []
  const primary = useMemo(() => photos.find(p => p.is_primary), [photos])

  // Refresh photos when entering dashboard (helps when signed URLs expired)
  useEffect(() => {
    (async () => {
      if (!token) return
      try {
        const res = await listPhotos(token)
        setPhotos(res?.photos || [])
      } catch {}
    })()
  }, [token, setPhotos])

  return (
    <div className="relative min-h-[calc(100vh-100px)] bg-paper">
      {/* Starfield fixed behind everything */}
     <Starfield theme="light" />

      {/* Foreground content */}
      <div className="relative z-10 space-y-6">
        {tab === 'chat' && (
          <div className="max-w-full">
            <ChatWindow />
          </div>
        )}

        {tab === 'tryon' && (
          <>
            <div className="text-center">
              <h3 className="text-2xl font-semibold">Virtual Try-On</h3>
              <p className="mt-1 text-sm text-slate-400">
                See how clothes look on you with AI-powered virtual fitting
              </p>
            </div>
            <TryOnPanel />
          </>
        )}

        {tab === 'mood' && <Moodboard />}
      </div>
    </div>
  )
}
