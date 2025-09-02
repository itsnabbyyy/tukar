import { useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import { useStore } from '../store'
import { sendPrompt, listThreads, getHistory, deleteThreadApi, renameThreadApi } from '../api/chat'
import ProductCard from './ProductCard'
import { Bot, SendHorizontal, History, Trash2, X, Plus } from 'lucide-react'

function ProductSkeleton() {
  return (
    <div className="h-full rounded-2xl border border-black/10 bg-white p-3 animate-pulse">
      <div className="mb-2 h-40 w-full rounded-xl bg-black/5" />
      <div className="h-4 w-3/4 rounded bg-black/5" />
      <div className="mt-2 h-4 w-16 rounded bg-black/5" />
      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="h-9 rounded bg-black/5" />
        <div className="h-9 rounded bg-black/5" />
        <div className="h-9 rounded bg-black/5" />
      </div>
    </div>
  )
}

export default function ChatWindow() {
  const token = useStore((s) => s.token)
  const user = useStore((s) => s.user)

  const threads = Array.isArray(useStore((s) => s.threads)) ? useStore((s) => s.threads) : []
  const activeId = useStore((s) => s.activeThreadId)
  const ensureThread = useStore((s) => s.ensureThread)
  const newThread = useStore((s) => s.newThread)
  const setActiveThread = useStore((s) => s.setActiveThread)
  const addMessageToActive = useStore((s) => s.addMessageToActive)
  const deleteThreadLocal = useStore((s) => s.deleteThread)
  const mergeServerThreads = useStore((s) => s.mergeServerThreads)
  const setThreadMessages = useStore((s) => s.setThreadMessages)
  const renameThreadLocal = useStore((s) => s.renameThread)

  const addGarment = useStore((s) => s.addGarment)
  const pinItem = useStore((s) => s.pinItem)

  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [showThreads, setShowThreads] = useState(false)
  const [toast, setToast] = useState(null)

  const activeThread = useMemo(() => {
    if (!threads.length) return null
    return threads.find((t) => t.id === activeId) || threads[0]
  }, [threads, activeId])
  const messages = activeThread?.messages || []

  useEffect(() => {
    const id = ensureThread()
    ;(async () => {
      if (!token) return
      try {
        const res = await listThreads(token)
        if (Array.isArray(res?.threads)) mergeServerThreads(res.threads)
        const curThreads = Array.isArray(useStore.getState().threads) ? useStore.getState().threads : []
        const cur = curThreads.find((t) => t.id === id)
        const needsHydrate = !cur || !Array.isArray(cur.messages) || cur.messages.length <= 1
        if (needsHydrate) await hydrateThread(id)
      } catch {}
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const listRef = useRef(null)
  const endRef = useRef(null)
  const scrollToBottom = (behavior = 'smooth') => {
    if (listRef.current) listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior })
    else endRef.current?.scrollIntoView({ behavior })
  }
  useEffect(() => { scrollToBottom('auto') }, [])
  useEffect(() => { scrollToBottom('smooth') }, [messages.length, sending])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 1600)
    return () => clearTimeout(t)
  }, [toast])

  function makeTitle(s) { return (s || '').replace(/\s+/g,' ').replace(/[\n\r]+/g,' ').trim().slice(0,60) || 'New chat' }

  async function hydrateThread(threadId) {
    if (!token) return
    try {
      const res = await getHistory(token, 200, threadId)
      const msgs = Array.isArray(res?.messages)
        ? res.messages.map((m) => ({ role: m.role, text: m.text, products: Array.isArray(m.products) ? m.products : [] }))
        : []
      if (msgs.length) setThreadMessages(threadId, msgs)
    } catch {}
  }

  async function onSend(e) {
    e?.preventDefault()
    const trimmed = text.trim()
    if (!trimmed || sending) return

    if (activeThread && (!activeThread.title || /^new chat$/i.test(activeThread.title))) {
      const title = makeTitle(trimmed)
      renameThreadLocal(activeThread.id, title)
      if (token) { try { await renameThreadApi(token, activeThread.id, title) } catch {} }
    }

    addMessageToActive({ role: 'user', text: trimmed })
    setText('')
    setSending(true)
    try {
      const { response_text, products } = await sendPrompt(user?.id || 'guest', trimmed, token, activeThread?.id || 'default')
      const four = Array.isArray(products) ? products.slice(0, 4) : []
      addMessageToActive({ role: 'assistant', text: response_text, products: four })
    } catch {
      addMessageToActive({ role: 'assistant', text: 'Sorry, something went wrong while fetching recommendations.' })
    } finally {
      setSending(false)
    }
  }

  function onKeyDown(e) { if (e.key === 'Enter' && !e.shiftKey) onSend(e) }

  function handleAdd(product) {
    const url = product?.image_url || product?.image || product?.img || product?.thumbnail || ''
    if (!url) return setToast('No image available to add')
    addGarment({
      url, title: product?.name || 'Garment', price: product?.price || '',
      product_url: product?.product_url || product?.url || null,
      source: 'chat', added_at: new Date().toISOString(),
    })
    setToast('Added to Try On')
  }

  function handlePin(product) {
    if (!product) return
    const id = product.id || `product:${product.image_url || product.url || ''}`
    pinItem({
      id, type: 'product', title: product.name || 'Pinned product',
      image_url: product.image_url || product.thumbnail || '',
      product_url: product.product_url || product.url || '', price: product.price || '',
      added_at: new Date().toISOString(),
    })
    setToast('Pinned to Moodboard')
  }

  async function handleMore() {
    if (sending) return
    setSending(true)
    try {
      addMessageToActive({ role: 'user', text: 'more options' })
      const { response_text, products } = await sendPrompt(user?.id || 'guest', 'more options', token, activeThread?.id || 'default')
      const four = Array.isArray(products) ? products.slice(0, 4) : []
      addMessageToActive({ role: 'assistant', text: response_text, products: four })
    } catch {
      addMessageToActive({ role: 'assistant', text: 'Couldn’t load more options right now.' })
    } finally { setSending(false); setTimeout(() => scrollToBottom('smooth'), 50) }
  }

  async function handleDelete(id) {
    try {
      if (!confirm('Delete this chat?')) return
      if (token && typeof deleteThreadApi === 'function') await deleteThreadApi(token, id)
      deleteThreadLocal(id); ensureThread()
    } catch { alert('Failed to delete chat.') }
  }

  return (
    <div className="relative flex flex-col gap-3" style={{ height: 'calc(100vh - 100px)' }}>
      {/* top bar */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => { const id = newThread(); setActiveThread(id) }}
          className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs text-ink hover:bg-black/5"
          title="Start new chat"
        >
          <Plus size={14} /> New Chat
        </button>
        <button
          onClick={() => setShowThreads(true)}
          className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs text-ink hover:bg-black/5"
          title="Show chat threads"
        >
          <History size={14} /> Threads
        </button>
      </div>

      {/* messages panel */}
      <div ref={listRef} className="mt-1 flex-1 overflow-y-auto rounded-2xl border border-black/10 bg-white p-4">
        <div className="space-y-4">
          {messages.map((m, i) => {
            const items = Array.isArray(m.products) ? m.products.slice(0, 4) : []
            return (
              <MessageBubble key={i} role={m.role}>
                {m.role === 'assistant' && (
                  <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-muted">
                    <Bot size={14} className="text-ink/70" /> M Bot
                  </div>
                )}

                <ReactMarkdown className="prose prose-sm max-w-none prose-p:my-2 prose-headings:mb-2 prose-ink"
                  remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                  {m.text}
                </ReactMarkdown>

                {items.length > 0 && (
                  <div className="mt-3 rounded-xl border border-black/10 bg-white p-3">
                    <div className="mb-2 flex items-center justify-between text-sm text-ink/80">
                      <span>Here are some picks you might like:</span>
                      <button
                        type="button" onClick={handleMore}
                        className="rounded-full border border-black/10 bg-white px-2 py-1 text-xs text-ink hover:bg-black/5 disabled:opacity-50"
                        disabled={sending} title="Show more like these"
                      >
                        More options
                      </button>
                    </div>
                    <div className="grid grid-cols-2 items-stretch gap-3 md:grid-cols-4">
                      {items.map((p) => (
                        <ProductCard key={p.id} p={p} onAdd={() => handleAdd(p)} onPin={() => handlePin(p)} />
                      ))}
                      {sending && [...Array(Math.max(0, 4 - items.length))].map((_, k) => <ProductSkeleton key={`sk-${k}`} />)}
                    </div>
                  </div>
                )}
              </MessageBubble>
            )
          })}
          <div ref={endRef} />
        </div>
      </div>

      {/* composer */}
      <form onSubmit={onSend} className="flex items-center gap-2">
        <div className="flex-1 rounded-2xl border border-black/10 bg-white px-4 py-3">
          <input
            type="text" aria-label="Ask for fashion recommendations"
            className="w-full bg-transparent text-ink placeholder:text-muted outline-none"
            placeholder="Ask for fashion recommendations…"
            value={text} onChange={(e) => setText(e.target.value)} onKeyDown={onKeyDown} disabled={sending}
          />
        </div>
        <button
          type="submit"
          className="grid h-12 w-12 place-items-center rounded-2xl bg-cta text-cta-text shadow-soft disabled:opacity-50"
          disabled={sending || !text.trim()} title="Send"
        >
          <SendHorizontal size={20} />
        </button>
      </form>

      {/* toast */}
      {toast && (
        <div className="pointer-events-none absolute inset-x-0 bottom-16 grid place-items-center">
          <div className="rounded-full bg-ink text-white px-4 py-2 text-sm font-medium shadow-soft">
            {toast}
          </div>
        </div>
      )}

      {/* threads slide-over */}
      {showThreads && (
        <div className="absolute inset-0 z-10">
          <div className="absolute inset-0 bg-black/20" onClick={() => setShowThreads(false)} />
          <div role="dialog" aria-modal="true"
            className="absolute right-0 top-0 h-full w-full max-w-md rounded-l-2xl border border-black/10 bg-white p-4 shadow-soft">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-ink">Your Chats</div>
              <button onClick={() => setShowThreads(false)} className="rounded-lg p-1.5 text-ink/70 hover:bg-black/5" title="Close">
                <X size={18} />
              </button>
            </div>

            <div className="h-[calc(100%-2.5rem)] space-y-2 overflow-y-auto pr-1">
              {threads.length === 0 ? (
                <div className="text-sm text-muted">No chats yet.</div>
              ) : (
                threads.map((t) => {
                  const isActive = activeThread?.id === t.id
                  return (
                    <div key={t.id}
                      className={[
                        'flex items-center gap-2 rounded-lg border px-3 py-2',
                        isActive ? 'border-ink/20 bg-black/5' : 'border-black/10 bg-white hover:bg-black/5',
                      ].join(' ')}
                    >
                      <button
                        onClick={async () => { setActiveThread(t.id); await hydrateThread(t.id); setShowThreads(false) }}
                        className="flex-1 text-left" title="Open chat"
                      >
                        <div className="text-sm text-ink line-clamp-1">{t.title || 'New chat'}</div>
                        {t.updated_at && (
                          <div className="text-[11px] text-muted">Updated: {new Date(t.updated_at).toLocaleString()}</div>
                        )}
                      </button>
                      <button onClick={() => handleDelete(t.id)} className="ml-1 rounded-md p-1 text-ink/70 hover:bg-black/5" title="Delete chat">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MessageBubble({ role, children }) {
  const isUser = role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={[
          'max-w-[100%] rounded-2xl px-4 py-3 text-sm shadow-soft border',
          isUser
            ? 'border-transparent bg-cta text-cta-text'
            : 'border-black/10 bg-white text-ink',
        ].join(' ')}
      >
        {children}
      </div>
    </div>
  )
}
