import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Small helper
const nowIso = () => new Date().toISOString()

/**
 * Storage model
 * - tryOnsByUser: { [userId]: TryOn[] }
 * - pinsByUser:   { [userId]: Pin[] }
 * - tryOns/pins:  "active user view" (derived from the maps when you setUser)
 *
 * This keeps each user's data separate and restores it when you log back in.
 */
export const useStore = create(
  persist(
    (set, get) => ({
      // -------- Auth --------
      token: null,
      user: null,
      setToken: (token) => set({ token }),
      setUser: (user) => {
        // When switching/logging in, refresh active user's lists from maps
        const uid = user?.id ?? null
        const maps = get()
        const tryOns = uid ? (maps.tryOnsByUser?.[uid] ?? []) : []
        const pins = uid ? (maps.pinsByUser?.[uid] ?? []) : []
        set({ user, tryOns, pins })
      },

      // -------- Data (active user view) --------
      photos: [],
      garments: [],

      // These two are "active user view" (for the currently signed-in user)
      tryOns: [],
      pins: [],

      // Per-user maps (persisted across logouts)
      tryOnsByUser: {}, // { [uid]: TryOn[] }
      pinsByUser: {},   // { [uid]: Pin[] }

      // Photos
      setPhotos: (arg) =>
        set((s) => ({ photos: typeof arg === 'function' ? arg(s.photos) : arg })),

      // Garments (de-dupe by URL)
      addGarment: (g) =>
        set((s) => {
          const list = Array.isArray(s.garments) ? s.garments : []
          if (!g?.url) return { garments: list }
          const i = list.findIndex((x) => x.url === g.url)
          if (i === -1) return { garments: [g, ...list] }
          const merged = { ...list[i], ...g }
          const next = [merged, ...list.filter((_, idx) => idx !== i)]
          return { garments: next }
        }),
      removeGarment: (url) =>
        set((s) => ({
          garments: (Array.isArray(s.garments) ? s.garments : []).filter(
            (x) => x.url !== url
          ),
        })),

      // -------- Chat Threads (persistent) --------
      // Shape: { id, title, updated_at, messages:[{role:'user'|'assistant', text, products?}] }
      threads: [],
      activeThreadId: null,

      ensureThread: () => {
        const s = get()
        const threads = Array.isArray(s.threads) ? s.threads : []
        if (threads.length > 0 && s.activeThreadId && threads.some(t => t.id === s.activeThreadId)) {
          return s.activeThreadId
        }
        const id = crypto?.randomUUID?.() || String(Date.now())
        const greeting = {
          role: 'assistant',
          text:
            "Hi! I'm your AI fashion stylist. What would you like to explore today?",
        }
        const newThread = {
          id,
          title: 'New chat',
          updated_at: nowIso(),
          messages: [greeting],
        }
        set({ threads: [newThread, ...threads], activeThreadId: id })
        return id
      },

      newThread: () => {
        const id = crypto?.randomUUID?.() || String(Date.now())
        const greeting = {
          role: 'assistant',
          text:
            "Hi! I'm your AI fashion stylist. What would you like to explore today?",
        }
        const t = { id, title: 'New chat', updated_at: nowIso(), messages: [greeting] }
        set((s) => ({
          threads: [t, ...(Array.isArray(s.threads) ? s.threads : [])],
          activeThreadId: id,
        }))
        return id
      },

      setActiveThread: (id) => set({ activeThreadId: id }),

      renameThread: (id, title) =>
        set((s) => ({
          threads: (Array.isArray(s.threads) ? s.threads : []).map((t) =>
            t.id === id ? { ...t, title } : t
          ),
        })),

      deleteThread: (id) =>
        set((s) => {
          const list = (Array.isArray(s.threads) ? s.threads : []).filter(
            (t) => t.id !== id
          )
          const activeThreadId =
            s.activeThreadId === id ? (list[0]?.id ?? null) : s.activeThreadId
          return { threads: list, activeThreadId }
        }),

      addMessageToActive: (msg) =>
        set((s) => {
          const list = Array.isArray(s.threads) ? s.threads : []
          const id = s.activeThreadId || (list[0]?.id ?? null)
          if (!id) return { threads: list, activeThreadId: null }
          const next = list.map((t) =>
            t.id === id
              ? {
                  ...t,
                  messages: [...t.messages, msg],
                  updated_at: nowIso(),
                }
              : t
          )
          return { threads: next }
        }),

      mergeServerThreads: (serverThreads = []) =>
        set((s) => {
          const local = Array.isArray(s.threads) ? s.threads : []
          const map = new Map(local.map(t => [t.id, t]))
          for (const st of serverThreads) {
            const ex = map.get(st.id)
            if (ex) {
              map.set(st.id, {
                ...ex,
                title: st.title || ex.title || 'Chat',
                updated_at: st.updated_at || ex.updated_at || nowIso(),
              })
            } else {
              map.set(st.id, {
                id: st.id,
                title: st.title || 'Chat',
                updated_at: st.updated_at || nowIso(),
                messages: [],
              })
            }
          }
          const merged = Array.from(map.values()).sort(
            (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
          )
          return { threads: merged }
        }),

      setThreadMessages: (id, messages = []) =>
        set((s) => ({
          threads: (Array.isArray(s.threads) ? s.threads : []).map((t) =>
            t.id === id ? { ...t, messages } : t
          ),
        })),

      // -------- Legacy single-list chat (kept for compatibility) --------
      chatHistory: [],
      addChat: (msg) => {
        get().ensureThread()
        get().addMessageToActive(msg)
        set((s) => ({
          chatHistory: [
            ...(Array.isArray(s.chatHistory) ? s.chatHistory : []),
            msg,
          ],
        }))
      },
      clearChat: () => {
        const id = get().activeThreadId || get().ensureThread()
        set((s) => ({
          threads: (Array.isArray(s.threads) ? s.threads : []).map((t) =>
            t.id === id
              ? {
                  ...t,
                  messages: [
                    {
                      role: 'assistant',
                      text:
                        "Hi! I'm your AI fashion stylist. What would you like to explore today?",
                    },
                  ],
                  updated_at: nowIso(),
                }
              : t
          ),
          chatHistory: [],
        }))
      },

      // -------- Try-on (namespaced by user) --------
      // De-dupe by prediction_id OR result image URL
      addTryOn: (job) =>
        set((s) => {
          const uid = s.user?.id
          if (!uid) return {}
          const withMeta = { created_at: nowIso(), ...job }
          const curr = Array.isArray(s.tryOns) ? s.tryOns : []

          const idx = curr.findIndex((t) =>
            (withMeta.prediction_id && t.prediction_id === withMeta.prediction_id) ||
            (withMeta.result_url && t.result_url === withMeta.result_url) ||
            (withMeta.result_image_url && t.result_image_url === withMeta.result_image_url)
          )

          const next = idx === -1
            ? [withMeta, ...curr]
            : curr.map((t, i) => (i === idx ? { ...t, ...withMeta } : t))

          const map = { ...(s.tryOnsByUser || {}) }
          map[uid] = next
          return { tryOns: next, tryOnsByUser: map }
        }),

      updateTryOn: (id, patch) =>
        set((s) => {
          const uid = s.user?.id
          if (!uid) return {}
          const curr = Array.isArray(s.tryOns) ? s.tryOns : []
          const next = curr.map((t) => (t.prediction_id === id ? { ...t, ...patch } : t))
          const map = { ...(s.tryOnsByUser || {}) }
          map[uid] = next
          return { tryOns: next, tryOnsByUser: map }
        }),

      removeTryOn: (predicateOrId) =>
        set((s) => {
          const uid = s.user?.id
          if (!uid) return {}
          const curr = Array.isArray(s.tryOns) ? s.tryOns : []
          const predicate = typeof predicateOrId === 'function'
            ? predicateOrId
            : (t) => t.prediction_id === predicateOrId
          const next = curr.filter((t) => !predicate(t))
          const map = { ...(s.tryOnsByUser || {}) }
          map[uid] = next
          return { tryOns: next, tryOnsByUser: map }
        }),

      // -------- Pins (namespaced by user) --------
      pinItem: (item) =>
        set((s) => {
          const uid = s.user?.id
          if (!uid || !item) return {}
          const id =
            item.id ||
            `${item.type || 'item'}:${item.image_url || item.url || ''}`
          const list = Array.isArray(s.pins) ? s.pins : []
          if (list.some((x) => x.id === id)) return {}
          const toSave = { ...item, id, added_at: item.added_at || nowIso() }
          const next = [toSave, ...list]
          const map = { ...(s.pinsByUser || {}) }
          map[uid] = next
          return { pins: next, pinsByUser: map }
        }),

      // helper used by ChatWindow to normalize product shape
      addPinFromProduct: (p) =>
        get().pinItem({
          id: `product:${p?.id || p?.product_url || p?.image_url || Math.random().toString(36).slice(2)}`,
          type: 'product',
          title: p?.name || 'Pinned product',
          image_url: p?.image_url || '',
          product_url: p?.product_url || p?.url || null,
          price: p?.price || '',
          added_at: nowIso(),
        }),

      unpinItem: (id) =>
        set((s) => {
          const uid = s.user?.id
          if (!uid) return {}
          const next = (Array.isArray(s.pins) ? s.pins : []).filter((p) => p.id !== id)
          const map = { ...(s.pinsByUser || {}) }
          map[uid] = next
          return { pins: next, pinsByUser: map }
        }),

      // -------- UI --------
      uiAuthOpen: false,
      uiAuthMode: 'signin',
      openAuth: (mode = 'signin') => set({ uiAuthOpen: true, uiAuthMode: mode }),
      closeAuth: () => set({ uiAuthOpen: false }),

      // IMPORTANT: Do NOT wipe per-user maps on logout.
      // We only clear "active view" so the next login can restore.
      logout: () =>
        set({
          token: null,
          user: null,
          photos: [],
          garments: [],
          chatHistory: [],
          threads: [],
          activeThreadId: null,
          tryOns: [],
          pins: [],
          // keep tryOnsByUser & pinsByUser in storage
        }),
    }),
    {
      name: 'matchin-storage',
      version: 5,
      migrate: (state) => {
        // Backward compatible migration
        const migrated = {
          token: state?.token ?? null,
          user: state?.user ?? null,
          photos: Array.isArray(state?.photos) ? state.photos : [],
          garments: Array.isArray(state?.garments) ? state.garments : [],
          // Old versions kept global tryOns/pins. Keep those as the "active view".
          tryOns: Array.isArray(state?.tryOns) ? state.tryOns : [],
          pins: Array.isArray(state?.pins) ? state.pins : [],
          // Maps (new). Seed with empty objects if missing.
          tryOnsByUser: state?.tryOnsByUser && typeof state.tryOnsByUser === 'object'
            ? state.tryOnsByUser
            : {},
          pinsByUser: state?.pinsByUser && typeof state.pinsByUser === 'object'
            ? state.pinsByUser
            : {},
          threads: Array.isArray(state?.threads) ? state.threads : [],
          activeThreadId:
            typeof state?.activeThreadId === 'string'
              ? state.activeThreadId
              : null,
          chatHistory: Array.isArray(state?.chatHistory) ? state.chatHistory : [],
          uiAuthOpen: !!state?.uiAuthOpen,
          uiAuthMode: state?.uiAuthMode || 'signin',
        }

        // If we have a user and legacy tryOns/pins but no maps, seed the maps now
        const uid = migrated.user?.id
        if (uid) {
          if (Object.keys(migrated.tryOnsByUser).length === 0 && migrated.tryOns.length) {
            migrated.tryOnsByUser = { [uid]: migrated.tryOns }
          }
          if (Object.keys(migrated.pinsByUser).length === 0 && migrated.pins.length) {
            migrated.pinsByUser = { [uid]: migrated.pins }
          }
        }

        return migrated
      },
    }
  )
)
