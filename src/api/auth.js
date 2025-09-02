const authHeaders = t => ({ Authorization: `Bearer ${t}` })

export async function registerUser(data) {
  const r = await fetch('/auth/register', {
    method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data)
  })
  if (!r.ok) throw new Error(await r.text()); return r.json()
}

export async function login(email, password) {
  const body = new URLSearchParams(); body.append('username', email); body.append('password', password)
  const r = await fetch('/auth/login', {
    method: 'POST', headers: {'Content-Type':'application/x-www-form-urlencoded'}, body
  })
  if (!r.ok) throw new Error(await r.text()); return r.json() // {access_token}
}

export async function getProfile(token) {
  const r = await fetch('/auth/me', { headers: authHeaders(token) })
  if (!r.ok) throw new Error('Unauthorized'); return r.json()
}
