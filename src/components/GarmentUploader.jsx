import { useState } from 'react'
import { useStore } from '../store'
import { uploadGarment } from '../api/files'

export default function GarmentUploader({ variant = 'light', onUploaded }) {
  const token = useStore(s => s.token)
  const addGarment = useStore(s => s.addGarment)
  const [busy, setBusy] = useState(false)

  async function onUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    try {
      const res = await uploadGarment(file, token)
      const g = { url: res.url, blob_name: res.blob_name, title: 'Uploaded Garment', price: '', source: 'upload', added_at: new Date().toISOString() }
      addGarment(g); onUploaded?.(g)
    } catch (err) { alert(err.message) } finally { setBusy(false) }
  }

  const base = 'inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm'
  const styles = variant === 'dark'
    ? 'border-black/10 bg-white text-ink hover:bg-black/5'
    : 'border-black/10 bg-white text-ink hover:bg-black/5'

  return (
    <label className={`${base} ${styles}`}>
      <span>{busy ? 'Uploading…' : 'Upload Garment'}</span>
      <input type="file" accept="image/*" className="hidden" onChange={onUpload} disabled={busy} />
    </label>
  )
}
