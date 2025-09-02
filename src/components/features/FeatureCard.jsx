import { useRef, useEffect } from 'react'

function useTilt(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    let raf = null
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      const px = x / r.width
      const py = y / r.height
      const rx = (py - 0.5) * -16
      const ry = (px - 0.5) * 16
      if (!raf) {
        raf = requestAnimationFrame(() => {
          el.style.setProperty('--rx', `${rx.toFixed(2)}deg`)
          el.style.setProperty('--ry', `${ry.toFixed(2)}deg`)
          el.style.setProperty('--px', `${(px * 100).toFixed(1)}%`)
          el.style.setProperty('--py', `${(py * 100).toFixed(1)}%`)
          raf = null
        })
      }
    }
    const onLeave = () => {
      el.style.setProperty('--rx', '0deg')
      el.style.setProperty('--ry', '0deg')
      el.style.setProperty('--px', '50%')
      el.style.setProperty('--py', '50%')
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [ref])
}

export default function FeatureCard({ icon, title, text, delay = 0 }) {
  const ref = useRef(null)
  useTilt(ref)

  return (
    <div
      ref={ref}
      className="
        feat-card group relative overflow-hidden rounded-2xl border border-black/10 bg-white p-5
        translate-y-6 opacity-0 will-change-transform
      "
      style={{
        transition: 'transform .6s var(--easing), opacity .6s var(--easing)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {/* animated conic border */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 rounded-2xl"
        style={{
          padding: 2,
          background:
            'conic-gradient(from 0deg, rgba(251,114,50,.35), rgba(255,154,98,.25), rgba(255,211,184,.15), rgba(251,114,50,.35))',
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          animation: 'spinBorder 8s linear infinite',
        }}
      />

      {/* tilt wrapper */}
      <div
        className="relative"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'perspective(900px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))',
          transition: 'transform .2s ease-out',
        }}
      >
        {/* glare */}
        <div
          className="pointer-events-none absolute -inset-10 rounded-[32px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(220px 220px at var(--px,50%) var(--py,50%), rgba(255,255,255,.55), rgba(255,255,255,0))',
          }}
        />

        <div className="flex items-start gap-3" style={{ transform: 'translateZ(32px)' }}>
          <div
            className="grid h-10 w-10 place-items-center rounded-xl text-white shadow-md shadow-[rgba(251,114,50,.25)]"
            style={{ background: 'linear-gradient(135deg,#fb7232,#ff9a62)', transform: 'translateZ(18px)' }}
          >
            {icon}
          </div>
          <div className="flex-1">
            <div className="font-semibold" style={{ color: '#1f1f1f' }}>{title}</div>
            <div className="mt-1 text-sm" style={{ color: '#8a8988' }}>{text}</div>
          </div>
        </div>

        <div
          className="mt-4 inline-flex items-center gap-1 text-sm opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1"
          style={{ color: '#fb7232', transform: 'translateZ(24px)' }}
        >
          Learn more →
        </div>
      </div>
    </div>
  )
}
