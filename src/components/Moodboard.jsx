import { useEffect, useMemo, useState } from 'react'
import { useStore } from '../store'
import { listPhotos, uploadPhoto, deletePhoto } from '../api/files'
import { Download, Pin, X } from 'lucide-react'

export default function Moodboard() {
  const token = useStore(s => s.token)
  const photos = Array.isArray(useStore(s => s.photos)) ? useStore(s => s.photos) : []
  const setPhotos = useStore(s => s.setPhotos)
  const tryOns = Array.isArray(useStore(s => s.tryOns)) ? useStore(s => s.tryOns) : []
  const removeTryOn = useStore(s => s.removeTryOn)
  const pins = useStore(s => s.pins)
  const pinItem = useStore(s => s.pinItem)
  const unpinItem = useStore(s => s.unpinItem)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    (async () => { if (!token) return; try { const res = await listPhotos(token); setPhotos(res?.photos || []) } catch {} })()
  }, [token, setPhotos])

  const primary = useMemo(() => photos.find(p => p.is_primary), [photos])

  async function handleUpload(e) {
    const file = e.target.files?.[0]; if (!file) return
    setBusy(true)
    try {
      const makePrimary = photos.length === 0
      const res = await uploadPhoto(file, makePrimary, token)
      setPhotos(prev => [res, ...(Array.isArray(prev) ? prev : [])])
      const latest = await listPhotos(token); setPhotos(latest?.photos || [])
    } catch (err) { alert(err?.message || 'Upload failed') } finally { setBusy(false); e.target.value = '' }
  }

  async function handleDeletePhoto(photoId) {
    if (!confirm('Delete this photo?')) return
    setBusy(true)
    try { await deletePhoto(photoId, token); setPhotos(prev => (Array.isArray(prev) ? prev : []).filter(p => p.id !== photoId)) }
    catch (err) { alert(err?.message || 'Delete failed') } finally { setBusy(false) }
  }

  function handlePin(srcUrl, label = 'Photo') {
    if (!srcUrl) return
    pinItem({ id: `photo:${srcUrl}`, type: 'photo', title: label, image_url: srcUrl, added_at: new Date().toISOString() })
  }

  async function downloadImage(url, filename = 'tryon.jpg') {
    try {
      const resp = await fetch(url, { mode: 'cors', credentials: 'omit' })
      const blob = await resp.blob()
      const objectUrl = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = objectUrl; a.download = filename; document.body.appendChild(a); a.click(); a.remove()
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1500)
    } catch {
      const a = document.createElement('a'); a.href = url; a.download = filename; a.rel = 'noopener'; document.body.appendChild(a); a.click(); a.remove()
    }
  }

  return (
    <div className="space-y-8">
      {/* Pinned */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink">Pinned</h3>
          <div className="text-xs text-muted">{Array.isArray(pins) ? pins.length : 0} item(s)</div>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-3 text-sm text-muted">
          Pin products from chat or pin your try-on/photos below to see them here.
        </div>

        {Array.isArray(pins) && pins.length > 0 && (
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {pins.map((p) => (
              <div key={p.id} className="relative rounded-xl border border-black/10 bg-white p-2 shadow-soft">
                <button
                  onClick={() => unpinItem(p.id)}
                  className="absolute right-1 top-1 z-10 grid h-7 w-7 place-items-center rounded-full bg-black/70 text-white hover:bg-black"
                  title="Unpin"
                >
                  <X size={16} />
                </button>
                <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
                  <img src={p.image_url} alt={p.title || 'Pinned'} className="aspect-[4/5] w-full object-contain" />
                </div>
                <div className="mt-2 text-xs text-ink/80">{p.title || 'Pinned item'}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* My Photos */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink">My Photos</h3>

          <label className="cursor-pointer rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm text-ink hover:bg-black/5">
            {busy ? 'Uploading…' : 'Upload Photo'}
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={busy} />
          </label>
        </div>

        {photos.length === 0 ? (
          <div className="rounded-2xl border border-black/10 bg-white p-4 text-sm text-muted">No photos yet. Upload a full-body photo to get started.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {photos.map((p, idx) => (
              <div key={p.id} className="relative rounded-xl border border-black/10 bg-white p-2 shadow-soft">
                <button
                  onClick={() => handleDeletePhoto(p.id)}
                  className="absolute right-2 top-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-black/70 text-white hover:bg-black"
                  title="Delete photo"
                >
                  <X size={16} />
                </button>

                <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
                  <img src={p.gcs_url} alt={`Photo ${idx + 1}`} className="aspect-[3/4] w-full object-contain" />
                </div>

                <div className="mt-2 flex items-center justify-between text-xs">
                  <div className="text-ink/80">{p.is_primary ? 'Primary Photo' : `Photo ${idx + 1}`}</div>
                  <button
                    onClick={() => handlePin(p.gcs_url, p.is_primary ? 'Primary Photo' : `Photo ${idx + 1}`)}
                    className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-white px-2 py-1 text-ink hover:bg-black/5"
                    title="Pin to board"
                  >
                    <Pin size={14} /> Pin
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Try-On Results */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink">Try-On Results</h3>
        </div>

        {tryOns.length === 0 ? (
          <div className="rounded-2xl border border-black/10 bg-white p-4 text-sm text-muted">Generate a virtual try-on to see results here.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {tryOns.map((t, i) => {
              const url = t.result_url || t.result_image_url || ''
              if (!url) return null
              const fileName = `tryon-${(t.prediction_id || i).toString().slice(-8)}.jpg`
              return (
                <div key={t.prediction_id || i} className="relative rounded-xl border border-black/10 bg-white p-2 shadow-soft">
                  <button
                    onClick={() =>
                      removeTryOn(x =>
                        (t.prediction_id && x.prediction_id === t.prediction_id) ||
                        (t.result_url && x.result_url === t.result_url) ||
                        (t.result_image_url && x.result_image_url === t.result_image_url)
                      )
                    }
                    className="absolute right-2 top-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-black/70 text-white hover:bg-black"
                    title="Delete"
                    aria-label="Delete try-on"
                  >
                    <X size={16} />
                  </button>

                  <button
                    onClick={() => downloadImage(url, fileName)}
                    className="absolute right-10 top-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-black/70 text-white hover:bg-black"
                    title="Download"
                  >
                    <Download size={16} />
                  </button>

                  <button
                    onClick={() => pinItem({ id: `tryon:${url}`, type: 'tryon', title: 'Try-On Result', image_url: url, added_at: new Date().toISOString() })}
                    className="absolute right-[73px] top-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-black/70 text-white hover:bg-black"
                    title="Pin"
                  >
                    <Pin size={14} />
                  </button>

                  <div className="block w-full overflow-hidden rounded-lg border border-black/10 bg-white" title="View larger">
                    <img src={url} alt="Try-On" className="aspect-[3/4] w-full object-contain" />
                  </div>

                  {t.created_at && (
                    <div className="mt-2 text-[11px] text-muted">{new Date(t.created_at).toLocaleString()}</div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>

      <Lightbox />
    </div>
  )
}

/* Lightbox kept identical (still works great with light theme) */
let setLightboxUrlRef = null
function openLightbox(url) { if (setLightboxUrlRef) setLightboxUrlRef(url) }
function Lightbox() {
  const [url, setUrl] = useState('')
  useEffect(() => { setLightboxUrlRef = setUrl; return () => { setLightboxUrlRef = null } }, [])
  if (!url) return null
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/80 p-4" onClick={() => setUrl('')}>
      <img src={url} alt="Preview" className="max-h-[90vh] w-auto max-w-[90vw] rounded-xl object-contain" onClick={e => e.stopPropagation()} />
      <button onClick={() => setUrl('')} className="absolute right-4 top-4 rounded-full bg-white/20 px-3 py-1.5 text-white hover:bg-white/30">Close</button>
    </div>
  )
}
