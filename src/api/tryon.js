// File: src/api/tryon.js
const H = t => (t ? { Authorization: `Bearer ${t}` } : {})

async function readTextSafe(resp) {
  try { return await resp.text() } catch { return '' }
}

export async function startTryOn(garmentUrl, photoId, token, garmentType = 'auto') {
  if (!garmentUrl || !/^https?:\/\//i.test(garmentUrl)) {
    throw new Error('Garment URL must be an http(s) URL')
  }
  const payload = { garment_image_url: garmentUrl }
  if (photoId) payload.photo_id = String(photoId)
  if (garmentType) payload.garment_type = garmentType

  const r = await fetch('/try-on/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...H(token) },
    body: JSON.stringify(payload),
  })

  const text = await readTextSafe(r)
  if (!r.ok) {
    // Surface FastAPI detail (which includes Gemini’s message)
    throw new Error(text || `Try-on start failed (${r.status})`)
  }
  return JSON.parse(text || '{}')
}

export async function getTryOnStatus(predictionId, token) {
  const r = await fetch(`/try-on/status/${predictionId}`, { headers: H(token) })
  if (!r.ok) throw new Error('Status failed')
  return r.json()
}

export async function detectGarmentTypeByImage(url, token) {
  const r = await fetch('/try-on/detect-type', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ garment_image_url: url })
  })
  if (!r.ok) return { type: 'unknown', confidence: 0 }
  return r.json()
}
