import { useEffect, useRef } from 'react'
import { useStore } from '../../store'
import FeatureCard from './FeatureCard'
import {
  Bot,
  Image as ImageIcon,
  LayoutGrid,
  Search,
  Shield,
  Sparkles,
} from 'lucide-react'

export default function FeaturesSection() {
  const openAuth = useStore((s) => s.openAuth)
  const ref = useRef(null)

  // stagger reveal on scroll
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const items = Array.from(root.querySelectorAll('.feat-card'))
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.style.opacity = 1
            e.target.style.transform = 'translateY(0)'
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.18 }
    )
    items.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const features = [
    { icon: <Bot className="h-5 w-5" />,        title: 'AI Stylist Chat',   text: 'Describe your vibe and get curated picks—instantly.' },
    { icon: <ImageIcon className="h-5 w-5" />,  title: 'Virtual Try-On',    text: 'Preview outfits on your photo before you add to cart.' },
    { icon: <LayoutGrid className="h-5 w-5" />, title: 'Moodboard Pins',    text: 'Save products & try-ons, compare looks, build a capsule.' },
    { icon: <Search className="h-5 w-5" />,     title: 'Smart Search',      text: 'Browse multi-brand options with clean, shoppable cards.' },
    { icon: <Shield className="h-5 w-5" />,     title: 'Private by Design', text: 'Your photos stay yours. Remove anytime. Secure by default.' },
    { icon: <Sparkles className="h-5 w-5" />,   title: 'Threads & History', text: 'Keep ideas organized; revisit and continue seamlessly.' },
  ]

  return (
    <section id="features" ref={ref} className="relative mx-auto max-w-7xl px-6 pb-24 md:pb-32">
      {/* Soft backdrop */}
      <div
        className="pointer-events-none absolute inset-x-4 top-10 -z-10 rounded-[48px]"
        style={{
          height: '60%',
          background:
            'radial-gradient(60% 60% at 50% 0%, rgba(255,255,255,.9), rgba(244,243,241,.7) 45%, rgba(244,243,241,0) 70%)',
        }}
      />

      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl" style={{ color: '#1f1f1f' }}>
          Everything you need to look your best
        </h2>
        <p className="mt-2 text-base md:text-lg" style={{ color: '#8a8988' }}>
          Fast. Personal. Effortless. Try looks, curate favorites, and shop with confidence.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <FeatureCard key={f.title} icon={f.icon} title={f.title} text={f.text} delay={i * 70} />
        ))}
      </div>

      {/* CTA */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={() => openAuth('signup')}
          className="rounded-full px-6 py-3 font-semibold shadow-[0_12px_34px_rgba(251,114,50,.28)] transition hover:opacity-95"
          style={{ background: '#fb7232', color: '#ffe1d4' }}
        >
          Create Your Look
        </button>
      </div>

      <style>{`
        :root { --easing: cubic-bezier(.21,.8,.35,1); }
        @keyframes spinBorder { to { transform: rotate(360deg); } }
      `}</style>
    </section>
  )
}
