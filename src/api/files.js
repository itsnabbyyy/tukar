// File: src/api/files.js
const authHeaders = t => ({ Authorization: `Bearer ${t}` })

export async function listPhotos(token) {
  const r = await fetch('/auth/me/photos', { headers: authHeaders(token) })
  if (!r.ok) throw new Error('Load photos failed'); return r.json()
}

export async function uploadPhoto(file, makePrimary, token) {
  const fd = new FormData(); fd.append('file', file); fd.append('make_primary', String(!!makePrimary))
  const r = await fetch('/auth/me/photos', { method:'POST', headers: authHeaders(token), body: fd })
  if (!r.ok) throw new Error('Upload failed'); return r.json()
}

export async function setPrimary(photoId, token) {
  const r = await fetch(`/auth/me/photos/${photoId}/primary`, { method:'POST', headers: authHeaders(token) })
  if (!r.ok) throw new Error('Set primary failed'); return r.json()
}

export async function deletePhoto(photoId, token) {
  const r = await fetch(`/auth/me/photos/${photoId}`, { method:'DELETE', headers: authHeaders(token) })
  if (!r.ok) throw new Error('Delete failed')
}

export async function uploadGarment(file, token) {
  const fd = new FormData(); fd.append('file', file)
  const r = await fetch('/files/garments', { method:'POST', headers: authHeaders(token), body: fd })
  if (!r.ok) throw new Error(await r.text()); return r.json() // {url, blob_name}
}
