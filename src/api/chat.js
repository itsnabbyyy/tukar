// File: src/api/chat.js

export async function sendPrompt(userId, prompt, token, threadId = 'default') {
  const r = await fetch('/chat/prompt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ user_id: userId, prompt, thread_id: threadId })
  })
  if (!r.ok) throw new Error('Chat failed')
  return r.json()
}

export async function getHistory(token, limit = 100, threadId = 'default') {
  const r = await fetch(`/chat/history?limit=${limit}&thread_id=${encodeURIComponent(threadId)}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!r.ok) throw new Error('History failed')
  return r.json()
}

export async function listThreads(token) {
  const r = await fetch('/chat/threads', {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!r.ok) throw new Error('Threads failed')
  return r.json()
}

export async function createThread(token, title = 'New chat') {
  const r = await fetch('/chat/threads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ title })
  })
  if (!r.ok) throw new Error('Create thread failed')
  return r.json()
}

export async function deleteThreadApi(token, id) {
  const r = await fetch(`/chat/threads/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!r.ok) throw new Error('Delete thread failed')
}

export async function renameThreadApi(token, id, title) {
  const r = await fetch(`/chat/threads/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ title })
  })
  if (!r.ok) throw new Error('Rename failed')
  // backend returns { ok: true }
  return { ok: true }
}
