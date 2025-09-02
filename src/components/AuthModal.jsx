import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { login, registerUser, getProfile } from '../api/auth'
import { listPhotos } from '../api/files'
import { X } from 'lucide-react'

const ink = '#1f1f1f'
const muted = '#8a8988'
const paper = '#f4f3f1'
const cta = '#fb7232'
const ctaText = '#ffe1d4'

export default function AuthModal() {
  const open = useStore(s => s.uiAuthOpen)
  const modeStore = useStore(s => s.uiAuthMode)
  const close = useStore(s => s.closeAuth)
  const setToken = useStore(s => s.setToken)
  const setUser = useStore(s => s.setUser)
  const setPhotos = useStore(s => s.setPhotos)
  const [mode, setMode] = useState(modeStore)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  const nav = useNavigate()

  if (!open) return null

  async function handleSignin(email, password) {
    const { access_token } = await login(email, password)
    setToken(access_token)
    const me = await getProfile(access_token)
    setUser(me)
    const data = await listPhotos(access_token)
    setPhotos(data.photos || [])
    if ((data.photos || []).length > 0) nav('/dashboard')
    else nav('/onboarding/upload')
    close()
  }

  async function handleSignup(form) {
    await registerUser(form)
    await handleSignin(form.email, form.password)
  }

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/30 p-4">
      <div
        className="w-full max-w-lg rounded-2xl border shadow-xl"
        style={{ background: '#fff', borderColor: 'rgba(2,2,2,0.08)' }}
      >
        {/* Header */}
<div className="flex items-center justify-between px-6 pt-5 pb-3">
  <h3
    className="inline-flex items-baseline gap-2 text-2xl font-extrabold tracking-tight"
    style={{ color: '#1f1f1f' }}
  >
    <span>Welcome to</span>
    {/* remove align-middle; keep same font size/weight and tighten line-height */}
    <span className="brand-anim leading-none">MatchIN</span>
  </h3>

  <button
    onClick={close}
    className="rounded-lg p-1.5 hover:bg-black/5"
    title="Close"
    aria-label="Close"
  >
    <X />
  </button>
</div>


        {/* Tabs */}
        <div
          className="mx-6 mb-5 grid grid-cols-2 overflow-hidden rounded-xl border"
          style={{ background: paper, borderColor: 'rgba(2,2,2,0.08)' }}
        >
          <button
            className="px-3 py-2 text-sm transition"
            style={
              mode === 'signin'
                ? { background: '#fff', color: ink, fontWeight: 600 }
                : { color: muted }
            }
            onClick={() => setMode('signin')}
          >
            Sign In
          </button>
          <button
            className="px-3 py-2 text-sm transition"
            style={
              mode === 'signup'
                ? { background: '#fff', color: ink, fontWeight: 600 }
                : { color: muted }
            }
            onClick={() => setMode('signup')}
          >
            Sign Up
          </button>
        </div>

        {/* Forms */}
        <div className="px-6 pb-6">
          {mode === 'signin' ? (
            <SignIn busy={busy} setBusy={setBusy} err={err} setErr={setErr} onSubmit={handleSignin} />
          ) : (
            <SignUp busy={busy} setBusy={setBusy} err={err} setErr={setErr} onSubmit={handleSignup} />
          )}
        </div>
      </div>

      {/* brand text gradient */}
      <style>{`
        .brand-anim{
          background-image: linear-gradient(90deg, #fb7232, #ff9a62, #ffd3b8, #fb7232);
          background-size: 250% 250%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shimmer 2.2s ease-in-out infinite;
        }
        @keyframes shimmer{
          0%{ background-position: 0% 50%}
          50%{ background-position: 100% 50%}
          100%{ background-position: 0% 50%}
        }
      `}</style>
    </div>
  )
}

function SignIn({ busy, setBusy, err, setErr, onSubmit }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  async function submit(e) {
    e.preventDefault()
    setErr(null)
    setBusy(true)
    try {
      await onSubmit(email, password)
    } catch (e) {
      setErr('Invalid credentials')
    } finally {
      setBusy(false)
    }
  }
  return (
    <form onSubmit={submit} className="space-y-3">
      <LabeledInput label="Email">
        <input
          className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
          style={{
            borderColor: 'rgba(2,2,2,0.12)',
            background: '#fff',
            color: ink,
            boxShadow: 'inset 0 1px 0 rgba(0,0,0,0.02)',
          }}
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </LabeledInput>
      <LabeledInput label="Password">
        <input
          className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
          style={{
            borderColor: 'rgba(2,2,2,0.12)',
            background: '#fff',
            color: ink,
          }}
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </LabeledInput>
      {err && <div className="text-sm" style={{ color: '#d13c3c' }}>{err}</div>}
      <button
        className="mt-2 w-full rounded-lg py-2.5 font-medium shadow-sm disabled:opacity-50"
        style={{ background: cta, color: ctaText }}
        disabled={busy}
      >
        {busy ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  )
}

function SignUp({ busy, setBusy, err, setErr, onSubmit }) {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '' })
  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  async function submit(e) {
    e.preventDefault()
    setErr(null)
    setBusy(true)
    try {
      await onSubmit(form)
    } catch (e) {
      setErr('Sign up failed. Check your info.')
    } finally {
      setBusy(false)
    }
  }
  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        <LabeledInput label="First Name">
          <input
            name="first_name"
            value={form.first_name}
            onChange={onChange}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
            style={{ borderColor: 'rgba(2,2,2,0.12)', background: '#fff', color: ink }}
            placeholder="First name"
          />
        </LabeledInput>
        <LabeledInput label="Last Name">
          <input
            name="last_name"
            value={form.last_name}
            onChange={onChange}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
            style={{ borderColor: 'rgba(2,2,2,0.12)', background: '#fff', color: ink }}
            placeholder="Last name"
          />
        </LabeledInput>
      </div>
      <LabeledInput label="Email">
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
          style={{ borderColor: 'rgba(2,2,2,0.12)', background: '#fff', color: ink }}
          placeholder="you@example.com"
        />
      </LabeledInput>
      <LabeledInput label="Password">
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
          style={{ borderColor: 'rgba(2,2,2,0.12)', background: '#fff', color: ink }}
          placeholder="Create a password"
        />
      </LabeledInput>
      {err && <div className="text-sm" style={{ color: '#d13c3c' }}>{err}</div>}
      <button
        className="mt-2 w-full rounded-lg py-2.5 font-medium shadow-sm disabled:opacity-50"
        style={{ background: cta, color: ctaText }}
        disabled={busy}
      >
        {busy ? 'Creating…' : 'Get Started'}
      </button>
    </form>
  )
}

function LabeledInput({ label, children }) {
  return (
    <label className="block">
      <div className="mb-1 text-sm" style={{ color: muted }}>{label}</div>
      {children}
    </label>
  )
}
