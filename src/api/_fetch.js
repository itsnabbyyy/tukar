import { useStore } from '../store'

export async function apiFetch(url, options = {}) {
  const r = await fetch(url, options)
  if (r.status === 401) {
    // soft logout
    try { useStore.getState().logout?.() } catch {}
    throw new Error('Unauthorized')
  }
  return r
}
