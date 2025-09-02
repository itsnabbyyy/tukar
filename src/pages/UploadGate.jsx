// src/pages/UploadGate.jsx
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { listPhotos, uploadPhoto } from '../api/files'
import { Camera } from 'lucide-react'
import Starfield from '../components/Starfield'

const ink = '#1f1f1f'
const muted = '#8a8988'
const paper = '#f4f3f1'
const cta = '#fb7232'
const ctaText = '#ffe1d4'

export default function UploadGate() {
  const token = useStore(s => s.token)

  const rawPhotos = useStore(s => s.photos)
  const photos = Array.isArray(rawPhotos) ? rawPhotos : []

  const setPhotos = useStore(s => s.setPhotos)
  const nav = useNavigate()
  const [busy, setBusy] = useState(false)
  const remaining = useMemo(() => Math.max(0, 4 - photos.length), [photos.length])

  useEffect(() => {
    (async () => {
      try {
        const data = await listPhotos(token)
        setPhotos(data.photos || [])
      } catch {}
    })()
  }, [token, setPhotos])

  async function onFiles(files) {
    const arr = Array.from(files).slice(0, remaining)
    if (arr.length === 0) return
    setBusy(true)
    try {
      for (let i = 0; i < arr.length; i++) {
        const makePrimary = photos.length === 0 && i === 0
        const res = await uploadPhoto(arr[i], makePrimary, token)
        setPhotos(prev => [res, ...(Array.isArray(prev) ? prev : [])])
      }
    } catch (e) {
      alert(e.message)
    } finally {
      setBusy(false)
    }
  }

  function onDrop(e) {
    e.preventDefault()
    if (busy) return
    onFiles(e.dataTransfer.files)
  }

  return (
    <div className="relative">
      <Starfield withBlobs={false} />

      <section
        className="relative z-10 mx-auto max-w-3xl rounded-3xl border p-6 md:p-8"
        style={{ background: '#fff', borderColor: 'rgba(2,2,2,0.08)' }}
      >
        <h2
          className="text-center text-3xl font-extrabold"
          style={{ color: ink }}
        >
          Upload Your Photos
        </h2>
        <p className="mt-2 text-center" style={{ color: muted }}>
          Upload 1–4 full body photos to get personalized styling recommendations.
        </p>

        {/* Dropzone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="mt-6 grid place-items-center rounded-2xl border-2 border-dashed p-8 text-center"
          style={{ borderColor: 'rgba(2,2,2,0.14)', background: paper, color: muted }}
        >
          <Camera className="mb-3 h-10 w-10" style={{ color: muted }} />
          <div className="text-base" style={{ color: ink }}>Drag & drop your photos here</div>
          <div className="text-sm" style={{ color: muted }}>or click to browse</div>

          <label
            className="mt-4 inline-block cursor-pointer rounded-full px-5 py-2 font-medium shadow-sm transition hover:opacity-95"
            style={{ background: cta, color: ctaText }}
          >
            Choose Photos
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => onFiles(e.target.files)}
              disabled={busy || remaining === 0}
            />
          </label>
        </div>

        {/* Thumbnails */}
        {photos.length > 0 && (
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            {photos.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border p-2"
                style={{
                  background: '#fff',
                  borderColor: p.is_primary ? 'rgba(251,114,50,0.35)' : 'rgba(2,2,2,0.08)',
                  boxShadow: p.is_primary ? '0 0 0 2px rgba(251,114,50,0.25) inset' : undefined,
                }}
              >
                <img
                  src={p.gcs_url}
                  alt=""
                  className="h-40 w-full rounded-lg object-cover"
                />
                <div className="mt-1 text-xs" style={{ color: muted }}>
                  {p.is_primary ? 'Primary' : 'Photo'}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between">
          <div className="text-sm">
            <span
              style={{
                color: photos.length > 0 ? cta : muted,
                fontWeight: photos.length > 0 ? 600 : 400,
              }}
            >
              {photos.length}/4 photos uploaded
            </span>
            {photos.length > 0 && (
              <span className="ml-2" style={{ color: cta }}>
                Ready to continue
              </span>
            )}
          </div>
          <button
            onClick={() => nav('/dashboard')}
            disabled={photos.length === 0}
            className="rounded-full px-5 py-2 font-medium shadow-sm disabled:opacity-50"
            style={{ background: cta, color: ctaText }}
          >
            Continue to AI Stylist
          </button>
        </div>

        {/* Tips */}
        <div
          className="mt-6 rounded-xl border p-4 text-sm"
          style={{ background: paper, borderColor: 'rgba(2,2,2,0.08)', color: muted }}
        >
          <div className="font-medium" style={{ color: ink }}>Tips for best results:</div>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>Use full-body photos with good lighting.</li>
            <li>Ensure the photos are clear and not blurry.</li>
            <li>Do not include bags or other people in the photo.</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
