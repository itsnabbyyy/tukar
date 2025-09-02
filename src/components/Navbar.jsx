import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../store'

export default function Navbar({ variant = 'app' }) {
  const token = useStore(s => s.token)
  const user = useStore(s => s.user)
  const logout = useStore(s => s.logout)
  const openAuth = useStore(s => s.openAuth)

  const location = useLocation()
  const nav = useNavigate()

  const params = new URLSearchParams(location.search)
  const currentTab = params.get('tab') || 'chat'
  const tabUrl = (t) => `/dashboard?tab=${t}`

  const pill = (t) =>
    [
      'rounded-full px-4 py-2 text-sm transition',
      currentTab === t ? 'bg-black/5 text-ink' : 'text-ink/70 hover:bg-black/5',
    ].join(' ')

  return (
    <header className="sticky top-0 z-30 bg-paper/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <button onClick={() => nav('/')} className="flex items-center gap-3" aria-label="MatchIN Home">
          <img src="/mlogo.png" alt="MatchIN logo" className="h-10 w-10 rounded-2xl object-contain" />
          <div className="text-lg font-semibold tracking-wide text-ink">matchIN</div>
        </button>

        {/* center nav differs by variant */}
        {variant === 'landing' ? (
          <nav className="hidden items-center gap-2 md:flex">
            <a href="#features" className="rounded-full px-4 py-2 text-lg text-ink/70 hover:bg-black/5">Features</a>
            <a href="https://arvto.netlify.app/" target="_blank" rel="noreferrer"
               className="rounded-full px-4 py-2 text-lg text-ink/70 hover:bg-black/5">
              MatchinAR
            </a>
          </nav>
        ) : (
          <nav className="hidden items-center gap-2 md:flex">
            <Link to={tabUrl('chat')} className={pill('chat')}>AI Chat</Link>
            <Link to={tabUrl('tryon')} className={pill('tryon')}>Try On</Link>
            <Link to={tabUrl('mood')} className={pill('mood')}>Mood Board</Link>
          </nav>
        )}

        <div className="flex items-center gap-3">
          {!token ? (
            <>
              <button
                onClick={() => openAuth('signin')}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-ink hover:bg-black/5"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuth('signup')}
                className="rounded-full bg-cta px-4 py-2 text-sm font-semibold text-cta-text shadow-[0_6px_24px_rgba(0,0,0,.08)] hover:brightness-95"
              >
                Get Started
              </button>
            </>
          ) : (
            <>
              <span className="hidden text-ink/70 md:inline">Hi, {user?.first_name || 'you'}</span>
              <button
                onClick={logout}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-ink hover:bg-black/5"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
