// File: src/components/TryOnPanel.jsx
import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '../store'
import { startTryOn, getTryOnStatus, detectGarmentTypeByImage } from '../api/tryon'
import { guessGarmentTypeFromTitle } from '../lib/garmentType'
import GarmentUploader from './GarmentUploader'
import { Image as ImageIcon, Loader2, X } from 'lucide-react'

export default function TryOnPanel() {
  const token = useStore(s => s.token)
  const garments = Array.isArray(useStore(s => s.garments)) ? useStore(s => s.garments) : []
  const photos = Array.isArray(useStore(s => s.photos)) ? useStore(s => s.photos) : []
  const addTryOn = useStore(s => s.addTryOn)
  const removeGarmentFromStore = useStore(s => s.removeGarment)

  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedGarment = garments[selectedIndex] || null

  const primary = useMemo(() => photos.find(p => p.is_primary), [photos])
  const [photoId, setPhotoId] = useState(primary?.id || '')
  useEffect(() => { if (primary?.id && !photoId) setPhotoId(primary.id) }, [primary?.id]) // eslint-disable-line
  useEffect(() => { if (selectedIndex > garments.length - 1) setSelectedIndex(Math.max(0, garments.length - 1)) }, [garments.length, selectedIndex])

  // --- Garment type (auto → title guess → image detect) ---
  const [garmentType, setGarmentType] = useState('auto')
  const [detecting, setDetecting] = useState(false)

  useEffect(() => {
    const g = selectedGarment
    if (!g?.url) { setGarmentType('auto'); return }
    const byTitle = guessGarmentTypeFromTitle(g.title || '')
    if (byTitle && byTitle !== 'unknown') {
      setGarmentType(byTitle)
      return
    }
    ;(async () => {
      try {
        setDetecting(true)
        const r = await detectGarmentTypeByImage(g.url, token)
        if (r?.type) setGarmentType(r.type || 'auto')
      } catch {}
      finally { setDetecting(false) }
    })()
  }, [selectedGarment?.url, selectedGarment?.title, token])

  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState(null)
  const [resultUrl, setResultUrl] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const poller = useRef(null)

  const [toast, setToast] = useState('')
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 1500); return () => clearTimeout(t) }, [toast])

  async function generateTryOn() {
    if (!selectedGarment?.url) return alert('Select or upload a garment first.')
    if (!photoId) return alert('Choose a body photo.')
    if (poller.current) { clearInterval(poller.current); poller.current = null }

    setBusy(true); setStatus('pending'); setResultUrl(null); setShowResult(false)

    try {
      // Note: startTryOn currently ignores extra args; backend auto-detects when not provided.
      const { prediction_id } = await startTryOn(
        selectedGarment.url, photoId, token // , garmentType  (optional: if you extend tryon.js to send it)
      )
      let addedOnce = false

      poller.current = setInterval(async () => {
        try {
          const r = await getTryOnStatus(prediction_id, token)
          setStatus(r.status)
          if (r.status === 'completed' && r.result_image_url) {
            if (!addedOnce) {
              addedOnce = true
              addTryOn({
                prediction_id,
                status: 'completed',
                result_url: r.result_image_url,
                created_at: new Date().toISOString(),
              })
            }
            setResultUrl(r.result_image_url)
            clearInterval(poller.current)
            poller.current = null
            setBusy(false)
            setShowResult(true)
          }
        } catch (e) {
          console.error('[status] error', e)
          clearInterval(poller.current)
          poller.current = null
          setStatus('error')
          setBusy(false)
        }
      }, 3500)
    } catch (e) {
      console.error('[try-on/start] error', e)
      setStatus('error'); setBusy(false)
      alert(e?.message || 'Virtual try-on failed.')
    }
  }
  useEffect(() => () => { if (poller.current) clearInterval(poller.current) }, [])

  function removeGarment(url) {
    if (typeof removeGarmentFromStore === 'function') removeGarmentFromStore(url)
  }
  function handleSave() {
    try { localStorage.setItem('matchin-saved-garments', JSON.stringify(garments || [])); setToast('Saved!') }
    catch { setToast('Save failed') }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* LEFT */}
      <section className="flex flex-col">
        <div className="rounded-2xl border border-black/10 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold text-ink">Selected Products</div>
            <div className="text-ink"><GarmentUploader variant="light" /></div>
          </div>

          <div className="mt-2 h-[520px] overflow-y-auto p-1 pr-2">
            <div className="grid grid-cols-2 gap-3">
              {garments.length === 0 ? (
                <div className="col-span-2 text-sm text-muted">No items yet. Add from chat or upload.</div>
              ) : (
                garments.map((g, idx) => {
                  const selected = idx === selectedIndex
                  return (
                    <button
                      key={`${g.url}-${idx}`} onClick={() => setSelectedIndex(idx)}
                      className={[
                        'relative rounded-xl border border-black/10 bg-white p-2 text-left transition hover:bg-black/5',
                        selected ? 'ring-2 ring-cta' : ''
                      ].join(' ')}
                    >
                      <span
                        onClick={(e) => { e.stopPropagation(); removeGarment(g.url) }}
                        className="absolute -right-1 -top-1 z-10 grid h-6 w-6 place-items-center rounded-full bg-black/70 text-white hover:bg-black"
                        role="button" aria-label="Remove"
                      >
                        <X size={14} />
                      </span>

                      <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
                        <img src={g.url} alt="Garment" className="aspect-[4/3] w-full object-cover" />
                      </div>

                      <div className="mt-2 min-h-[40px] text-[13px] leading-snug text-ink line-clamp-2">{g.title || 'Garment'}</div>
                      {g.price && <div className="mt-1 text-sm font-semibold text-ink">{g.price}</div>}
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={handleSave}
              className="rounded-full border border-black/10 bg-white px-3 py-2 text-sm text-ink hover:bg-black/5">Save</button>
            <a href={selectedGarment?.product_url || '#'} target="_blank" rel="noreferrer"
              className="rounded-full bg-cta px-3 py-2 text-center text-sm font-medium text-cta-text shadow-soft">Buy Now</a>
          </div>
          <button
            onClick={generateTryOn} disabled={busy || !photoId || !selectedGarment}
            aria-busy={busy ? 'true' : 'false'}
            className="w-full rounded-full bg-cta px-4 py-2 font-medium text-cta-text shadow-soft disabled:opacity-50"
          >
            {busy ? 'Generating…' : 'Generate Virtual Try-On'}
          </button>
        </div>

        {toast && (<div className="mt-3"><div className="inline-block rounded-full bg-ink px-3 py-1 text-xs text-white shadow-soft">{toast}</div></div>)}
      </section>

      {/* RIGHT */}
      <section className="flex flex-col">
        <div className="rounded-2xl border border-black/10 bg-white p-4 pb-3">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="whitespace-nowrap text-sm text-ink/80">Choose Photo for Try-On</div>
              <select value={photoId} onChange={(e) => setPhotoId(e.target.value)}
                className="w-[160px] md:w-[180px] rounded-xl border border-cta/50 bg-white px-3 py-2 text-sm text-ink outline-none">
                <option value="" disabled>Select a photo…</option>
                {photos.map((p, i) => <option key={p.id} value={p.id}>{`Photo ${i + 1}`}</option>)}
              </select>
            </div>

            {/* Garment type picker (optional override) */}
            <div className="flex items-center gap-2">
              <div className="whitespace-nowrap text-sm text-ink/80">
                Garment Type {detecting && <span className="text-muted">(detecting…)</span>}
              </div>
              <select
                value={garmentType}
                onChange={(e) => setGarmentType(e.target.value)}
                className="w-[160px] md:w-[180px] rounded-xl border border-cta/50 bg-white px-3 py-2 text-sm text-ink outline-none"
                title="Pick the area this garment should affect"
              >
                <option value="auto">Auto</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="dress">Dress</option>
                <option value="outerwear">Outerwear</option>
              </select>
            </div>

            <button onClick={() => setShowResult(v => !v)} disabled={!resultUrl}
              className={`ml-auto rounded-full px-3 py-2 text-sm ${resultUrl ? 'border border-black/10 bg-white text-ink hover:bg-black/5' : 'border border-black/10 bg-white text-muted opacity-60'}`}
              title={resultUrl ? 'Toggle view' : 'Try-On not ready yet'}>
              {showResult ? 'Show Original' : 'Show Try-On'}
            </button>
          </div>

          <div className="rounded-xl border border-black/10 bg-white p-3">
            <div className="mx-auto grid h-[600px] w-full max-w-[520px] place-items-center">
              {showResult && resultUrl ? (
                <img src={resultUrl} alt="Try-on result" className="max-h-[560px] w-auto object-contain" />
              ) : photoId ? (
                <img src={photos.find(p => p.id === photoId)?.gcs_url} alt="Selected" className="max-h-[560px] w-auto object-contain" />
              ) : (
                <div className="grid h-full w-full place-items-center text-muted">
                  <ImageIcon className="mb-2 h-6 w-6" />
                  Select a body photo to preview.
                </div>
              )}
            </div>

            <div className="mt-2">
              {status === 'pending' && (
                <div className="inline-flex items-center gap-2 text-xs text-ink/80">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Processing…
                </div>
              )}
              {status === 'error' && <div className="text-xs text-red-600">Failed. Please try again.</div>}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
